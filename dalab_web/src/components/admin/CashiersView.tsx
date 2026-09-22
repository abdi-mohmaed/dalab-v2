'use client';

import React, { useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Chip,
    IconButton,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { useDashboard } from '@/context/DashboardContext';
import { AdminTable } from './AdminTable';
import { Cashier } from '@/types/admin';

export function CashiersView() {
    const { cashiers, setCashiers } = useDashboard();
    const [open, setOpen] = useState(false);
    const [editCashier, setEditCashier] = useState<Partial<Cashier> | null>(null);

    const handleOpen = (c: Cashier | null = null) => {
        setEditCashier(c || { fullName: '', email: '', phoneNumber: '', role: 'Cashier', status: 'offline' });
        setOpen(true);
    };

    const handleSave = () => {
        if (editCashier?.id) {
            setCashiers(prev => prev.map(c => c.id === editCashier.id ? { ...c, ...editCashier } as Cashier : c));
        } else {
            const newC = { ...editCashier, id: `cas-${Date.now()}`, permissions: [], status: 'offline' } as Cashier;
            setCashiers(prev => [...prev, newC]);
        }
        setOpen(false);
    };

    const columns = [
        { id: 'fullName', label: 'Full Name', minWidth: 150 },
        { id: 'email', label: 'Email', minWidth: 150 },
        { id: 'phoneNumber', label: 'Phone Number', minWidth: 120 },
        { id: 'role', label: 'Role', minWidth: 120 },
        { id: 'status', label: 'Status', minWidth: 100, format: (val: string) => <Chip label={val} size="small" color={val === 'online' ? 'success' : 'default'} variant="outlined" /> },
        {
            id: 'actions',
            label: 'Actions',
            minWidth: 120,
            align: 'right',
            format: (_: any, row: Cashier) => (
                <Box>
                    <IconButton size="small" onClick={() => handleOpen(row)}><Edit fontSize="inherit" /></IconButton>
                    <IconButton size="small" color="error"><Delete fontSize="inherit" /></IconButton>
                </Box>
            )
        }
    ];

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>Cashiers</Typography>
                <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>
                    Add Cashier
                </Button>
            </Box>
            <Paper sx={{ width: '100%', borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <AdminTable
                    columns={columns as any}
                    rows={cashiers}
                    count={cashiers.length}
                    page={0}
                    rowsPerPage={10}
                    onPageChange={() => { }}
                    onRowsPerPageChange={() => { }}
                />
            </Paper>

            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
                <DialogTitle>Cashier Details</DialogTitle>
                <DialogContent dividers>
                    <TextField fullWidth label="Full Name" margin="normal" value={editCashier?.fullName || ''} onChange={(e) => setEditCashier({ ...editCashier!, fullName: e.target.value })} />
                    <TextField fullWidth label="Email" margin="normal" value={editCashier?.email || ''} onChange={(e) => setEditCashier({ ...editCashier!, email: e.target.value })} />
                    <TextField fullWidth label="Phone Number" margin="normal" value={editCashier?.phoneNumber || ''} onChange={(e) => setEditCashier({ ...editCashier!, phoneNumber: e.target.value })} />
                    <TextField fullWidth select label="Role" margin="normal" value={editCashier?.role || 'Cashier'} onChange={(e) => setEditCashier({ ...editCashier!, role: e.target.value })}>
                        <MenuItem value="Cashier">Standard Cashier</MenuItem>
                        <MenuItem value="Chief Cashier">Chief Cashier</MenuItem>
                        <MenuItem value="Manager">Manager</MenuItem>
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained">Save</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
