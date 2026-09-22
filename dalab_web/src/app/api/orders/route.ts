import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

// GET /api/orders - Get all orders for the current user
export async function GET(request: NextRequest) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const orders = await prisma.order.findMany({
            where: {
                userId: session.id
            },
            include: {
                items: {
                    include: {
                        variant: {
                            include: {
                                product: true
                            }
                        }
                    }
                },
                address: true,
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json({ orders });
    } catch (error) {
        console.error('Error fetching orders:', error);
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
}

// POST /api/orders - Create a new order
export async function POST(request: NextRequest) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { items, addressId, totalAmount, paymentMethod, paymentIntentId } = body;

        if (!items || items.length === 0) {
            return NextResponse.json({ error: 'No items in order' }, { status: 400 });
        }

        // Verify stock for all items
        for (const item of items) {
            const variant = await prisma.productVariant.findUnique({
                where: { id: item.variantId }
            });

            if (!variant || variant.stock < item.quantity) {
                return NextResponse.json({
                    error: `Insufficient stock for product ${item.variantId}`
                }, { status: 400 });
            }
        }

        // Create the order using a transaction
        const order = await prisma.$transaction(async (tx) => {
            // 1. Create the order
            const newOrder = await tx.order.create({
                data: {
                    userId: session.id,
                    addressId,
                    totalAmount: totalAmount || 0,
                    status: 'PENDING_PAYMENT',
                    items: {
                        create: items.map((item: any) => ({
                            variantId: item.variantId,
                            quantity: item.quantity,
                            price: item.price
                        }))
                    },
                    payment: {
                        create: {
                            amount: totalAmount || 0,
                            method: paymentMethod || 'CASH',
                            status: 'PENDING',
                            paymentIntentId: paymentIntentId
                        }
                    }
                },
                include: {
                    items: true,
                    payment: true
                }
            });

            // 2. Decrement stock
            for (const item of items) {
                await tx.productVariant.update({
                    where: { id: item.variantId },
                    data: {
                        stock: {
                            decrement: item.quantity
                        }
                    }
                });
            }

            return newOrder;
        });

        return NextResponse.json({ success: true, order });
    } catch (error) {
        console.error('Error creating order:', error);
        return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }
}
