import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const session = await getSession();
    const { id } = await props.params;

    // Safety check: Only admins can access this
    if (!session || session.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // 1. Verify order exists and is pending payment
        const order = await prisma.order.findUnique({
            where: { id },
            include: { payment: true }
        });

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        if (order.status !== 'PENDING_PAYMENT') {
            return NextResponse.json({ error: 'Order is not in pending payment status' }, { status: 400 });
        }

        // 2. Update Order and Payment status in a transaction
        const updatedOrder = await prisma.$transaction([
            prisma.order.update({
                where: { id },
                data: { status: 'PAID' }
            }),
            prisma.payment.updateMany({
                where: { orderId: id },
                data: { status: 'CONFIRMED' }
            })
        ]);

        // 3. Create notification for the user
        await prisma.notification.create({
            data: {
                userId: order.userId,
                orderId: id,
                title: 'Payment Confirmed',
                message: `We have received your payment for Order #${id.slice(-6)}. Your items are being prepared.`,
                type: 'ORDER_STATUS'
            }
        });

        return NextResponse.json({ success: true, order: updatedOrder[0] });
    } catch (error) {
        console.error('Admin Confirm Payment Error:', error);
        return NextResponse.json({ error: 'Failed to confirm payment' }, { status: 500 });
    }
}
