import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/products/search
 * Query Params:
 * - q: string (search query)
 * - page: number (default: 1)
 * - limit: number (default: 10)
 * - store: string (slug)
 * - category: string (name)
 */
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const store = searchParams.get('store');
    const category = searchParams.get('category');
    const source = searchParams.get('source');

    const skip = (page - 1) * limit;

    try {
        const where: any = {
            status: 'ACTIVE',
        };

        if (query) {
            where.OR = [
                { title: { contains: query, mode: 'insensitive' } },
                { description: { contains: query, mode: 'insensitive' } },
                { category: { name: { contains: query, mode: 'insensitive' } } }
            ];
        }

        if (source) {
            where.source = { equals: source, mode: 'insensitive' };
        }

        if (store) {
            where.store = { slug: store.toLowerCase() };
        }

        if (category) {
            where.category = { name: { equals: category, mode: 'insensitive' } };
        }

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                skip,
                take: limit,
                include: {
                    store: true,
                    category: true,
                    images: {
                        orderBy: { order: 'asc' }
                    },
                    variants: {
                        where: { status: 'ACTIVE' },
                        orderBy: { price: 'asc' }
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
            }),
            prisma.product.count({ where }),
        ]);

        const formattedProducts = products.map((p: any) => {
            const displayPrice = p.variants.length > 0 ? p.variants[0].price : 0;

            return {
                id: p.id,
                title: p.title,
                price: displayPrice,
                image: p.image,
                rating: p.rating,
                store: p.store.slug,
                category: p.category?.name,
                images: p.images.length > 0 ? p.images.map((img: any) => img.url) : [p.image],
                variants: p.variants,
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
        console.error('Error searching products:', error);
        return NextResponse.json({ error: 'Failed to search products' }, { status: 500 });
    }
}
