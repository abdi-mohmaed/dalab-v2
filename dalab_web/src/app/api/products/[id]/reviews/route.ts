import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

// GET /api/products/[id]/reviews - Fetch all reviews for a product
export async function GET(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    const { id } = params;

    try {
        const reviews = await prisma.review.findMany({
            where: { productId: id },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ data: reviews });
    } catch (error) {
        console.error('Reviews GET Error:', error);
        return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
    }
}

// POST /api/products/[id]/reviews - Submit a review
export async function POST(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const session = await getSession();
    const params = await props.params;
    const { id } = params;

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { rating, comment } = await request.json();

        if (!rating || rating < 1 || rating > 5) {
            return NextResponse.json({ error: 'Invalid rating' }, { status: 400 });
        }

        // 1. Verify user purchased the product
        const hasPurchased = await prisma.order.findFirst({
            where: {
                userId: session.id,
                status: 'DELIVERED',
                items: {
                    some: {
                        variant: {
                            productId: id
                        }
                    }
                }
            }
        });

        if (!hasPurchased) {
            return NextResponse.json({ error: 'You can only review products you have purchased and received' }, { status: 403 });
        }

        // 2. Check if already reviewed
        const alreadyReviewed = await prisma.review.findFirst({
            where: {
                productId: id,
                userId: session.id
            }
        });

        if (alreadyReviewed) {
            return NextResponse.json({ error: 'You have already reviewed this product' }, { status: 400 });
        }

        // 3. Create review & update product rating
        const [review] = await prisma.$transaction([
            prisma.review.create({
                data: {
                    productId: id,
                    userId: session.id,
                    rating,
                    comment
                }
            }),
        ]);

        // Calculate and update global product rating
        const allReviews = await prisma.review.findMany({ where: { productId: id } });
        const avgRating = allReviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / allReviews.length;

        await prisma.product.update({
            where: { id: id },
            data: { rating: parseFloat(avgRating.toFixed(1)) }
        });

        return NextResponse.json({ success: true, data: review });
    } catch (error) {
        console.error('Review submission error:', error);
        return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
    }
}
