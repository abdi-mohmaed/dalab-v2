'use client';

import React, { useState } from 'react';
import {
    PaymentElement,
    useStripe,
    useElements
} from '@stripe/react-stripe-js';
import {
    Box,
    Button,
    Typography,
    CircularProgress,
    Alert
} from '@mui/material';

interface StripePaymentFormProps {
    onSuccess: (paymentIntentId: string) => void;
    totalAmount: number;
}

export function StripePaymentForm({ onSuccess, totalAmount }: StripePaymentFormProps) {
    const stripe = useStripe();
    const elements = useElements();

    const [message, setMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsLoading(true);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Return URL for redirection if needed
                return_url: `${window.location.origin}/checkout/success`,
            },
            redirect: 'if_required', // We want to handle success ourselves if it doesn't need redirect
        });

        if (error) {
            if (error.type === "card_error" || error.type === "validation_error") {
                setMessage(error.message || 'An error occurred');
            } else {
                setMessage("An unexpected error occurred.");
            }
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            onSuccess(paymentIntent.id);
        }

        setIsLoading(false);
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                Card Details
            </Typography>

            <PaymentElement id="payment-element" options={{ layout: 'tabs' }} />

            {message && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    {message}
                </Alert>
            )}

            <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isLoading || !stripe || !elements}
                sx={{
                    mt: 3,
                    bgcolor: '#FFC644',
                    color: '#000',
                    fontWeight: 700,
                    py: 1.5,
                    borderRadius: 2,
                    '&:hover': {
                        bgcolor: '#e6b23d',
                    }
                }}
            >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : `Pay $${totalAmount.toFixed(2)}`}
            </Button>
        </Box>
    );
}
