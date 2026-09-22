
import * as XLSX from 'xlsx';
import { Product } from '@/types/product';

// Define the shape of the raw Excel row based on the user's requirements
export interface ExcelProductRow {
    'Product ID'?: string | number;
    'SKU'?: string;
    'Product Title'?: string;
    'Short Description'?: string;
    'Rewritten Description'?: string;
    'Tags'?: string;
    'Colors'?: string;
    'Original Price'?: number | string;
    'Sale Price'?: number | string; // Assuming 'Real Price' or 'Sale Price'
    'Category'?: string;
    'Images (semicolon)'?: string;
    'Source'?: string;
    'Date Added'?: string;
    'Status'?: string;
    [key: string]: any;
}

export interface ParseResult {
    products: Partial<Product>[];
    errors: { row: number; error: string }[];
}

export const parseExcelFile = async (file: File): Promise<ParseResult> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const data = e.target?.result;
                const workbook = XLSX.read(data, { type: 'binary' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];

                // Parse to JSON with header row support
                const rows: ExcelProductRow[] = XLSX.utils.sheet_to_json(worksheet);
                const products: Partial<Product>[] = [];
                const errors: { row: number; error: string }[] = [];

                rows.forEach((row, index) => {
                    // 1-based row index (Header is 1, first data is 2)
                    const rowNum = index + 2;

                    // Basic Validation
                    // Helper to fuzzy get value
                    const getValue = (keys: string[]) => {
                        for (const k of keys) {
                            if (row[k] !== undefined && row[k] !== null && row[k] !== '') return row[k];
                            // Case insensitive check
                            const rowKeys = Object.keys(row);
                            const foundKey = rowKeys.find(rk => rk.toLowerCase().trim() === k.toLowerCase().trim());
                            if (foundKey && row[foundKey] !== undefined) return row[foundKey];
                        }
                        return undefined;
                    };

                    const title = getValue(['Product Title', 'Title', 'Name', 'Product Name']);

                    // Basic Validation
                    if (!title) {
                        // errors.push({ row: rowNum, error: 'Missing Product Title' });
                        // Don't error, just skip empty rows
                        return;
                    }

                    // Mapping
                    try {
                        const priceVal = getValue(['Sale Price', 'Price', 'Retail Price']);
                        const originalPriceVal = getValue(['Original Price', 'MSRP', 'Compare At Price']);
                        const imagesVal = getValue(['Images (semicolon)', 'Images', 'Image', 'Photos']);
                        const categoryVal = getValue(['Category', 'Type', 'Product Type']);
                        const statusVal = getValue(['Status', 'State']);
                        const skuVal = getValue(['SKU', 'Variant SKU']);
                        const descVal = getValue(['Rewritten Description', 'Description', 'Body']);
                        const shortDescVal = getValue(['Short Description', 'Summary']);

                        const product: any = {
                            externalId: getValue(['Internal ID', 'Product ID', 'ID'])?.toString(),
                            title: title,
                            shortDescription: getValue(['Short Description', 'Summary']) || '',
                            rewrittenDescription: getValue(['Full AI Description', 'Rewritten Description', 'Description', 'Body']) || '',
                            description: getValue(['Full AI Description', 'Description', 'Body']) || '',
                            tags: getValue(['Tags', 'Keywords']) || '',
                            source: getValue(['Source']) || 'Excel Import',
                            status: mapStatus(getValue(['Status', 'State'])),
                            price: parsePrice(getValue(['Base Price (AED)', 'Base Price', 'Sale Price', 'Price'])),
                            originalPrice: parsePrice(getValue(['Original Price (USD)', 'Original Price', 'MSRP', 'Compare At Price'])),

                            // Category
                            categoryName: getValue(['Category', 'Type', 'Product Type']),

                            // Images
                            images: parseImages(getValue(['Image URL', 'Image', 'Images (semicolon)', 'Images', 'Photos'])),
                            image: parseImages(getValue(['Image URL', 'Image', 'Images (semicolon)', 'Images', 'Photos']))[0]?.url || '',

                            // Variants (from Colors and SKU)
                            variants: parseVariants(row, rowNum, getValue(['SKU', 'Variant SKU']), getValue(['Base Price (AED)', 'Base Price', 'Sale Price', 'Price'])),
                        };

                        products.push(product);
                    } catch (err: any) {
                        errors.push({ row: rowNum, error: `Mapping error: ${err.message}` });
                    }
                });

                resolve({ products, errors });

            } catch (error) {
                reject(error);
            }
        };

        reader.onerror = (error) => reject(error);
        reader.readAsBinaryString(file);
    });
};

// --- Helpers ---

const parsePrice = (val: any): number => {
    if (!val) return 0;
    const num = parseFloat(val.toString().replace(/[^0-9.]/g, ''));
    return isNaN(num) ? 0 : num;
};

const mapStatus = (status: string | undefined): string => {
    if (!status) return 'ACTIVE';
    const s = status.toUpperCase();
    if (s.includes('INACTIVE') || s.includes('DRAFT')) return 'INACTIVE';
    return 'ACTIVE';
};

const parseImages = (imagesStr: string | undefined): { url: string, order: number }[] => {
    const placeholder = 'https://placehold.co/600x600?text=Manual+Upload+Required';

    if (!imagesStr) return [{ url: placeholder, order: 0 }];

    const images = imagesStr.split(';').map((url, i) => {
        let cleanUrl = url.trim();
        // If it looks like a local path (C:\...) or just a filename, use placeholder for now
        if (!cleanUrl.startsWith('http') && !cleanUrl.startsWith('/')) {
            return { url: placeholder, order: i };
        }
        return { url: cleanUrl, order: i };
    }).filter(img => img.url.length > 0);

    return images.length > 0 ? images : [{ url: placeholder, order: 0 }];
};

const parseVariants = (row: ExcelProductRow, rowId: number, skuVal?: string, priceVal?: any): any[] => {
    // Basic variant logic: If 'Colors' exists, create variants for each color.
    // If no colors, create one 'Default' variant.

    const colors = row['Colors'] ? row['Colors'].split(',').map(c => c.trim()) : [];

    // Priority: skuVal (from mapping) -> row['SKU'] -> generated fallback
    const rawSku = skuVal?.toString() || row['SKU']?.toString();
    const baseSku = rawSku ? rawSku.trim() : `IMP-${Date.now().toString(36).slice(-4)}-${rowId}`;

    const price = parsePrice(priceVal || row['Base Price (AED)'] || row['Base Price'] || row['Sale Price'] || row['Original Price']);

    if (colors.length > 0) {
        return colors.map((color, i) => {
            const colorSlug = color.toUpperCase().replace(/[^A-Z0-9]/g, '-');
            return {
                sku: colors.length > 1 ? `${baseSku}-${colorSlug}` : baseSku,
                price: price,
                stock: 100,
                status: 'ACTIVE',
                attributes: [
                    { name: 'Color', value: color }
                ]
            };
        });
    } else {
        return [{
            sku: baseSku,
            price: price,
            stock: 100,
            status: 'ACTIVE',
            attributes: []
        }];
    }
};
