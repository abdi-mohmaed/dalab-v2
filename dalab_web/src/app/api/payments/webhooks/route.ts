import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock');

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
    const body = await request.text();
    const headersList = await headers();
    const sig = headersList.get('stripe-signature');

    let event: Stripe.Event;

    try {
        if (!sig || !webhookSecret) {
            // Bypass verification in development if secret is missing but log a warning
            console.warn('Stripe Webhook: Skipping signature verification (Secret not found)');
            event = JSON.parse(body);
        } else {
            event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
        }
    } catch (err: any) {
        console.error(`Webhook Error: ${err.message}`);
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object as Stripe.PaymentIntent;
            console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);

            // Update order status if we have the orderId in metadata
            // In dalab, we currently use the paymentIntentId in the Payment model
            await prisma.payment.updateMany({
                where: { paymentIntentId: paymentIntent.id },
                data: { status: 'CONFIRMED' }, //dalab uses Enum Status { ACTIVE, INACTIVE, PENDING, CONFIRMED }
            });

            // Find the associated order to update its status to PAID
            const payment = await prisma.payment.findFirst({
                where: { paymentIntentId: paymentIntent.id },
                include: { order: true }
            });

            if (payment && payment.order) {
                await prisma.order.update({
                    where: { id: payment.orderId },
                    data: { status: 'PAID' }
                });

                // Optional: Create notification for user
                await prisma.notification.create({
                    data: {
                        userId: payment.order.userId,
                        orderId: payment.orderId,
                        title: 'Payment Received',
                        message: `Your payment was successful. Order #${payment.orderId.slice(-6)} is being processed.`,
                        type: 'ORDER_STATUS'
                    }
                });
            }
            break;

        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
}
