'use client';

import React, { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    TextField,
    Button,
    Alert,
    CircularProgress,
    Paper,
    Link as MuiLink
} from '@mui/material';
import Link from 'next/link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setMessage(null);

        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();
            if (res.ok) {
                setMessage(data.message);
            } else {
                setError(data.error || 'Something went wrong');
            }
        } catch (err) {
            setError('Connection failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container maxWidth="xs">
            <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Paper elevation={3} sx={{ p: 4, width: '100%', borderRadius: 2 }}>
                    <Box sx={{ mb: 3 }}>
                        <Link href="/login" passHref style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: '#666' }}>
                            <ArrowBackIcon sx={{ fontSize: 20, mr: 1 }} />
                            <Typography variant="body2">Back to Login</Typography>
                        </Link>
                    </Box>

                    <Typography component="h1" variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                        Forgot Password? 🔐
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Enter your email address and we'll send you a link to reset your password.
                    </Typography>

                    {message && <Alert severity="success" sx={{ mb: 3 }}>{message}</Alert>}
                    {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                    <Box component="form" onSubmit={handleSubmit}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading || !!message}
                            variant="outlined"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#FFC644',
                                    },
                                },
                            }}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{
                                mt: 3,
                                mb: 2,
                                bgcolor: '#FFC644',
                                color: '#000',
                                py: 1.5,
                                fontWeight: 700,
                                borderRadius: 8,
                                '&:hover': {
                                    bgcolor: '#e6b23d',
                                },
                                textTransform: 'none',
                                fontSize: '1rem'
                            }}
                            disabled={isLoading || !!message}
                        >
                            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Send Reset Link'}
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
}
