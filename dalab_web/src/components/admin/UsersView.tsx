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
    Stack,
} from '@mui/material';
import { Edit, Delete, Add, Person } from '@mui/icons-material';
import { useDashboard } from '@/context/DashboardContext';
import { AdminTable } from './AdminTable';
import { Cashier } from '@/types/admin';

export function UsersView() {
    const { users } = useDashboard();

    const columns = [
        { id: 'name', label: 'Full Name', minWidth: 150 },
        { id: 'email', label: 'Email Address', minWidth: 200 },
        { id: 'role', label: 'Role', minWidth: 120, format: (val: string) => <Chip label={val} size="small" color={val === 'ADMIN' ? 'secondary' : 'default'} /> },
        {
            id: 'actions',
            label: 'Actions',
            minWidth: 80,
            align: 'right',
            format: () => (
                <IconButton size="small"><Edit fontSize="inherit" /></IconButton>
            )
        }
    ];

    return (
        <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>User Management</Typography>
            <Paper sx={{ width: '100%', borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <AdminTable
                    columns={columns as any}
                    rows={users}
                    count={users.length}
                    page={0}
                    rowsPerPage={10}
                    onPageChange={() => { }}
                    onRowsPerPageChange={() => { }}
                />
            </Paper>
        </Box>
    );
}
