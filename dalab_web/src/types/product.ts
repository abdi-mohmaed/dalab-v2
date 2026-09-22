export interface ProductType {
    id: string;
    name: string;
    attributes: AttributeDefinition[];
}

export interface AttributeDefinition {
    id: string;
    name: string;
    type: 'TEXT' | 'COLOR' | 'NUMBER' | 'SELECT';
}

export interface ProductAttribute {
    id: string;
    attributeId: string;
    attribute: AttributeDefinition;
    value: string;
}

export interface ProductVariant {
    id: string;
    productId: string;
    sku: string;
    price: number;
    stock: number;
    status: 'ACTIVE' | 'INACTIVE';
    image?: string;
    attributes: ProductAttribute[];
}

export interface Tag {
    id: string;
    name: string;
    displayName: string;
    color: string;
    icon?: string;
}

export interface ProductTag {
    id: string;
    productId: string;
    tagId: string;
    tag: Tag;
    enabled: boolean;
}

export interface UrgencyConfig {
    id?: string;
    productId?: string;
    enabled: boolean;
    type: 'COUNTDOWN' | 'STATIC';
    countdownHours?: number;
    countdownMinutes?: number;
    staticMessage?: string;
    messageTemplate: string;
}

export interface Product {
    id: string;
    title: string;
    price?: number; // Primarily derived from variants, but kept for UI compatibility
    description?: string;
    image: string; // Primary thumbnail
    rating: number;
    storeId?: string;
    store?: string;
    categoryId?: string;
    category?: string;
    productTypeId?: string;
    productType?: ProductType;
    images?: { id: string; url: string; order: number }[];
    variants?: ProductVariant[];
    status?: 'ACTIVE' | 'INACTIVE';
    createdAt?: string;

    // Advanced Labeling Fields
    productTags?: ProductTag[];
    showTags?: boolean;
    distributionTags?: string[] | string; // Can be JSON array string or array
    showDistributionTags?: boolean;
    manualRating?: number;
    useAutoRating?: boolean;
    showRating?: boolean;
    urgencyConfig?: UrgencyConfig;
    showDiscount?: boolean;
    discountPercentage?: number;
    originalPrice?: number;
}

export interface AiExtractedProduct extends Partial<Product> {
    confidence: number;
    isDuplicate: boolean;
    duplicateOf?: string;
    qualityScore?: number;
    qualityIssues?: string[];
    sourceScreenshot?: string;
    extractionErrors?: string[];
    price_aed?: number;
    price_usd?: number;
}
