import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

// GET /api/wishlist - Get user's wishlist
export async function GET(request: NextRequest) {
    const session = await getSession();

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const wishlistItems = await prisma.wishlist.findMany({
            where: { userId: session.id },
            include: {
                product: {
                    include: {
                        variants: {
                            where: { status: 'ACTIVE' },
                            take: 1
                        },
                        images: { orderBy: { order: 'asc' }, take: 1 }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ data: wishlistItems });
    } catch (error) {
        console.error('Wishlist GET Error:', error);
        return NextResponse.json({ error: 'Failed to fetch wishlist' }, { status: 500 });
    }
}

// POST /api/wishlist - Toggle product in wishlist
export async function POST(request: NextRequest) {
    const session = await getSession();

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { productId } = await request.json();

        if (!productId) {
            return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
        }

        // Check if already in wishlist
        const existing = await prisma.wishlist.findUnique({
            where: {
                userId_productId: {
                    userId: session.id,
                    productId: productId
                }
            }
        });

        if (existing) {
            // Remove from wishlist
            await prisma.wishlist.delete({
                where: { id: existing.id }
            });
            return NextResponse.json({ message: 'Removed from wishlist', action: 'REMOVED' });
        } else {
            // Add to wishlist
            const newItem = await prisma.wishlist.create({
                data: {
                    userId: session.id,
                    productId: productId
                }
            });
            return NextResponse.json({ message: 'Added to wishlist', action: 'ADDED', data: newItem });
        }
    } catch (error) {
        console.error('Wishlist POST Error:', error);
        return NextResponse.json({ error: 'Failed to update wishlist' }, { status: 500 });
    }
}
