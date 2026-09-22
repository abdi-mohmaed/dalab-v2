import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
    const session = await getSession();
    if (!session) return NextResponse.json({ items: [] });

    try {
        const cart = await prisma.cart.findUnique({
            where: { userId: session.id },
            include: {
                items: {
                    include: {
                        variant: {
                            include: {
                                product: true,
                                attributes: {
                                    include: {
                                        attribute: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        if (!cart) return NextResponse.json({ items: [] });

        return NextResponse.json({
            items: cart.items.map((item: any) => ({
                id: item.variantId,
                productId: item.variant.productId,
                variantId: item.variantId,
                title: item.variant.product.title,
                price: item.variant.price,
                image: item.variant.image || item.variant.product.image,
                quantity: item.quantity,
                store: item.variant.product.storeId,
                attributes: item.variant.attributes.map((attr: any) => ({
                    name: attr.attribute.name,
                    value: attr.value
                }))
            }))
        });
    } catch (error) {
        console.error('Error fetching cart:', error);
        return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { variantId, quantity, setQuantity } = await request.json();

        if (!variantId) {
            return NextResponse.json({ error: 'Variant ID is required' }, { status: 400 });
        }

        // 1. Get or create cart for user
        let cart = await prisma.cart.findUnique({
            where: { userId: session.id }
        });

        if (!cart) {
            cart = await prisma.cart.create({
                data: { userId: session.id }
            });
        }

        // 2. Upsert cart item using variantId
        if (setQuantity !== undefined) {
            await prisma.cartItem.upsert({
                where: {
                    cartId_variantId: {
                        cartId: cart.id,
                        variantId: variantId
                    }
                },
                update: {
                    quantity: setQuantity
                },
                create: {
                    cartId: cart.id,
                    variantId: variantId,
                    quantity: setQuantity
                }
            });
        } else {
            await prisma.cartItem.upsert({
                where: {
                    cartId_variantId: {
                        cartId: cart.id,
                        variantId: variantId
                    }
                },
                update: {
                    quantity: {
                        increment: quantity || 1
                    }
                },
                create: {
                    cartId: cart.id,
                    variantId: variantId,
                    quantity: quantity || 1
                }
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating cart:', error);
        return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const searchParams = request.nextUrl.searchParams;
    const variantId = searchParams.get('variantId');

    if (!variantId) {
        return NextResponse.json({ error: 'Variant ID required' }, { status: 400 });
    }

    try {
        const cart = await prisma.cart.findUnique({
            where: { userId: session.id }
        });

        if (!cart) return NextResponse.json({ success: true });

        await prisma.cartItem.delete({
            where: {
                cartId_variantId: {
                    cartId: cart.id,
                    variantId: variantId
                }
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting from cart:', error);
        return NextResponse.json({ error: 'Failed to delete from cart' }, { status: 500 });
    }
}
