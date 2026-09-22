import { supabaseAdmin } from '@/lib/supabaseClient';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

const BUCKET_NAME = 'products';

/**
 * Ensures the product-images bucket exists and is public
 */
export async function ensureStorageBucket() {
    if (!supabaseAdmin) throw new Error("supabaseAdmin is not initialized");
    const { data: buckets, error: listError } = await supabaseAdmin.storage.listBuckets();

    if (listError) {
        console.error('Error listing buckets:', listError);
        return;
    }

    const exists = buckets?.find((b: any) => b.name === BUCKET_NAME);

    if (!exists) {
        const { error: createError } = await supabaseAdmin.storage.createBucket(BUCKET_NAME, {
            public: true,
            allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
            fileSizeLimit: 5242880 // 5MB
        });

        if (createError) {
            console.error('Error creating bucket:', createError);
        } else {
            console.log(`Created ${BUCKET_NAME} storage bucket.`);
        }
    }
}

/**
 * Resizes an image buffer to 500x500px and uploads it to Supabase
 */
export async function uploadProductImage(
    imageBuffer: Buffer,
    fileName: string,
    folder: string = 'products',
    contentType: string = 'image/webp'
): Promise<string | null> {
    if (!supabaseAdmin) throw new Error("supabaseAdmin is not initialized");
    try {
        let processedBuffer = imageBuffer;
        let finalContentType = contentType;
        let extension = contentType.split('/')[1] || 'bin';

        // Only process images if NOT in banners folder (preserve banner quality)
        // And make sure it IS an image before using sharp
        const isImage = contentType.startsWith('image/');
        const isBanner = folder === 'banners' || folder.includes('banner');

        if (isImage && !isBanner) {
            // Resize product images to 500x500
            processedBuffer = await sharp(imageBuffer)
                .resize(500, 500, {
                    fit: 'cover',
                    position: 'center'
                })
                .webp({ quality: 80 })
                .toBuffer();
            finalContentType = 'image/webp';
            extension = 'webp';
        }

        // Generate unique filename
        const cleanFileName = fileName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const finalPath = `${folder}/${cleanFileName}_${Date.now()}.${extension}`;

        // Upload to Supabase
        const { data, error } = await supabaseAdmin
            .storage
            .from(BUCKET_NAME)
            .upload(finalPath, processedBuffer, {
                contentType: finalContentType,
                cacheControl: '3600',
                upsert: false
            });

        if (error) {
            console.error('Supabase upload error:', error);
            return null;
        }

        // Get public URL
        const { data: { publicUrl } } = supabaseAdmin
            .storage
            .from(BUCKET_NAME)
            .getPublicUrl(finalPath);

        return publicUrl;
    } catch (err) {
        console.error('Error in uploadProductImage:', err);
        return null;
    }
}

/**
 * Batch upload multiple images
 */
export async function uploadProductImages(
    images: { buffer: Buffer; name: string }[],
    folder: string = 'products'
): Promise<string[]> {
    const uploadPromises = images.map(img => uploadProductImage(img.buffer, img.name, folder));
    const urls = await Promise.all(uploadPromises);
    return urls.filter((url): url is string => url !== null);
}
