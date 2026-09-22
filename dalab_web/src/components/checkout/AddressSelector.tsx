'use client';

import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    IconButton,
    Radio,
    Button,
    CircularProgress,
    Stack,
    Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { AddressForm } from './AddressForm';

interface AddressSelectorProps {
    selectedAddressId?: string | null;
    onSelect: (address: any) => void;
}

export function AddressSelector({ selectedAddressId, onSelect }: AddressSelectorProps) {
    const [addresses, setAddresses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingAddress, setEditingAddress] = useState<any>(null);

    const fetchAddresses = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/addresses');
            if (res.ok) {
                const data = await res.json();
                setAddresses(data);

                // Auto-select default address if none selected
                if (!selectedAddressId && data.length > 0) {
                    const defaultAddr = data.find((a: any) => a.isDefault) || data[0];
                    onSelect(defaultAddr);
                }
            }
        } catch (error) {
            console.error('Error fetching addresses:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, []);

    const handleFormSubmit = async (formData: any) => {
        const url = editingAddress ? `/api/addresses/${editingAddress.id}` : '/api/addresses';
        const method = editingAddress ? 'PUT' : 'POST';

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        if (res.ok) {
            setShowForm(false);
            setEditingAddress(null);
            fetchAddresses();
        } else {
            const data = await res.json();
            throw new Error(data.error || 'Failed to save address');
        }
    };

    if (loading && !showForm) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress size={32} sx={{ color: '#FFC644' }} />
            </Box>
        );
    }

    if (showForm) {
        return (
            <AddressForm
                initialData={editingAddress}
                onSubmit={handleFormSubmit}
                onCancel={() => {
                    setShowForm(false);
                    setEditingAddress(null);
                }}
            />
        );
    }

    return (
        <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Delivery Address
                </Typography>
                <Button
                    startIcon={<AddIcon />}
                    size="small"
                    onClick={() => setShowForm(true)}
                    sx={{ color: '#FFC644', fontWeight: 600 }}
                >
                    Add New
                </Button>
            </Box>

            {addresses.length === 0 ? (
                <Box
                    sx={{
                        p: 4,
                        border: '1px dashed #ccc',
                        borderRadius: 2,
                        textAlign: 'center',
                        bgcolor: '#fafafa'
                    }}
                >
                    <Typography color="text.secondary" sx={{ mb: 2 }}>
                        No saved addresses found
                    </Typography>
                    <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={() => setShowForm(true)}
                        sx={{ borderColor: '#FFC644', color: '#000' }}
                    >
                        Add Your First Address
                    </Button>
                </Box>
            ) : (
                <Stack spacing={2}>
                    {addresses.map((address) => (
                        <Card
                            key={address.id}
                            onClick={() => onSelect(address)}
                            sx={{
                                cursor: 'pointer',
                                border: selectedAddressId === address.id ? '2px solid #FFC644' : '1px solid #eee',
                                boxShadow: 'none',
                                '&:hover': { bgcolor: '#fdfdfd' }
                            }}
                        >
                            <CardContent sx={{ p: '16px !important', display: 'flex', gap: 2 }}>
                                <Radio
                                    checked={selectedAddressId === address.id}
                                    sx={{
                                        p: 0,
                                        mt: 0.5,
                                        alignSelf: 'flex-start',
                                        color: '#ccc',
                                        '&.Mui-checked': { color: '#FFC644' }
                                    }}
                                />
                                <Box sx={{ flex: 1 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                            {address.fullName}
                                        </Typography>
                                        {address.isDefault && (
                                            <Chip label="Default" size="small" sx={{ height: 20, fontSize: '0.65rem', bgcolor: '#f0f0f0' }} />
                                        )}
                                    </Box>
                                    <Typography variant="body2" color="text.secondary">
                                        {address.phoneNumber}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                        {address.addressLine1}{address.addressLine2 ? `, ${address.addressLine2}` : ''}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {address.city}, {address.region} {address.postalCode}
                                    </Typography>
                                </Box>
                                <IconButton
                                    size="small"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setEditingAddress(address);
                                        setShowForm(true);
                                    }}
                                    sx={{ alignSelf: 'flex-start' }}
                                >
                                    <EditIcon fontSize="small" />
                                </IconButton>
                            </CardContent>
                        </Card>
                    ))}
                </Stack>
            )}
        </Box>
    );
}
