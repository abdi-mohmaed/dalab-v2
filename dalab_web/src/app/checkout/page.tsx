'use client';

import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Container,
    Paper,
    Button,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    Divider,
    Stack,
    Alert,
    CircularProgress,
    TextField,
    Grid
} from '@mui/material';
import {
    AccountBalanceWallet as WalletIcon,
    PhoneAndroid as PhoneIcon,
    CreditCard as CardIcon,
    CheckCircle as CheckCircleIcon,
    LocationOn as LocationIcon
} from '@mui/icons-material';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { AddressSelector } from '@/components/checkout/AddressSelector';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { StripePaymentForm } from '@/components/checkout/StripePaymentForm';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_mock');
const PAYMENT_METHODS = [
    { id: 'ZAAD', name: 'Zaad Service', icon: <PhoneIcon color="primary" />, description: 'Pay using Telesom Zaad', disabled: false },
    { id: 'EDAHAB', name: 'eDahab', icon: <PhoneIcon color="secondary" />, description: 'Pay using Somtel eDahab', disabled: false },
    { id: 'EVC_PLUS', name: 'EVC Plus', icon: <PhoneIcon color="success" />, description: 'Pay using Hormuud EVC Plus', disabled: false },
    { id: 'CARD', name: 'Credit/Debit Card', icon: <CardIcon color="action" />, description: 'Visa / Mastercard', disabled: false },
];

