'use client';

import { Box } from '@mui/material';

export function CurvedDivider() {
  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '40px',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '50px',
          backgroundColor: '#ffffff',
          borderRadius: '40px 40px 0 0',
        }}
      />
    </Box>
  );
}
