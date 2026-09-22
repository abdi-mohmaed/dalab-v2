import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Product } from '@/types/product';

/**
 * POST /api/admin/products/bulk
 * Bulk create products from an array
 */
export async function POST(request: NextRequest) {
    try {
        const products = await request.json();

        if (!Array.isArray(products)) {
            return NextResponse.json({ error: 'Input must be an array of products' }, { status: 400 });
        }

        const results = [];
        const errors = [];

        // 0. Resolve default store if needed
        let defaultStoreId = '';
        const firstStore = await prisma.store.findFirst();
        if (firstStore) {
            defaultStoreId = firstStore.id;
        }

        for (const p of products) {
            try {
                console.log(`Processing import ${products.indexOf(p) + 1}/${products.length}: ${p.title}`);

                // 1. Resolve Category
                let categoryId = p.categoryId;
                if (!categoryId && p.categoryName) {
                    // Try to find category by name (case-insensitive)
                    const existingCat = await prisma.category.findFirst({
                        where: { name: { equals: p.categoryName } }
                    });

                    if (existingCat) {
                        categoryId = existingCat.id;
                    } else if (p.categoryName.trim()) {
                        // Creating new category if it doesn't exist and name isn't empty
                        const newCat = await prisma.category.create({
                            data: { name: p.categoryName.trim() }
                        });
                        categoryId = newCat.id;
                    }
                }

                // 2. Prepare Variants (already unique-ified in parser, but we can do extra checks)
                // We'll use createMany if possible, but for simplicity with relations we'll stay with create
                const processedVariants = (p.variants || []).map((v: any) => ({
                    sku: v.sku,
                    price: v.price || p.price_usd || 0, // Fallback to p.price_usd if variant price is missing
                    stock: v.stock || 0,
                    status: v.status || 'ACTIVE',
                }));

                // 3. Create Product
                const finalStoreId = p.storeId || defaultStoreId;
                if (!finalStoreId) {
                    throw new Error('No store found to associate with product');
                }

                const newProduct = await prisma.product.create({
                    data: {
                        externalId: (p.externalId || p.external_id)?.toString(),
                        title: p.title || 'Untitled',
                        description: p.description || '',
                        shortDescription: p.shortDescription || p.short_description || '',
                        rewrittenDescription: p.rewrittenDescription || p.rewritten_description || '',
                        tags: p.tags,
                        source: p.source || (p.sourceScreenshot ? `AI Extraction: ${p.sourceScreenshot}` : 'Excel Import'),
                        originalPrice: p.originalPrice || p.original_price_aed,
                        image: p.image || 'https://placehold.co/600x600?text=Imported+Product',
                        status: p.status === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE',

                        // Relations
                        store: { connect: { id: finalStoreId } },
                        category: categoryId ? { connect: { id: categoryId } } : undefined,


                        variants: {
                            create: processedVariants
                        },

                        images: {
                            create: (p.images || []).map((img: any) => ({
                                url: img.url,
                                order: img.order || 0
                            }))
                        }
                    },
                    include: {
                        variants: true,
                        images: true,
                        category: true
                    }
                });
                results.push(newProduct);
                console.log(`Success: ${p.title}`);
            } catch (err: any) {
                console.error(`FAILED to import product: ${p.title} (Index: ${products.indexOf(p)})`, err);
                errors.push({ title: p.title || 'Unknown', error: err.message });
            }
        }

        return NextResponse.json({
            success: true,
            count: results.length,
            results: results,
            errors: errors.length > 0 ? errors : undefined
        });

    } catch (error: any) {
        console.error('Error in bulk import:', error);
        return NextResponse.json({ error: 'Internal server error during bulk import' }, { status: 500 });
    }
}