export default function CheckoutPage() {
    const { items, totalPrice, clearCart } = useCart();
    const [paymentMethod, setPaymentMethod] = useState('ZAAD');
    const [deliveryZones, setDeliveryZones] = useState<any[]>([]);
    const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
    const [deliveryFee, setDeliveryFee] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingZones, setIsLoadingZones] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [clientSecret, setClientSecret] = useState<string | null>(null);

    // Card State - Mock state removed (moved to Stripe component)    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');

    const router = useRouter();

    useEffect(() => {
        const fetchZones = async () => {
            try {
                const res = await fetch('/api/delivery/zones');
                const data = await res.json();
                if (data.zones) {
                    setDeliveryZones(data.zones);
                    if (data.zones.length > 0) {
                        setSelectedZoneId(data.zones[0].id);
                    }
                }
            } catch (err) {
                console.error('Failed to fetch zones', err);
            } finally {
                setIsLoadingZones(false);
            }
        };
        fetchZones();
    }, []);

    useEffect(() => {
        if (selectedZoneId) {
            const zone = deliveryZones.find(z => z.id === selectedZoneId);
            if (zone) {
                // Find matching rule (highest minOrderAmount <= totalPrice)
                const matchingRule = zone.rules
                    .filter((r: any) => r.minOrderAmount <= totalPrice)
                    .sort((a: any, b: any) => b.minOrderAmount - a.minOrderAmount)[0];

                setDeliveryFee(matchingRule ? matchingRule.fee : 0);
            }
        }
    }, [selectedZoneId, totalPrice, deliveryZones]);

    useEffect(() => {
        if (paymentMethod === 'CARD' && !clientSecret && items.length > 0) {
            const fetchIntent = async () => {
                try {
                    const res = await fetch('/api/payments/create-intent', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ items, deliveryFee }),
                    });
                    const data = await res.json();
                    if (data.clientSecret) {
                        setClientSecret(data.clientSecret);
                    }
                } catch (err) {
                    console.error('Failed to create payment intent', err);
                }
            };
            fetchIntent();
        }
    }, [paymentMethod, clientSecret, items, deliveryFee]);

    const handlePlaceOrder = async (paymentIntentId?: string) => {
        if (!selectedAddressId) {
            setError('Please select a delivery address');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const isCard = paymentMethod === 'CARD';
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items,
                    totalAmount: totalPrice,
                    paymentMethod,
                    deliveryZoneId: selectedZoneId,
                    addressId: selectedAddressId,
                    deliveryFee,
                    ...(isCard && paymentIntentId && {
                        paymentIntentId,
                        cardLast4: '****' // Mock for now, in a real hook you'd get this from Stripe
                    })
                })
            });

            if (res.ok) {
                setOrderSuccess(true);
                clearCart();
                setTimeout(() => {
                    router.push('/orders');
                }, 2000);
            } else {
                const data = await res.json();
                setError(data.error || 'Failed to place order');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (orderSuccess) {
        return (
            <Container maxWidth="sm" sx={{ py: 12, textAlign: 'center' }}>
                <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
                    Order Placed Successfully!
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 4 }}>
                    Thank you for your purchase. You will be redirected to your orders shortly.
                </Typography>
                <Button variant="contained" onClick={() => router.push('/orders')} sx={{ bgcolor: '#0046be' }}>
                    View My Orders
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>
                Checkout
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
                {/* Left Column: Payment & Shipping (Mock) */}
                <Box sx={{ flex: 2 }}>
                    <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2, mb: 3 }}>
                        <AddressSelector
                            selectedAddressId={selectedAddressId}
                            onSelect={(addr: any) => setSelectedAddressId((addr?.id as string) || null)}
                        />
                    </Paper>

                    <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2, mb: 3 }}>
                        <Typography variant="h6" sx={{ mb: 3, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LocationIcon color="primary" /> Delivery Zone
                        </Typography>

                        {isLoadingZones ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                                <CircularProgress size={24} />
                            </Box>
                        ) : (
                            <FormControl component="fieldset" fullWidth>
                                <RadioGroup
                                    value={selectedZoneId}
                                    onChange={(e) => setSelectedZoneId(e.target.value)}
                                >
                                    <Stack spacing={2}>
                                        {deliveryZones.map((zone) => (
                                            <Paper
                                                key={zone.id}
                                                variant="outlined"
                                                sx={{
                                                    p: 2,
                                                    cursor: 'pointer',
                                                    borderColor: selectedZoneId === zone.id ? '#FFC644' : '#e0e0e0',
                                                    bgcolor: selectedZoneId === zone.id ? '#fff9eb' : 'inherit',
                                                    '&:hover': {
                                                        borderColor: '#FFC644'
                                                    }
                                                }}
                                                onClick={() => setSelectedZoneId(zone.id)}
                                            >
                                                <FormControlLabel
                                                    value={zone.id}
                                                    control={<Radio sx={{ color: '#ccc', '&.Mui-checked': { color: '#FFC644' } }} />}
                                                    label={
                                                        <Box>
                                                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                                                {zone.name}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                {zone.rules[0]?.fee > 0 ? `$${zone.rules[0].fee} Delivery Fee` : 'Free Delivery possible'}
                                                            </Typography>
                                                        </Box>
                                                    }
                                                    sx={{ width: '100%', m: 0 }}
                                                />
                                            </Paper>
                                        ))}
                                    </Stack>
                                </RadioGroup>
                            </FormControl>
                        )}
                    </Paper>

                    <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2, mb: 3 }}>
                        <Typography variant="h6" sx={{ mb: 3, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <WalletIcon /> Payment Method
                        </Typography>

                        <FormControl component="fieldset" fullWidth>
                            <RadioGroup
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            >
                                <Stack spacing={2}>
                                    {PAYMENT_METHODS.map((method) => (
                                        <Paper
                                            key={method.id}
                                            variant="outlined"
                                            sx={{
                                                p: 2,
                                                cursor: method.disabled ? 'default' : 'pointer',
                                                borderColor: paymentMethod === method.id ? '#0046be' : '#e0e0e0',
                                                bgcolor: paymentMethod === method.id ? '#f0f4ff' : 'inherit',
                                                opacity: method.disabled ? 0.6 : 1,
                                                '&:hover': {
                                                    borderColor: method.disabled ? '#e0e0e0' : '#0046be'
                                                }
                                            }}
                                            onClick={() => !method.disabled && setPaymentMethod(method.id)}
                                        >
                                            <FormControlLabel
                                                value={method.id}
                                                control={<Radio color="primary" />}
                                                disabled={method.disabled}
                                                label={
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                        {method.icon}
                                                        <Box>
                                                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                                                {method.name}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                {method.description}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                }
                                                sx={{ width: '100%', m: 0 }}
                                            />
                                        </Paper>
                                    ))}
                                </Stack>
                            </RadioGroup>
                        </FormControl>

                        {paymentMethod === 'CARD' ? (
                            <Box sx={{ mt: 3, p: 2, bgcolor: '#f5f7f9', borderRadius: 2 }}>
                                {clientSecret ? (
                                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                                        <StripePaymentForm
                                            totalAmount={totalPrice + deliveryFee}
                                            onSuccess={(piId) => handlePlaceOrder(piId)}
                                        />
                                    </Elements>
                                ) : (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                                        <CircularProgress size={32} />
                                    </Box>
                                )}
                            </Box>
                        ) : (
                            <Box sx={{ mt: 3, p: 3, bgcolor: '#fff9eb', borderRadius: 2, border: '1px dashed #FFC644' }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, color: '#b28900' }}>
                                    Payment Instructions
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 2 }}>
                                    Please send the total amount to the following number via <strong>{PAYMENT_METHODS.find(m => m.id === paymentMethod)?.name}</strong>:
                                </Typography>
                                <Paper elevation={0} sx={{ p: 2, bgcolor: '#fff', borderRadius: 1, textAlign: 'center', border: '1px solid #e0e0e0' }}>
                                    <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: 2 }}>
                                        +252 61 777 0000
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Use Order Reference: DALAB-{Date.now().toString().slice(-6)}
                                    </Typography>
                                </Paper>
                                <Typography variant="caption" sx={{ mt: 2, display: 'block', fontStyle: 'italic' }}>
                                    * Your order will be processed after payment confirmation by our team.
                                </Typography>
                            </Box>
                        )}
                    </Paper>

                    <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                            Order Details
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            By placing this order, you agree to Dalab's Terms of Service and Privacy Policy.
                        </Typography>
                    </Paper>
                </Box>

                {/* Right Column: Summary */}
                <Box sx={{ flex: 1 }}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            border: '1px solid #e0e0e0',
                            borderRadius: 2,
                            position: 'sticky',
                            top: 24,
                            bgcolor: '#f9f9f9'
                        }}
                    >
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                            Order Summary
                        </Typography>
                        <Stack spacing={2}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography color="text.secondary">Subtotal ({items.length} items)</Typography>
                                <Typography sx={{ fontWeight: 600 }}>${totalPrice.toFixed(2)}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography color="text.secondary">Shipping Fee</Typography>
                                <Typography sx={{ color: deliveryFee === 0 ? 'success.main' : 'text.primary', fontWeight: 600 }}>
                                    {deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}
                                </Typography>
                            </Box>
                            <Divider />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>Total (VAT Inc.)</Typography>
                                <Typography variant="h6" sx={{ fontWeight: 700, color: '#0046be' }}>
                                    ${(totalPrice + deliveryFee).toFixed(2)}
                                </Typography>
                            </Box>

                            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

                            <Button
                                variant="contained"
                                fullWidth
                                size="large"
                                disabled={isSubmitting || items.length === 0 || paymentMethod === 'CARD'}
                                onClick={() => handlePlaceOrder()}
                                sx={{
                                    mt: 2,
                                    bgcolor: '#0046be',
                                    py: 1.5,
                                    fontWeight: 700,
                                    '&:hover': { bgcolor: '#00369a' }
                                }}
                            >
                                {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Confirm Order'}
                            </Button>
                        </Stack>
                    </Paper>
                </Box>
            </Box>
        </Container>
    );
}
