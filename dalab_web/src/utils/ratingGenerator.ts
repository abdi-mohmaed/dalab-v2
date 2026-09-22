/**
 * Generate a random rating between 1 and 5 stars
 * Used when useAutoRating is enabled for a product
 */
export function generateRandomRating(): number {
    return Math.floor(Math.random() * 5) + 1; // Returns 1, 2, 3, 4, or 5
}

/**
 * Get the effective rating for a product
 * Returns manual rating if set, otherwise auto-generated or default
 */
export function getProductRating(product: {
    manualRating?: number | null;
    useAutoRating?: boolean;
    rating?: number;
}): number {
    if (product.manualRating) {
        return product.manualRating;
    }

    if (product.useAutoRating) {
        return generateRandomRating();
    }

    return product.rating || 0;
}
