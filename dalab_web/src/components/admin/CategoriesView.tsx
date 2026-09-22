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
import { Category } from '@/types/admin';

export function CategoriesView() {
    const { categories, saveCategory, deleteCategory } = useDashboard();
    const [open, setOpen] = useState(false);
    const [editItem, setEditItem] = useState<Partial<Category> | null>(null);

    const handleOpen = (item: Category | null = null) => {
        setEditItem(item || { name: '', image: '' });
        setOpen(true);
    };

    const handleSave = async () => {
        if (editItem) {
            await saveCategory(editItem);
        }
        setOpen(false);
    };

    const columns = [
        { id: 'name', label: 'Category Name', minWidth: 200 },
        { id: 'image', label: 'Image URL', minWidth: 200 },
        {
            id: 'actions',
            label: 'Actions',
            minWidth: 120,
            align: 'right',
            format: (_: any, row: Category) => (
                <Box>
                    <IconButton size="small" onClick={() => handleOpen(row)}><Edit fontSize="inherit" /></IconButton>
                    <IconButton size="small" color="error" onClick={() => {
                        if (window.confirm('Delete this category?')) {
                            deleteCategory(row.id);
                        }
                    }}><Delete fontSize="inherit" /></IconButton>
                </Box>
            )
        }
    ];

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>Categories</Typography>
                <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>
                    Add Category
                </Button>
            </Box>
            <Paper sx={{ width: '100%', borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <AdminTable
                    columns={columns as any}
                    rows={categories}
                    count={categories.length}
                    page={0}
                    rowsPerPage={10}
                    onPageChange={() => { }}
                    onRowsPerPageChange={() => { }}
                />
            </Paper>

            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
                <DialogTitle>Category Details</DialogTitle>
                <DialogContent dividers>
                    <TextField fullWidth label="Name" margin="normal" value={editItem?.name || ''} onChange={(e) => setEditItem({ ...editItem!, name: e.target.value })} />
                    <TextField fullWidth label="Image URL" margin="normal" value={editItem?.image || ''} onChange={(e) => setEditItem({ ...editItem!, image: e.target.value })} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained">Save</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
