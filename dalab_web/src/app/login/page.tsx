'use client';

import React, { useState } from 'react';
import { Typography, TextField, Button, Box, Alert } from '@mui/material';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { CurvedAuthLayout } from '@/components/auth/CurvedAuthLayout';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, user } = useAuth();
  const router = useRouter();

  if (user) {
    router.push('/account');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await login({ email, password });
      // Redirect handled in AuthContext, but we can ensure double safety or just let it redirect.
      // Loading state remains true until redirect happens or unmount, which is fine.
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
      setLoading(false);
    }
  };

  return (
    <CurvedAuthLayout>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 4, color: '#1a237e' }}>
        LOG IN
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 3 }}
          required
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mb: 4 }}
          required
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={loading}
          sx={{
            py: 1.5,
            bgcolor: '#9c27b0', // Purple
            color: '#fff',
            fontSize: '1rem',
            fontWeight: 600,
            borderRadius: 2,
            textTransform: 'none',
            mb: 2,
            opacity: loading ? 0.7 : 1,
            '&:hover': { bgcolor: '#7b1fa2' }
          }}
        >
          {loading ? 'Logging in...' : 'CONTINUE'}
        </Button>

        <Button
          variant="text"
          onClick={() => router.back()}
          sx={{
            color: '#9c27b0',
            textTransform: 'none',
            fontWeight: 600,
            justifyContent: 'flex-start',
            px: 0
          }}
        >
          GO BACK
        </Button>
      </form>
    </CurvedAuthLayout>
  );
}
