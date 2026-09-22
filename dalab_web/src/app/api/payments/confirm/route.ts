import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { createNotification } from '@/lib/notifications';

export async function POST(request: NextRequest) {
    const session = await getSession();

    // Check if user is CASHIER or ADMIN
    if (!session || (session.role !== 'CASHIER' && session.role !== 'ADMIN')) {
        return NextResponse.json({ error: 'Unauthorized. Cashier access required.' }, { status: 403 });
    }

    try {
        const { paymentId, status, rejectionReason } = await request.json();

        if (!['CONFIRMED', 'INACTIVE'].includes(status)) {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
        }

        const payment = await prisma.payment.findUnique({
            where: { id: paymentId },
            include: { order: { include: { user: true } } }
        });

        if (!payment) {
            return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
        }

        // Update payment and order status
        const updatedPayment = await prisma.payment.update({
            where: { id: paymentId },
            data: {
                status: status === 'CONFIRMED' ? 'ACTIVE' : 'INACTIVE', // Mapping schema Status enum
                transactionId: status === 'CONFIRMED' ? `CONF-${Date.now()}` : null
            }
        });

        if (status === 'CONFIRMED') {
            await prisma.order.update({
                where: { id: payment.orderId },
                data: { status: 'PAID' }
            });

            await createNotification(
                payment.order.userId,
                'Payment Confirmed',
                'Your payment has been confirmed! Your order is now being processed.'
            );
        }

        // Audit Log
        await prisma.auditLog.create({
            data: {
                userId: session.id,
                action: status === 'CONFIRMED' ? 'CONFIRM_PAYMENT' : 'REJECT_PAYMENT',
                entityId: paymentId,
                entityType: 'PAYMENT',
                newData: { status, rejectionReason }
            }
        });

        return NextResponse.json({ success: true, payment: updatedPayment });
    } catch (error) {
        console.error('Payment confirmation error:', error);
        return NextResponse.json({ error: 'Failed to process payment' }, { status: 500 });
    }
}
