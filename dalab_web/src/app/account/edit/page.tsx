'use client';

import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    TextField,
    Button,
    Alert,
    CircularProgress,
    Paper,
    Divider,
    Stack,
    IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/navigation';

export default function EditProfilePage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    });

    useEffect(() => {
        async function fetchProfile() {
            try {
                const res = await fetch('/api/user/profile');
                if (res.ok) {
                    const data = await res.json();
                    setFormData(prev => ({
                        ...prev,
                        name: data.name || '',
                        email: data.email || '',
                    }));
                }
            } catch (err) {
                console.error('Failed to fetch profile', err);
            } finally {
                setIsLoading(false);
            }
        }
        fetchProfile();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        if (formData.newPassword && formData.newPassword !== formData.confirmNewPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match' });
            return;
        }

        setIsSaving(true);
        try {
            const res = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword,
                }),
            });

            const data = await res.json();
            if (res.ok) {
                setMessage({ type: 'success', text: 'Profile updated successfully' });
                setFormData(prev => ({
                    ...prev,
                    currentPassword: '',
                    newPassword: '',
                    confirmNewPassword: '',
                }));
            } else {
                setMessage({ type: 'error', text: data.error || 'Failed to update profile' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Connection failed' });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress sx={{ color: '#FFC644' }} />
            </Box>
        );
    }

    return (
        <Container maxWidth="sm" sx={{ py: 4 }}>
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                <IconButton onClick={() => router.back()} sx={{ mr: 1 }}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    Edit Profile
                </Typography>
            </Box>

            {message && (
                <Alert severity={message.type} sx={{ mb: 3 }}>
                    {message.text}
                </Alert>
            )}

            <Paper elevation={0} sx={{ p: 4, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                <Box component="form" onSubmit={handleSubmit}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                        Personal Information
                    </Typography>
                    <Stack spacing={2}>
                        <TextField
                            fullWidth
                            label="Full Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            variant="outlined"
                            size="small"
                        />
                        <TextField
                            fullWidth
                            label="Email Address"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            variant="outlined"
                            size="small"
                        />
                    </Stack>

                    <Divider sx={{ my: 4 }} />

                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                        Change Password
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 400 }}>
                            Leave blank to keep your current password
                        </Typography>
                    </Typography>
                    <Stack spacing={2}>
                        <TextField
                            fullWidth
                            label="Current Password"
                            name="currentPassword"
                            type="password"
                            value={formData.currentPassword}
                            onChange={handleChange}
                            variant="outlined"
                            size="small"
                            placeholder="Required to change password or email"
                        />
                        <TextField
                            fullWidth
                            label="New Password"
                            name="newPassword"
                            type="password"
                            value={formData.newPassword}
                            onChange={handleChange}
                            variant="outlined"
                            size="small"
                        />
                        <TextField
                            fullWidth
                            label="Confirm New Password"
                            name="confirmNewPassword"
                            type="password"
                            value={formData.confirmNewPassword}
                            onChange={handleChange}
                            variant="outlined"
                            size="small"
                        />
                    </Stack>

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={isSaving}
                        sx={{
                            mt: 4,
                            bgcolor: '#FFC644',
                            color: '#000',
                            fontWeight: 700,
                            py: 1.5,
                            borderRadius: 2,
                            '&:hover': {
                                bgcolor: '#e6b23d',
                            }
                        }}
                    >
                        {isSaving ? <CircularProgress size={24} color="inherit" /> : 'Save Changes'}
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
}
