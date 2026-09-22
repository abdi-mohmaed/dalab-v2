'use client';

import { Box, Button, TextField, Typography, Stack, MenuItem, Select, FormControl, Alert, CircularProgress } from '@mui/material';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CurvedAuthLayout } from '@/components/auth/CurvedAuthLayout';
import { useAuth } from '@/context/AuthContext';

export default function SignUpPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    gender: '',
    birthMonth: '',
    birthYear: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const years = Array.from({ length: 100 }, (_, i) => 2025 - i);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setError('');
    setIsLoading(true);

    try {
      // 1. Basic Validation
      if (!formData.name || !formData.email || !formData.password) {
        throw new Error('Please fill in all required fields');
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 2. Register API Call (Mocked via simple login for now or real endpoint)
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // 3. Redirect
      window.location.href = '/';
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CurvedAuthLayout>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 4, color: '#000', textAlign: 'center' }}>
        sign up
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Stack spacing={2}>
        <Box>
          <Typography variant="caption" fontWeight={600} sx={{ mb: 0.5, display: 'block' }}>FULL NAME</Typography>
          <TextField
            fullWidth
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            variant="outlined"
            size="small"
            required
          />
        </Box>

        <Box>
          <Typography variant="caption" fontWeight={600} sx={{ mb: 0.5, display: 'block' }}>EMAIL</Typography>
          <TextField
            fullWidth
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            variant="outlined"
            size="small"
            required
          />
        </Box>

        <Box>
          <Typography variant="caption" fontWeight={600} sx={{ mb: 0.5, display: 'block' }}>PASSWORD</Typography>
          <TextField
            fullWidth
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a password"
            variant="outlined"
            size="small"
            required
          />
        </Box>

        <Box>
          <Typography variant="caption" fontWeight={600} sx={{ mb: 0.5, display: 'block' }}>PHONE NUMBER</Typography>
          <TextField
            fullWidth
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
            variant="outlined"
            size="small"
          />
        </Box>

        <Box>
          <Typography variant="caption" fontWeight={600} sx={{ mb: 0.5, display: 'block' }}>GENDER</Typography>
          <FormControl fullWidth size="small">
            <Select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              displayEmpty
            >
              <MenuItem value=""><em>Select Gender</em></MenuItem>
              <MenuItem value="male">MALE</MenuItem>
              <MenuItem value="female">FEMALE</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box>
          <Typography variant="caption" fontWeight={600} sx={{ mb: 0.5, display: 'block' }}>AGE</Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl sx={{ flex: 1 }} size="small">
              <Select
                name="birthMonth"
                value={formData.birthMonth}
                onChange={handleChange}
                displayEmpty
              >
                <MenuItem value=""><em>Month</em></MenuItem>
                {months.map((m) => (
                  <MenuItem key={m} value={m}>{m}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ flex: 1 }} size="small">
              <Select
                name="birthYear"
                value={formData.birthYear}
                onChange={handleChange}
                displayEmpty
              >
                <MenuItem value=""><em>Year</em></MenuItem>
                {years.map((y) => (
                  <MenuItem key={y} value={y.toString()}>{y}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>

        <Button
          variant="contained"
          fullWidth
          onClick={handleSubmit}
          disabled={isLoading}
          sx={{
            bgcolor: '#9c27b0',
            color: '#ffffff',
            py: 1.5,
            mt: 2,
            borderRadius: 2,
            fontWeight: 600,
            opacity: isLoading ? 0.7 : 1,
            '&:hover': { bgcolor: '#7b1fa2' },
          }}
        >
          {isLoading ? <CircularProgress size={24} color="inherit" /> : 'CONTINUE'}
        </Button>

        <Button
          variant="text"
          onClick={() => router.back()}
          sx={{
            color: '#9c27b0',
            textTransform: 'none',
            fontWeight: 600,
            alignSelf: 'flex-start',
            px: 0
          }}
        >
          GO BACK
        </Button>
      </Stack>
    </CurvedAuthLayout>
  );
}
