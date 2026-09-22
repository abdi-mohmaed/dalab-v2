'use client';

import { Box, Button, Stack } from '@mui/material';
import { DalabLogo } from '@/components/splash/DalabLogo';

export default function AuthPage() {
  return (
    <Box
      sx={{
        width: '100vw',
        minHeight: '100vh',
        backgroundColor: '#FFC644',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
        px: 2,
      }}
    >
      {/* Logo Section */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 4,
        }}
      >
        <DalabLogo size="large" />
      </Box>

      {/* Buttons Section */}
      <Stack
        spacing={2}
        sx={{
          width: '100%',
          maxWidth: 300,
          mb: 4,
        }}
      >
        <Button
          variant="contained"
          fullWidth
          href="/signup"
          sx={{
            bgcolor: '#9c27b0',
            color: '#ffffff',
            py: 1.5,
            borderRadius: 2,
            fontSize: '1rem',
            fontWeight: 600,
            textTransform: 'none',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            '&:hover': {
              bgcolor: '#7b1fa2',
              boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)',
            },
          }}
        >
          Register
        </Button>
        <Button
          variant="contained"
          fullWidth
          href="/login"
          sx={{
            bgcolor: '#9c27b0',
            color: '#ffffff',
            py: 1.5,
            borderRadius: 2,
            fontSize: '1rem',
            fontWeight: 600,
            textTransform: 'none',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            '&:hover': {
              bgcolor: '#7b1fa2',
              boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)',
            },
          }}
        >
          Log in
        </Button>
      </Stack>
    </Box>
  );
}
