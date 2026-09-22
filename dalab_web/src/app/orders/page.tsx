'use client';

import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Container,
    Paper,
    Stack,
    Chip,
    Divider,
    CircularProgress
} from '@mui/material';
import {
    ChevronRight as ChevronRightIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { EmptyState } from '@/components/common/EmptyState';

export default function OrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch('/api/orders');
                const data = await res.json();
                if (data.orders) {
                    setOrders(data.orders);
                }
            } catch (err) {
                console.error('Failed to fetch orders', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status.toUpperCase()) {
            case 'PENDING': return 'warning';
            case 'PAID': return 'success';
            case 'COMPLETED': return 'success';
            case 'CANCELLED': return 'error';
            default: return 'default';
        }
    };

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>
                My Orders
            </Typography>

            {orders.length === 0 ? (
                <EmptyState
                    type="orders"
                    title="No orders yet"
                    description="You haven't placed any orders with us yet. When you do, they will appear here."
                    actionLabel="Go to Marketplace"
                    onAction={() => router.push('/')}
                />
            ) : (
                <Stack spacing={3}>
                    {orders.map((order) => (
                        <Paper
                            key={order.id}
                            elevation={0}
                            sx={{
                                p: 3,
                                border: '1px solid #e0e0e0',
                                borderRadius: 2,
                                cursor: 'pointer',
                                '&:hover': { bgcolor: '#fcfcfc' }
                            }}
                            onClick={() => router.push(`/orders/${order.id}`)}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Order ID: {order.id.toUpperCase().slice(0, 8)}
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                                    </Typography>
                                </Box>
                                <Chip
                                    label={order.status}
                                    color={getStatusColor(order.status) as any}
                                    size="small"
                                    sx={{ fontWeight: 700 }}
                                />
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                    ${order.totalAmount.toFixed(2)}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', color: 'primary.main' }}>
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                        Details
                                    </Typography>
                                    <ChevronRightIcon />
                                </Box>
                            </Box>

                            <Box sx={{ mt: 2, display: 'flex', gap: 1, overflowX: 'auto', pb: 1 }}>
                                {order.items.slice(0, 3).map((item: any) => (
                                    <Box
                                        key={item.id}
                                        component="img"
                                        src={item.variant?.product?.image || '/placeholder.png'}
                                        sx={{ width: 50, height: 50, borderRadius: 1, objectFit: 'cover', border: '1px solid #eee' }}
                                    />
                                ))}
                                {order.items.length > 3 && (
                                    <Box sx={{ width: 50, height: 50, borderRadius: 1, bgcolor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Typography variant="body2">+{order.items.length - 3}</Typography>
                                    </Box>
                                )}
                            </Box>
                        </Paper>
                    ))}
                </Stack>
            )}
        </Container>
    );
}
