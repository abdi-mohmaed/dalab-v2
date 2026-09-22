'use client';

import React, { useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Chip,
    IconButton,
    Divider,
    Alert
} from '@mui/material';
import { Visibility, Edit as EditIcon, LocalShipping as LocalShippingIcon, Receipt as ReceiptIcon } from '@mui/icons-material';
import { useDashboard } from '@/context/DashboardContext';
import { AdminTable } from './AdminTable';
import { Order, OrderStatus } from '@/types/order';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, MenuItem, TextField } from '@mui/material';

const ORDER_STATUSES: OrderStatus[] = [
    'PENDING_PAYMENT',
    'PAID',
    'PROCESSING',
    'READY_FOR_DELIVERY',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
    'CANCELLED',
    'REFUNDED'
];

export function OrdersView() {
    const { orders, setOrders } = useDashboard();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [newStatus, setNewStatus] = useState('');
    const [deliveryPartner, setDeliveryPartner] = useState('');
    const [deliveryPhone, setDeliveryPhone] = useState('');

    // Refund State
    const [openRefund, setOpenRefund] = useState(false);
    const [refundAmount, setRefundAmount] = useState(0);
    const [refundReason, setRefundReason] = useState('');
    const [refundType, setRefundType] = useState('FULL'); // FULL, PARTIAL

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING_PAYMENT': return 'warning';
            case 'PAID': return 'info';
            case 'PROCESSING': return 'primary';
            case 'READY_FOR_DELIVERY': return 'secondary';
            case 'OUT_FOR_DELIVERY': return 'info';
            case 'DELIVERED': return 'success';
            case 'CANCELLED': return 'error';
            case 'REFUNDED': return 'default';
            default: return 'default';
        }
    };

    const handleOpenDialog = (order: any) => {
        setSelectedOrder(order);
        setNewStatus(order.status);
        setDeliveryPartner(order.deliveryAssignment?.partnerName || '');
        setDeliveryPhone(order.deliveryAssignment?.partnerPhone || '');
        setOpenDialog(true);
    };

    const handleUpdateStatus = async () => {
        if (selectedOrder) {
            try {
                const res = await fetch(`/api/orders/${selectedOrder.id}/status`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        status: newStatus,
                        partnerName: deliveryPartner,
                        partnerPhone: deliveryPhone
                    })
                });

                if (res.ok) {
                    const { order } = await res.json();
                    setOrders((prev: Order[]) => prev.map((o: Order) => o.id === order.id ? order : o));
                } else {
                    const data = await res.json();
                    alert(data.error || 'Failed to update order status');
                }
            } catch (err) {
                alert('Failed to update order status');
            }
        }
        setOpenDialog(false);
    };

    const handleOpenRefund = (order: any) => {
        setSelectedOrder(order);
        setRefundAmount(order.totalAmount); // Default to full amount
        setRefundType('FULL');
        setRefundReason('');
        setOpenRefund(true);
    };

    const handleProcessRefund = async () => {
        if (!selectedOrder) return;
        try {
            const res = await fetch(`/api/orders/${selectedOrder.id}/refund`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: refundAmount,
                    reason: refundReason,
                    type: refundType
                })
            });

            if (res.ok) {
                alert('Refund processed successfully');
                setOpenRefund(false);
                // Ideally refresh orders list here
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to process refund');
            }
        } catch (err) {
            alert('Failed to process refund');
        }
    };

    const columns = [
        { id: 'id', label: 'Order ID', minWidth: 100 },
        { id: 'userId', label: 'Customer', minWidth: 150, format: (val: string) => `User: ${val.substring(0, 8)}` },
        { id: 'totalAmount', label: 'Total', minWidth: 100, format: (val: number) => `$${val.toLocaleString()}` },
        {
            id: 'status',
            label: 'Status',
            minWidth: 120,
            format: (val: string, row: Order) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip label={val} size="small" color={getStatusColor(val) as any} variant="outlined" />
                    <IconButton size="small" onClick={() => handleOpenDialog(row)}>
                        <EditIcon fontSize="inherit" />
                    </IconButton>
                </Box>
            )
        },
        {
            id: 'deliveryAssignment',
            label: 'Delivery',
            minWidth: 120,
            format: (val: any, row: Order) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {val?.partnerName ? (
                        <Chip
                            icon={<LocalShippingIcon />}
                            label={val.partnerName}
                            size="small"
                            color="primary"
                            variant="outlined"
                        />
                    ) : (
                        <Chip label="Unassigned" size="small" variant="outlined" />
                    )}
                    <IconButton size="small" onClick={() => handleOpenDialog(row)}>
                        <EditIcon fontSize="inherit" />
                    </IconButton>
                </Box>
            )
        },
        { id: 'createdAt', label: 'Date', minWidth: 150, format: (val: string) => new Date(val || Date.now()).toLocaleDateString() },
        {
            id: 'actions',
            label: 'Actions',
            minWidth: 80,
            align: 'right',
            format: (val: any, row: any) => (
                <Box>
                    <IconButton size="small"><Visibility fontSize="inherit" /></IconButton>
                    {['PAID', 'DELIVERED', 'READY_FOR_DELIVERY', 'OUT_FOR_DELIVERY'].includes(row.status) && (
                        <IconButton size="small" color="error" title="Refund" onClick={() => handleOpenRefund(row)}>
                            <ReceiptIcon fontSize="inherit" />
                        </IconButton>
                    )}
                </Box>
            )
        }
    ];

    return (
        <Box>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>Orders</Typography>
            </Box>

            <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <AdminTable
                    columns={columns as any}
                    rows={orders}
                    count={orders.length}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    onPageChange={(_, p) => setPage(p)}
                    onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
                />
            </Paper>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="xs">
                <DialogTitle>Update Order Status</DialogTitle>
                <DialogContent dividers>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                        Updating status for Order: <strong>{selectedOrder?.id}</strong>
                    </Typography>
                    <TextField
                        select
                        fullWidth
                        label="Status"
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                        SelectProps={{ native: true }}
                        sx={{ mb: 3 }}
                    >
                        {ORDER_STATUSES.map((status) => (
                            <option key={status} value={status}>
                                {status.replace(/_/g, ' ')}
                            </option>
                        ))}
                    </TextField>

                    <Divider sx={{ mb: 2 }} />
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>Delivery Assignment</Typography>

                    <TextField
                        fullWidth
                        label="Delivery Partner Name"
                        placeholder="e.g. John Doe / Delivery Co."
                        value={deliveryPartner}
                        onChange={(e) => setDeliveryPartner(e.target.value)}
                        margin="normal"
                    />

                    <TextField
                        fullWidth
                        label="Partner Phone"
                        placeholder="e.g. +252 6XXXXXX"
                        value={deliveryPhone}
                        onChange={(e) => setDeliveryPhone(e.target.value)}
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={handleUpdateStatus} variant="contained" color="primary">Update</Button>
                </DialogActions>
            </Dialog>

            {/* Refund Dialog */}
            <Dialog open={openRefund} onClose={() => setOpenRefund(false)} fullWidth maxWidth="xs">
                <DialogTitle>Process Refund</DialogTitle>
                <DialogContent dividers>
                    <Alert severity="warning" sx={{ mb: 2 }}>
                        This action cannot be undone. Verify details carefully.
                    </Alert>

                    <Typography variant="subtitle2" gutterBottom>
                        Order Total: ${selectedOrder?.totalAmount.toFixed(2)}
                    </Typography>

                    <TextField
                        select
                        fullWidth
                        label="Refund Type"
                        value={refundType}
                        onChange={(e) => {
                            setRefundType(e.target.value);
                            if (e.target.value === 'FULL') setRefundAmount(selectedOrder?.totalAmount || 0);
                        }}
                        SelectProps={{ native: true }}
                        sx={{ mb: 2, mt: 1 }}
                    >
                        <option value="FULL">Full Refund</option>
                        <option value="PARTIAL">Partial Refund</option>
                    </TextField>

                    <TextField
                        fullWidth
                        type="number"
                        label="Amount"
                        value={refundAmount}
                        disabled={refundType === 'FULL'}
                        onChange={(e) => setRefundAmount(parseFloat(e.target.value))}
                        sx={{ mb: 2 }}
                    />

                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Reason"
                        value={refundReason}
                        onChange={(e) => setRefundReason(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenRefund(false)}>Cancel</Button>
                    <Button onClick={handleProcessRefund} variant="contained" color="error">Refund</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
