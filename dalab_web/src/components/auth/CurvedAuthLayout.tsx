'use client';

import { Box, Container, IconButton } from '@mui/material';
import { DalabLogo } from '@/components/splash/DalabLogo';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

interface CurvedAuthLayoutProps {
    children: ReactNode;
    showBackButton?: boolean;
}

export function CurvedAuthLayout({ children, showBackButton = true }: CurvedAuthLayoutProps) {
    const router = useRouter();

    return (
        <Box sx={{ minHeight: '100vh', backgroundColor: '#FFFFFF', position: 'relative', overflow: 'hidden' }}>

            {/* Top Yellow Section */}
            <Box
                sx={{
                    height: '40vh',
                    backgroundColor: '#FFC644', // Dalab Yellow
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    paddingBottom: '50px', // Space for curve
                }}
            >
                {/* Back Button */}
                {showBackButton && (
                    <IconButton
                        onClick={() => router.back()}
                        sx={{
                            position: 'absolute',
                            top: 'calc(20px + env(safe-area-inset-top))',
                            left: 20,
                            color: '#1a237e'
                        }}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                )}

                {/* Brand Logo */}
                <DalabLogo size="large" />
            </Box>

            {/* Curved Divider & White Content Area */}
            <Box
                sx={{
                    backgroundColor: '#FFFFFF',
                    minHeight: '60vh',
                    borderTopLeftRadius: '40px',
                    borderTopRightRadius: '40px',
                    marginTop: '-40px', // Pull up to overlap yellow
                    paddingTop: '40px',
                    paddingX: 3,
                    position: 'relative',
                    zIndex: 10,
                    boxShadow: '0px -4px 10px rgba(0,0,0,0.05)'
                }}
            >
                <Container maxWidth="sm">
                    {children}
                </Container>
            </Box>
        </Box>
    );
}
