import stringSimilarity from 'string-similarity';
import imghash from 'imghash';

/**
 * Detects if a product is a potential duplicate based on title
 */
export function isPotentialDuplicateByTitle(
    title: string,
    existingTitles: string[],
    threshold: number = 0.85
): { isDuplicate: boolean; confidence: number; match?: string } {
    if (!title || existingTitles.length === 0) {
        return { isDuplicate: false, confidence: 0 };
    }

    const matches = stringSimilarity.findBestMatch(title.toLowerCase(), existingTitles.map(t => t.toLowerCase()));

    return {
        isDuplicate: matches.bestMatch.rating >= threshold,
        confidence: matches.bestMatch.rating,
        match: matches.bestMatch.rating >= threshold ? matches.bestMatch.target : undefined
    };
}

/**
 * Compares two image hashes (perceptual hashing)
 * Returns true if hashes are similar enough
 */
export function isDuplicateByImageHash(
    hash1: string,
    hash2: string,
    threshold: number = 10 // Hamming distance threshold
): boolean {
    if (!hash1 || !hash2) return false;

    // Simple hex to binary Hamming distance calculation
    let distance = 0;
    for (let i = 0; i < hash1.length; i++) {
        const h1 = parseInt(hash1[i], 16);
        const h2 = parseInt(hash2[i], 16);
        let x = h1 ^ h2;
        while (x > 0) {
            distance++;
            x &= (x - 1);
        }
    }

    return distance <= threshold;
}

/**
 * Generates an image hash from a buffer
 */
export async function generateImageHash(buffer: Buffer): Promise<string> {
    const hash = await imghash.hash(buffer);
    return hash;
}

export function isDuplicateByExternalId(
    externalId: string,
    existingIds: string[]
): boolean {
    if (!externalId) return false;
    return existingIds.includes(externalId);
}
