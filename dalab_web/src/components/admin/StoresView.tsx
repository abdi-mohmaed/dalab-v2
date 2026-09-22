'use client';

import React, { useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    IconButton,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { useDashboard } from '@/context/DashboardContext';
import { AdminTable } from './AdminTable';
import { Store } from '@/types/admin';

export function StoresView() {
    const { stores, setStores } = useDashboard();
    const [open, setOpen] = useState(false);
    const [editItem, setEditItem] = useState<Partial<Store> | null>(null);

    const handleOpen = (item: Store | null = null) => {
        setEditItem(item || { name: '', slug: '' });
        setOpen(true);
    };

    const handleSave = () => {
        if (editItem?.id) {
            setStores(prev => prev.map(s => s.id === editItem.id ? { ...s, ...editItem } as Store : s));
        } else {
            const newItem = { ...editItem, id: `sto-${Date.now()}` } as Store;
            setStores(prev => [...prev, newItem]);
        }
        setOpen(false);
    };

    const columns = [
        { id: 'name', label: 'Store Name', minWidth: 200 },
        { id: 'slug', label: 'Slug', minWidth: 150 },
        {
            id: 'actions',
            label: 'Actions',
            minWidth: 120,
            align: 'right',
            format: (_: any, row: Store) => (
                <Box>
                    <IconButton size="small" onClick={() => handleOpen(row)}><Edit fontSize="inherit" /></IconButton>
                    <IconButton size="small" color="error" onClick={() => {
                        if (window.confirm('Delete this store?')) {
                            setStores(prev => prev.filter(s => s.id !== row.id));
                        }
                    }}><Delete fontSize="inherit" /></IconButton>
                </Box>
            )
        }
    ];

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>Stores</Typography>
                <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>
                    Add Store
                </Button>
            </Box>
            <Paper sx={{ width: '100%', borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <AdminTable
                    columns={columns as any}
                    rows={stores}
                    count={stores.length}
                    page={0}
                    rowsPerPage={10}
                    onPageChange={() => { }}
                    onRowsPerPageChange={() => { }}
                />
            </Paper>

            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
                <DialogTitle>Store Details</DialogTitle>
                <DialogContent dividers>
                    <TextField fullWidth label="Name" margin="normal" value={editItem?.name || ''} onChange={(e) => setEditItem({ ...editItem!, name: e.target.value })} />
                    <TextField fullWidth label="Slug" margin="normal" value={editItem?.slug || ''} onChange={(e) => setEditItem({ ...editItem!, slug: e.target.value })} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained">Save</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
