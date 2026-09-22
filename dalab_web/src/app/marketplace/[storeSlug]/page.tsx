'use client';

import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { useRouter } from 'next/navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function StorePage({
    params,
    searchParams
}: {
    params: Promise<{ storeSlug: string }>,
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const router = useRouter();
    const { storeSlug } = React.use(params);
    const { category, sort } = (React.use(searchParams)) as { category?: string, sort?: string };

    // Capitalize store name for display
    const storeName = storeSlug.charAt(0).toUpperCase() + storeSlug.slice(1);

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '80vh',
                    textAlign: 'center',
                    gap: 3
                }}
            >
                <Box
                    sx={{
                        width: 120,
                        height: 120,
                        bgcolor: '#f5f5f5',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2,
                        fontSize: '4rem'
                    }}
                >
                    🛍️
                </Box>

                <Typography variant="h3" sx={{ fontWeight: 800, color: '#000' }}>
                    Not Available Now
                </Typography>

                <Typography variant="h6" color="text.secondary">
                    {storeName} marketplace is coming soon to Dalab.
                </Typography>

                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    We're working hard to bring you the best products from {storeName}.
                    Stay tuned for updates!
                </Typography>

                <Button
                    variant="contained"
                    size="large"
                    startIcon={<ArrowBackIcon />}
                    onClick={() => router.push('/')}
                    sx={{
                        bgcolor: '#FFC644',
                        color: '#000',
                        fontWeight: 'bold',
                        px: 4,
                        py: 1.5,
                        borderRadius: 2,
                        '&:hover': {
                            bgcolor: '#e6b23d'
                        }
                    }}
                >
                    Back to Dalab Home
                </Button>
            </Box>
        </Container>
    );
}
