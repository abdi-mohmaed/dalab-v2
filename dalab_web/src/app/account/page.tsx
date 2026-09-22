'use client';

import React, { useEffect } from 'react';
import { Box, Typography, Button, Container, Paper, Avatar, Stack } from '@mui/material';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import PersonIcon from '@mui/icons-material/Person';

export default function AccountPage() {
    const { user, logout, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
        }
    }, [user, isLoading, router]);

    if (isLoading || !user) {
        return null; // Or a loader
    }

    return (
        <Container maxWidth="sm" sx={{ py: 8 }}>
            <Paper elevation={0} sx={{ p: 4, bgcolor: 'transparent' }}>
                <Stack direction="column" alignItems="center" spacing={2} sx={{ mb: 4 }}>
                    <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main', fontSize: 32 }}>
                        {user.name ? user.name[0].toUpperCase() : <PersonIcon />}
                    </Avatar>
                    <Box textAlign="center">
                        <Typography variant="h5" fontWeight="bold">
                            Hello, {user.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {user.email}
                        </Typography>
                    </Box>
                </Stack>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Button variant="outlined" fullWidth size="large">
                        My Orders
                    </Button>
                    <Button variant="outlined" fullWidth size="large">
                        Addresses
                    </Button>
                    <Button variant="outlined" fullWidth size="large">
                        Wishlist
                    </Button>

                    <Button
                        variant="contained"
                        color="error"
                        fullWidth
                        size="large"
                        onClick={logout}
                        sx={{ mt: 2 }}
                    >
                        Log Out
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
}
