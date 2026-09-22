'use client';

import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Container,
    Paper,
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
    Stack
} from '@mui/material';
import {
    Check as CheckIcon,
    Close as CloseIcon,
    Refresh as RefreshIcon
} from '@mui/icons-material';

export default function CashierDashboard() {
    const [payments, setPayments] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPendingPayments = async () => {
        setIsLoading(true);
        try {
            // In a real app, this would be a specific cashier endpoint
            const res = await fetch('/api/orders'); // Fetching all orders for simplicity in this demo
            const data = await res.json();
            // Filter for orders with status PAID
            const paid = data.orders.filter((o: any) => o.status === 'PAID');
            setPayments(paid);
        } catch (err) {
            setError('Failed to fetch pending payments');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingPayments();
    }, []);

    const handleConfirm = async (paymentId: string) => {
        try {
            const res = await fetch('/api/payments/confirm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paymentId, status: 'CONFIRMED' })
            });
            if (res.ok) {
                fetchPendingPayments();
            } else {
                const data = await res.json();
                alert(data.error);
            }
        } catch (err) {
            alert('Failed to confirm payment');
        }
    };

    const handleMarkReady = async (orderId: string) => {
        try {
            const res = await fetch(`/api/orders/${orderId}/status`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'READY_FOR_DELIVERY' })
            });
            if (res.ok) {
                fetchPendingPayments();
            } else {
                const data = await res.json();
                alert(data.error);
            }
        } catch (err) {
            alert('Failed to update status');
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    Cashier Dashboard
                </Typography>
                <Button startIcon={<RefreshIcon />} onClick={fetchPendingPayments}>
                    Refresh
                </Button>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#f8f8f8' }}>
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
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                                    <CircularProgress size={24} />
                                </TableCell>
                            </TableRow>
                        ) : payments.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                                    <Typography color="text.secondary">No pending payments found.</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            payments.map((order) => (
                                <TableRow key={order.id} hover>
                                    <TableCell>#{order.id.slice(0, 8).toUpperCase()}</TableCell>
                                    <TableCell>{order.user.email}</TableCell>
                                    <TableCell>
                                        <Chip label={order.payment.method} size="small" variant="outlined" />
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>${order.totalAmount.toFixed(2)}</TableCell>
                                    <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell align="right">
                                        <Button
                                            size="small"
                                            variant="contained"
                                            color="primary"
                                            startIcon={<CheckIcon />}
                                            onClick={() => handleMarkReady(order.id)}
                                        >
                                            Mark as Ready
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
}
