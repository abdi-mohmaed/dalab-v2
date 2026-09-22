'use client';

import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    Stepper,
    Step,
    StepLabel,
    Divider,
    Stack,
    CircularProgress,
    Button,
    Grid
} from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PaymentIcon from '@mui/icons-material/Payment';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const ORDER_STATUS_STEPS = [
    { label: 'Pending Payment', icon: PaymentIcon, status: 'PENDING_PAYMENT' },
    { label: 'Paid', icon: CheckCircleOutlineIcon, status: 'PAID' },
    { label: 'Processing', icon: ShoppingBagIcon, status: 'PROCESSING' },
    { label: 'Out for Delivery', icon: LocalShippingIcon, status: 'OUT_FOR_DELIVERY' },
    { label: 'Delivered', icon: CheckCircleOutlineIcon, status: 'DELIVERED' }
];

export default function OrderTrackingPage() {
    const params = useParams();
    const router = useRouter();
    const [order, setOrder] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                if (params) {
                    const resolvedParams = await params;
                    const res = await fetch(`/api/orders/${resolvedParams.orderId}`);

                    const data = await res.json();
                    if (data.order) {
                        setOrder(data.order);
                    } else {
                        setError(data.error || 'Order not found');
                    }
                }
            } catch (err) {
                setError('Failed to fetch order');
            } finally {
                setIsLoading(false);
            }
        };
        fetchOrder();
    }, [params]);

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress sx={{ color: '#FFC644' }} />
            </Box>
        );
    }

    if (error || !order) {
        return (
            <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
                <Typography variant="h5" color="error" gutterBottom>
                    {error || 'An unexpected error occurred'}
                </Typography>
                <Button variant="outlined" onClick={() => router.push('/orders')} sx={{ mt: 2 }}>
                    Back to My Orders
                </Button>
            </Container>
        );
    }

    const currentStep = ORDER_STATUS_STEPS.findIndex(step => step.status === order.status);
    const displayStep = currentStep === -1 ? (order.status === 'CANCELLED' ? -1 : 0) : currentStep;

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => router.push('/orders')}
                    sx={{ color: 'text.primary', fontWeight: 600 }}
                >
                    Back to Orders
                </Button>
            </Box>

            <Typography variant="h4" sx={{ mb: 1, fontWeight: 800 }}>
                Order Details
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                Order #{order.id.slice(-8).toUpperCase()} • Placed on {new Date(order.createdAt).toLocaleDateString()}
            </Typography>

            <Paper elevation={0} sx={{ p: 4, border: '1px solid #e0e0e0', borderRadius: 4, mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 4, fontWeight: 700 }}>
                    Track Order
                </Typography>
                {order.status === 'CANCELLED' ? (
                    <Box sx={{ textAlign: 'center', py: 2 }}>
                        <Typography variant="h6" color="error" sx={{ fontWeight: 700 }}>
                            ORDER CANCELLED
                        </Typography>
                        <Typography color="text.secondary">
                            This order has been cancelled and will not be fulfilled.
                        </Typography>
                    </Box>
                ) : (
                    <Stepper activeStep={displayStep} alternativeLabel>
                        {ORDER_STATUS_STEPS.map((step) => (
                            <Step key={step.label}>
                                <StepLabel>{step.label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                )}
            </Paper>

            <Grid container spacing={4}>
                <Grid item xs={12} md={8}>
                    <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 4, mb: 3 }}>
                        <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
                            Items Ordered
                        </Typography>
                        <Stack spacing={3}>
                            {order.items.map((item: any) => (
                                <Box key={item.id} sx={{ display: 'flex', gap: 2 }}>
                                    <Box
                                        sx={{
                                            width: 80,
                                            height: 80,
                                            bgcolor: '#f5f5f5',
                                            borderRadius: 2,
                                            flexShrink: 0,
                                            overflow: 'hidden'
                                        }}
                                    >
                                        <img
                                            src={item.variant.product.images?.[0]?.url || '/placeholder.png'}
                                            alt={item.variant.product.title}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    </Box>
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                            {item.variant.product.title}
                                        </Typography>
                                        {item.variant.attributes.map((attr: any) => (
                                            <Typography key={attr.id} variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                                {attr.attribute.name}: {attr.value}
                                            </Typography>
                                        ))}
                                        <Box sx={{ display: 'flex', justifySelf: 'space-between', alignItems: 'center', mt: 1 }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Qty: {item.quantity}
                                            </Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 700, ml: 'auto' }}>
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            ))}
                        </Stack>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 4, mb: 3 }}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                            Delivery Address
                        </Typography>
                        {order.address ? (
                            <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                    {order.address.fullName}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {order.address.addressLine1}
                                    {order.address.addressLine2 && `, ${order.address.addressLine2}`}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {order.address.city}, {order.address.region}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    {order.address.phoneNumber}
                                </Typography>
                            </Box>
                        ) : (
                            <Typography color="text.secondary">No address info</Typography>
                        )}
                    </Paper>

                    <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 4 }}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                            Order Summary
                        </Typography>
                        <Stack spacing={1}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography color="text.secondary">Items Total</Typography>
                                <Typography>${(order.totalAmount - order.deliveryFee).toFixed(2)}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography color="text.secondary">Shipping Fee</Typography>
                                <Typography>${order.deliveryFee.toFixed(2)}</Typography>
                            </Box>
                            <Divider sx={{ my: 1 }} />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography sx={{ fontWeight: 700 }}>Grand Total</Typography>
                                <Typography sx={{ fontWeight: 700, color: '#FFC644' }}>
                                    ${order.totalAmount.toFixed(2)}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                <Typography variant="caption" color="text.secondary">Payment Method</Typography>
                                <Typography variant="caption" sx={{ fontWeight: 600 }}>{order.payment?.method}</Typography>
                            </Box>
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}
