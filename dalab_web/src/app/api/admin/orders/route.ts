import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
    const session = await getSession();

    // Safety check: Only admins can access this
    if (!session || session.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const orders = await prisma.order.findMany({
            where: {
                status: 'PENDING_PAYMENT',
                payment: {
                    method: {
                        in: ['ZAAD', 'EDAHAB', 'EVC_PLUS']
                    }
                }
            },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                },
                payment: true,
                items: {
                    include: {
                        variant: {
                            include: {
                                product: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json({ orders });
    } catch (error) {
        console.error('Admin Fetch Orders Error:', error);
        return NextResponse.json({ error: 'Failed to fetch pending orders' }, { status: 500 });
    }
}
