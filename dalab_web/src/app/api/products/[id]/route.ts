import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    const { id } = params;

    try {
        const product = await prisma.product.findUnique({
            where: { id },
            include: {
                store: true,
                category: true,
                images: {
                    orderBy: { order: 'asc' }
                },
                variants: {
                    include: {
                        attributes: {
                            include: {
                                attribute: true
                            }
                        }
                    }
                }
            }
        });

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
    }
}
