import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/products
 * Query Params:
 * - page: number (default: 1)
 * - limit: number (default: 10)
 * - store: string (slug)
 * - category: string (name)
 */
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limitParams = searchParams.get('limit') || searchParams.get('pageSize') || '10';
    const limit = parseInt(limitParams);
    const store = searchParams.get('store');
    const category = searchParams.get('category');
    const categoryId = searchParams.get('categoryId');
    const source = searchParams.get('source');

    const skip = (page - 1) * limit;

    try {
        const where: any = {};

        if (source) {
            where.source = { equals: source, mode: 'insensitive' };
        }

        if (store && store.toLowerCase() !== 'dalab') {
            where.store = { slug: store.toLowerCase() };
        }
        if (category) {
            where.category = { name: { equals: category, mode: 'insensitive' } };
        }
        if (categoryId) {
            where.categoryId = categoryId;
        }

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                skip,
                take: limit,
                include: {
                    store: true,
                    category: true,
                    images: true,
                    variants: true,
                    productTags: {
                        include: {
                            tag: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc',
                },
            }),
            prisma.product.count({ where }),
        ]);

        const formattedProducts = products.map((p: any) => {
            // Senior logic: Use first variant price if available, otherwise 0
            const displayPrice = p.variants.length > 0 ? p.variants[0].price : 0;

            return {
                id: p.id,
                title: p.title,
                price: displayPrice,
                image: p.image,
                rating: p.rating,
                store: p.store.slug,
                storeId: p.storeId,
                category: p.category?.name,
                categoryId: p.categoryId,
                productTypeId: p.productTypeId,
                images: p.images.length > 0 ? p.images.map((img: any) => img.url) : [p.image],
                variants: p.variants,
                status: p.status,
                productTags: p.productTags,
                originalPrice: p.originalPrice || (displayPrice * 1.2), // Mock original price for UI if missing
            };
        });

        return NextResponse.json({
            data: formattedProducts,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}
