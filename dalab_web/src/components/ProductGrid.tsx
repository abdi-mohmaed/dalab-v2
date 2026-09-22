'use client';

import React, { useEffect } from 'react';
import { Grid, Box, CircularProgress, Typography } from '@mui/material';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/types/product';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';

interface ProductGridProps {
    products: Product[];
    isLoading: boolean;
    hasMore: boolean;
    onLoadMore: () => void;
    emptyMessage?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
    products,
    isLoading,
    hasMore,
    onLoadMore,
    emptyMessage = "No products found."
}) => {
    const { targetRef, isIntersecting } = useInfiniteScroll();

    // Trigger load more when intersecting
    useEffect(() => {
        if (isIntersecting && hasMore && !isLoading) {
            onLoadMore();
        }
    }, [isIntersecting, hasMore, isLoading, onLoadMore]);

    if (products.length === 0 && !isLoading) {
        if (!emptyMessage) return null;
        return (
            <Box sx={{ py: 8, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                    {emptyMessage}
                </Typography>
            </Box>
        );
    }

    return (
        <Box>
            <Grid container spacing={2}>
                {products.map((product) => (
                    <Grid item xs={6} sm={6} md={4} lg={3} key={product.id}>
                        <ProductCard product={product} />
                    </Grid>
                ))}
            </Grid>

            {/* Loading Indicator / Intersection Target */}
            <Box
                ref={targetRef}
                sx={{
                    py: 4,
                    display: 'flex',
                    justifyContent: 'center',
                    minHeight: 50,
                    opacity: hasMore ? 1 : 0
                }}
            >
                {isLoading && <CircularProgress size={32} sx={{ color: '#FFC644' }} />}
            </Box>
        </Box>
    );
};
