'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import { Product } from '@/types/product';
import ProductCard from '../ProductCard';

interface ProductRowProps {
    title: string;
    products: Product[];
}

export function ProductRow({ title, products }: ProductRowProps) {
    if (products.length === 0) return null;

    return (
        <Box sx={{ mb: 4 }}>
            <Typography
                variant="h6"
                sx={{
                    px: 2,
                    mb: 1.5,
                    fontWeight: 700,
                    color: 'text.primary',
                    fontSize: { xs: '1.4rem', md: '1.6rem' }
                }}
            >
                {title}
            </Typography>
            <Box
                sx={{
                    display: 'flex',
                    overflowX: 'auto',
                    gap: 2,
                    px: 2,
                    pb: 2,
                    scrollSnapType: 'x mandatory',
                    '&::-webkit-scrollbar': { display: 'none' }, // hide scrollbar
                }}
            >
                {products.map((product) => (
                    <Box
                        key={product.id}
                        sx={{
                            minWidth: 180,
                            width: 180,
                            flexShrink: 0,
                            scrollSnapAlign: 'start',
                        }}
                    >
                        <ProductCard product={product} />
                    </Box>
                ))}
            </Box>
        </Box>
    );
}
