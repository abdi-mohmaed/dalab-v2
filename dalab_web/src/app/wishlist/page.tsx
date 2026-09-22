'use client';

import React from 'react';
import {
    Container,
    Typography,
    Grid,
    Box,
    Button,
    Breadcrumbs,
    Link as MuiLink,
    Paper,
    CircularProgress
} from '@mui/material';
import Link from 'next/link';
import { useWishlist } from '@/context/WishlistContext';
import ProductCard from '@/components/ProductCard';
import { FavoriteBorder, ArrowBack } from '@mui/icons-material';

export default function WishlistPage() {
    const { wishlist, isLoading } = useWishlist();

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4, pb: 10 }}>
            {/* Breadcrumbs */}
            <Breadcrumbs sx={{ mb: 3 }}>
                <Link href="/" passHref style={{ textDecoration: 'none' }}>
                    <MuiLink underline="hover" color="inherit" sx={{ fontSize: '0.8rem' }}>
                        Home
                    </MuiLink>
                </Link>
                <Typography color="text.primary" sx={{ fontSize: '0.8rem' }}>Wishlist</Typography>
            </Breadcrumbs>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" fontWeight={800}>My Wishlist</Typography>
                <Typography variant="body2" color="text.secondary">
                    {wishlist.length} {wishlist.length === 1 ? 'Item' : 'Items'}
                </Typography>
            </Box>

            {wishlist.length === 0 ? (
                <Paper
                    sx={{
                        p: 8,
                        textAlign: 'center',
                        borderRadius: 4,
                        bgcolor: 'rgba(0,0,0,0.02)',
                        border: '1px dashed #e0e0e0'
                    }}
                >
                    <FavoriteBorder sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h6" fontWeight={700} gutterBottom>
                        Your wishlist is empty
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                        Save items you like to see them here later.
                    </Typography>
                    <Link href="/" passHref style={{ textDecoration: 'none' }}>
                        <Button
                            variant="contained"
                            startIcon={<ArrowBack />}
                            sx={{ borderRadius: 2, px: 4, py: 1.5 }}
                        >
                            Start Shopping
                        </Button>
                    </Link>
                </Paper>
            ) : (
                <Grid container spacing={3}>
                    {wishlist.map((item) => (
                        <Grid item xs={6} sm={4} md={3} key={item.id}>
                            <ProductCard
                                product={{
                                    ...item.product,
                                    price: item.product.variants?.[0]?.price || 0,
                                    image: item.product.images?.[0]?.url || item.product.image
                                }}
                            />
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
}
