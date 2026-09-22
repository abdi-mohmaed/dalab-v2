'use client';

import { Box, Skeleton, Grid, Container } from '@mui/material';

export function HomeSkeleton() {
    return (
        <Box sx={{ bgcolor: 'white', minHeight: '100vh' }}>
            {/* Search Bar Skeleton */}
            <Box sx={{ p: 2, pt: 'calc(16px + env(safe-area-inset-top))', bgcolor: '#FFC644' }}>
                <Skeleton variant="rounded" height={45} sx={{ borderRadius: 2, bgcolor: 'rgba(0,0,0,0.05)' }} />
            </Box>

            <Box sx={{
                bgcolor: 'white',
                borderTopLeftRadius: 32,
                borderTopRightRadius: 32,
                mt: -2,
                p: 3,
                position: 'relative',
                zIndex: 1
            }}>
                {/* Banner Skeleton */}
                <Skeleton
                    variant="rectangular"
                    height={180}
                    sx={{ borderRadius: '16px', mb: 4, width: '100%' }}
                />

                {/* Categories Skeleton */}
                <Box sx={{ display: 'flex', gap: 2, mb: 4, overflow: 'hidden' }}>
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Box key={i} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, minWidth: 170 }}>
                            <Skeleton variant="rounded" width={160} height={160} sx={{ borderRadius: '32px' }} />
                            <Skeleton variant="text" width={80} />
                        </Box>
                    ))}
                </Box>

                {/* Products Grid Skeleton */}
                <Grid container spacing={2}>
                    {[1, 2, 3, 4].map((i) => (
                        <Grid item xs={6} key={i}>
                            <Skeleton variant="rectangular" height={150} sx={{ borderRadius: 2, mb: 1 }} />
                            <Skeleton variant="text" width="80%" />
                            <Skeleton variant="text" width="40%" />
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Box>
    );
}
