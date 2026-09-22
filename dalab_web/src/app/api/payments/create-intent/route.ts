import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock');

export async function POST(request: NextRequest) {
    try {
        const { items, deliveryFee } = await request.json();

        // In a real app, you would fetch prices from the database for security
        // For now, we calculate from the request (mocking database prices is also fine for this phase)
        const amount = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0) + (deliveryFee || 0);

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Stripe expects cents
            currency: 'usd',
            automatic_payment_methods: {
                enabled: true,
            },
            metadata: {
                // Link to order later or pass item summary
                itemCount: items.length.toString(),
            },
        });

        return NextResponse.json({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error: any) {
        console.error('Stripe error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
