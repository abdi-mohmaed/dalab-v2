'use client';

import { Box } from '@mui/material';
import { DalabLogo } from '@/components/splash/DalabLogo';

export default function SplashPage() {
  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        backgroundColor: '#FFC644', // Dalab Yellow
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'fixed',
        top: 0,
        left: 0,
        overflow: 'hidden',
        animation: 'pulse 2s infinite',
        '@keyframes pulse': {
          '0%': { opacity: 1 },
          '50%': { opacity: 0.8 },
          '100%': { opacity: 1 },
        },
      }}
    >
      <DalabLogo size="large" />
    </Box>
  );
}
