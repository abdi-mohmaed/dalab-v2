'use client';

import { Box, Typography, Container, Grid } from '@mui/material';
import { SearchBar } from '@/components/home/SearchBar';
import { useProducts } from '@/hooks/useProducts';
import { SheinProductCard } from '@/components/external/SheinProductCard';
import Image from 'next/image';

export default function SheinPage() {
    const { products, isLoading } = useProducts({
        source: 'SHEIN',
        pageSize: 12
    });

    return (
        <Box sx={{ bgcolor: '#fff', minHeight: '100vh' }}>
            {/* SHEIN Header */}
            <Box sx={{ borderBottom: '1px solid #eee', py: 2 }}>
                <Container maxWidth="lg">
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                        <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: 2, color: '#000' }}>
                            SHEIN
                        </Typography>
                        <Box sx={{ width: '100%', maxWidth: 600 }}>
                            <SearchBar source="SHEIN" placeholder="Search SHEIN Fashion" />
                        </Box>
                    </Box>
                </Container>
            </Box>

            {/* SHEIN Banner */}
            <Box sx={{ width: '100%', height: { xs: 200, md: 400 }, position: 'relative' }}>
                <Image
                    src="/shein-hub-banner.png"
                    alt="SHEIN Trends"
                    fill
                    style={{ objectFit: 'cover' }}
                />
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '5%',
                        transform: 'translateY(-50%)',
                        bgcolor: 'rgba(255,255,255,0.9)',
                        p: 3,
                        maxWidth: 300
                    }}
                >
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#000', mb: 1 }}>
                        NEW IN: TRENDS
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#333' }}>
                        Discover the latest fashion arrivals.
                    </Typography>
                </Box>
            </Box>

            <Container maxWidth="lg" sx={{ mt: 4, pb: 6 }}>
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                        Flash Sale
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: '#fa6338' }}>
                        Ends in 02:45:12
                    </Typography>
                </Box>

                <Grid container spacing={1.5}>
                    {isLoading && products.length === 0 ? (
                        Array.from({ length: 8 }).map((_, i) => (
                            <Grid item xs={6} sm={4} md={3} lg={2.4} key={i}>
                                <Box sx={{ width: '100%', height: 350, bgcolor: '#f5f5f5', borderRadius: 0 }} />
                            </Grid>
                        ))
                    ) : (
                        products.map((product) => (
                            <Grid item xs={6} sm={4} md={3} lg={2.4} key={product.id}>
                                <SheinProductCard
                                    id={product.id}
                                    name={product.title}
                                    price={product.price ?? 0}
                                    originalPrice={product.originalPrice ?? 0}
                                    image={product.image || ''}
                                />
                            </Grid>
                        ))
                    )}
                </Grid>

                {!isLoading && products.length === 0 && (
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                        <Typography variant="h6" color="text.secondary">
                            No SHEIN products found. Try importing some with 'SHEIN' source!
                        </Typography>
                    </Box>
                )}
            </Container>
        </Box>
    );
}
