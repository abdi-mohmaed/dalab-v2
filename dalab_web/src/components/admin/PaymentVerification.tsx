'use client';

import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Chip,
    CircularProgress,
    Alert,
    IconButton,
    Tooltip
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';

export default function PaymentVerification() {
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const fetchPendingOrders = async () => {
        try {
            const res = await fetch('/api/admin/orders');
            const data = await res.json();
            if (data.orders) {
                setOrders(data.orders);
            } else {
                setError(data.error || 'Failed to load orders');
            }
        } catch (err) {
            setError('Connection error');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingOrders();
    }, []);

    const handleConfirmPayment = async (orderId: string) => {
        setActionLoading(orderId);
        try {
            const res = await fetch(`/api/admin/orders/${orderId}/confirm-payment`, {
                method: 'POST'
            });
            if (res.ok) {
                setOrders(orders.filter(o => o.id !== orderId));
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to confirm payment');
            }
        } catch (err) {
            alert('Failed to confirm payment');
        } finally {
            setActionLoading(null);
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
        <Box sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ mb: 4, fontWeight: 700 }}>
                Payment Verification
                <Typography variant="body2" color="text.secondary">
                    Review and confirm manual payments (ZAAD, EDAHAB, EVC Plus)
                </Typography>
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#f5f7f9' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 700 }}>Order ID</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Customer</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Method</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Amount</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                            <TableCell sx={{ fontWeight: 700 }} align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                                    <Typography color="text.secondary">No pending payments found.</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            orders.map((order) => (
                                <TableRow key={order.id} hover>
                                    <TableCell>#{order.id.slice(-6).toUpperCase()}</TableCell>
                                    <TableCell>
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{order.user?.name || 'Guest'}</Typography>
                                        <Typography variant="caption" color="text.secondary">{order.user?.email}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={order.payment?.method}
                                            size="small"
                                            sx={{
                                                bgcolor: order.payment?.method === 'ZAAD' ? '#e3f2fd' : '#f3e5f5',
                                                color: order.payment?.method === 'ZAAD' ? '#1976d2' : '#7b1fa2',
                                                fontWeight: 600
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>${order.totalAmount.toFixed(2)}</TableCell>
                                    <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell align="right">
                                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                                            <Tooltip title="View Order Details">
                                                <IconButton size="small">
                                                    <InfoIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Button
                                                variant="contained"
                                                size="small"
                                                startIcon={actionLoading === order.id ? <CircularProgress size={16} color="inherit" /> : <CheckCircleIcon />}
                                                onClick={() => handleConfirmPayment(order.id)}
                                                disabled={!!actionLoading}
                                                sx={{
                                                    bgcolor: 'success.main',
                                                    '&:hover': { bgcolor: 'success.dark' }
                                                }}
                                            >
                                                Confirm Payment
                                            </Button>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

function Stack({ children, direction = 'row', spacing = 0, justifyContent = 'flex-start' }: any) {
    return (
        <Box sx={{ display: 'flex', flexDirection: direction, gap: spacing, justifyContent }}>
            {children}
        </Box>
    );
}
