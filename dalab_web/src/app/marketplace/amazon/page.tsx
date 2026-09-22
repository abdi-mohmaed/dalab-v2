'use client';

import { Box, Typography, Container, Grid } from '@mui/material';
import { SearchBar } from '@/components/home/SearchBar';
import { useProducts } from '@/hooks/useProducts';
import { AmazonProductCard } from '@/components/external/AmazonProductCard';
import Image from 'next/image';

export default function AmazonPage() {
    const { products, isLoading, hasMore, loadMore } = useProducts({
        source: 'Amazon',
        pageSize: 12
    });

    return (
        <Box sx={{ bgcolor: '#EAEDED', minHeight: '100vh' }}>
            {/* Amazon Header */}
            <Box sx={{ bgcolor: '#232F3E', py: 1 }}>
                <Container maxWidth="lg">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ position: 'relative', width: 100, height: 40 }}>
                            <Image
                                src="/amazon.png"
                                alt="Amazon"
                                fill
                                style={{ objectFit: 'contain' }}
                            />
                        </Box>
                        <Box sx={{ flexGrow: 1 }}>
                            <SearchBar source="Amazon" placeholder="Search Amazon Products" />
                        </Box>
                    </Box>
                </Container>
            </Box>

            {/* Amazon Hero/Banner */}
            <Box sx={{ width: '100%', height: { xs: 150, md: 300 }, position: 'relative' }}>
                <Image
                    src="/amazon-hub-banner.png"
                    alt="Amazon Global Store"
                    fill
                    style={{ objectFit: 'cover' }}
                />
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '50%',
                        background: 'linear-gradient(to bottom, transparent, #EAEDED)'
                    }}
                />
            </Box>

            <Container maxWidth="lg" sx={{ mt: -5, position: 'relative', zIndex: 2, pb: 4 }}>
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: '#0F1111' }}>
                        International Deals & Hot Sales
                    </Typography>
                    <Grid container spacing={2}>
                        {isLoading && products.length === 0 ? (
                            Array.from({ length: 6 }).map((_, i) => (
                                <Grid item xs={6} sm={4} md={3} lg={2} key={i}>
                                    <Box sx={{ width: '100%', height: 250, bgcolor: '#fff', borderRadius: 1 }} />
                                </Grid>
                            ))
                        ) : (
                            products.map((product) => (
                                <Grid item xs={6} sm={4} md={3} lg={2} key={product.id}>
                                    <AmazonProductCard
                                        id={product.id}
                                        name={product.title}
                                        price={product.price ?? 0}
                                        originalPrice={product.originalPrice ?? 0}
                                        rating={4.5} // Default for now
                                        image={product.image || ''}
                                    />
                                </Grid>
                            ))
                        )}
                    </Grid>

                    {!isLoading && products.length === 0 && (
                        <Box sx={{ textAlign: 'center', py: 8 }}>
                            <Typography variant="h6" color="text.secondary">
                                No Amazon products found. Try importing some with 'Amazon' source!
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Container>
        </Box>
    );
}
