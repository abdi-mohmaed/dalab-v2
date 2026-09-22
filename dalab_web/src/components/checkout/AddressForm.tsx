'use client';

import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Grid,
    FormControlLabel,
    Switch,
    CircularProgress,
    Alert
} from '@mui/material';

interface AddressFormProps {
    initialData?: any;
    onSubmit: (data: any) => Promise<void>;
    onCancel?: () => void;
}

export function AddressForm({ initialData, onSubmit, onCancel }: AddressFormProps) {
    const [formData, setFormData] = useState({
        fullName: initialData?.fullName || '',
        phoneNumber: initialData?.phoneNumber || '',
        addressLine1: initialData?.addressLine1 || '',
        addressLine2: initialData?.addressLine2 || '',
        city: initialData?.city || '',
        region: initialData?.region || '',
        postalCode: initialData?.postalCode || '',
        isDefault: initialData?.isDefault || false,
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, checked, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await onSubmit(formData);
        } catch (err: any) {
            setError(err.message || 'An error occurred while saving the address');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                {initialData ? 'Edit Address' : 'Add New Address'}
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Full Name"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        variant="outlined"
                        size="small"
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Phone Number"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        required
                        variant="outlined"
                        size="small"
                        placeholder="+252..."
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Address Line 1"
                        name="addressLine1"
                        value={formData.addressLine1}
                        onChange={handleChange}
                        required
                        variant="outlined"
                        size="small"
                        placeholder="House / Office, Street"
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Address Line 2 (Optional)"
                        name="addressLine2"
                        value={formData.addressLine2}
                        onChange={handleChange}
                        variant="outlined"
                        size="small"
                        placeholder="Apartment, Landmark, etc."
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        label="City"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        variant="outlined"
                        size="small"
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        label="Region"
                        name="region"
                        value={formData.region}
                        onChange={handleChange}
                        required
                        variant="outlined"
                        size="small"
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Postal Code (Optional)"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        variant="outlined"
                        size="small"
                    />
                </Grid>
                <Grid item xs={12}>
                    <FormControlLabel
                        control={
                            <Switch
                                name="isDefault"
                                checked={formData.isDefault}
                                onChange={handleChange}
                                color="primary"
                            />
                        }
                        label="Set as default address"
                    />
                </Grid>
            </Grid>

            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Button
                    fullWidth
                    variant="contained"
                    type="submit"
                    disabled={loading}
                    sx={{
                        bgcolor: '#FFC644',
                        color: '#000',
                        fontWeight: 600,
                        '&:hover': {
                            bgcolor: '#e6b23d',
                        },
                    }}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Save Address'}
                </Button>
                {onCancel && (
                    <Button
                        fullWidth
                        variant="outlined"
                        onClick={onCancel}
                        disabled={loading}
                        sx={{ color: '#666', borderColor: '#ccc' }}
                    >
                        Cancel
                    </Button>
                )}
            </Box>
        </Box>
    );
}
