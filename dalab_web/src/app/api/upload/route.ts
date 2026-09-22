import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { uploadProductImage, ensureStorageBucket } from '@/utils/imageUploadService';

export async function POST(request: NextRequest) {
    const session = await getSession();

    // Safety check: Only admins/cashiers can upload images
    if (!session || (session.role !== 'ADMIN' && session.role !== 'CASHIER')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Ensure bucket exists and is public (Safety check)
        await ensureStorageBucket();

        const formData: any = await request.formData();
        const file = formData.get('file') as File;
        const folder = formData.get('folder') as string || 'products';

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        // Validate file type (Images and Videos)
        if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
            return NextResponse.json({ error: 'Only images and videos are allowed' }, { status: 400 });
        }

        // Validate file size (e.g., 10MB limit for banners/videos)
        if (file.size > 10 * 1024 * 1024) {
            return NextResponse.json({ error: 'File size too large (max 10MB)' }, { status: 400 });
        }

        // Convert File to Buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload to Supabase
        const url = await uploadProductImage(buffer, file.name, folder, file.type);

        if (!url) {
            return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
        }

        return NextResponse.json({
            url,
            message: 'Image uploaded successfully to Supabase'
        });
    } catch (error) {
        console.error('Upload Error:', error);
        return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
    }
}
