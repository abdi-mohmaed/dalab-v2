'use client';

import { Box, Skeleton } from '@mui/material';

export function ProductCardSkeleton() {
  return (
    <Box
      sx={{
        minWidth: 180,
        maxWidth: 180,
        bgcolor: '#ffffff',
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Skeleton variant="rectangular" width="100%" height={180} />
      <Box sx={{ p: 1.5 }}>
        <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="60%" height={16} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="40%" height={24} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="80%" height={14} />
      </Box>
    </Box>
  );
}
