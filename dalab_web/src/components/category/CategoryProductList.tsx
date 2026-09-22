'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Grid } from '@mui/material';
import ProductCard from '@/components/ProductCard';
import { useInView } from 'react-intersection-observer';

interface Product {
    id: string;
    title: string;
    price?: number;
    image: string;
    rating?: number;
    store?: { name: string };
    variants?: any[];
}

interface CategoryProductListProps {
    categoryId: string;
}

export function CategoryProductList({ categoryId }: CategoryProductListProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const { ref, inView } = useInView();

    const fetchProducts = async (pageNum: number) => {
        setIsLoading(true);
        try {
            // Fetch products for this category
            // We use the existing products API with a category filter
            const res = await fetch(`/api/products?categoryId=${categoryId}&page=${pageNum}&limit=8`);
            const data = await res.json();

            if (!data.data || data.data.length === 0) {
                setHasMore(false);
            } else {
                setProducts(prev => {
                    // prevent duplicates
                    const newProducts = data.data.filter((p: Product) => !prev.find(existing => existing.id === p.id));
                    return [...prev, ...newProducts];
                });
            }
        } catch (error) {
            console.error('Failed to fetch products', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Initial load
    useEffect(() => {
        fetchProducts(1);
    }, [categoryId]);

    // Infinite scroll load
    useEffect(() => {
        if (inView && hasMore && !isLoading && page > 1) { // Start infinite load after first batch
            fetchProducts(page);
        }
    }, [inView, hasMore, isLoading, page]);

    const loadMore = () => {
        setPage(prev => prev + 1);
    }

    // Effect to trigger next page load when scrolling down for vertical list
    useEffect(() => {
        if (inView && hasMore && !isLoading) {
            loadMore();
        }
    }, [inView]);


    // First batch (Horizontal)
    const horizontalProducts = products.slice(0, 8);
    // Subsequent batches (Vertical)
    const verticalProducts = products.slice(8);

    return (
        <Box sx={{ pb: 4 }}>
            {/* Phase 1: Horizontal Scroll (First 8) */}
            {horizontalProducts.length > 0 && (
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" fontWeight="bold" sx={{ px: 2, mb: 1 }}>
                        Top Picks
                    </Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            overflowX: 'auto',
                            gap: 2,
                            px: 2,
                            pb: 2,
                            '::-webkit-scrollbar': { display: 'none' }, // Hide scrollbar
                        }}
                    >
                        {horizontalProducts.map(product => (
                            <Box key={product.id}>
                                <ProductCard product={{ ...product, rating: product.rating ?? 0 } as any} />
                            </Box>
                        ))}
                    </Box>
                </Box>
            )}

            {/* Phase 2: Vertical List (Rest) */}
            <Box sx={{ px: 2 }}>
                <Grid container spacing={2}>
                    {verticalProducts.map(product => (
                        <Grid item xs={6} sm={4} md={3} key={product.id}>
                            <ProductCard product={{ ...product, rating: product.rating ?? 0 } as any} />
                        </Grid>
                    ))}
                </Grid>

                {/* Loading Trigger */}
                {hasMore && (
                    <Box ref={ref} sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                        <CircularProgress size={24} />
                    </Box>
                )}
            </Box>
        </Box>
    );
}
