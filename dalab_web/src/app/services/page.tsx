'use client';

import { Box, Typography, Paper } from '@mui/material';
import { ResponsiveContainer } from '@/utils/container';

export default function ServicesPage() {
  return (
    <ResponsiveContainer>
      <Box sx={{ py: { xs: 4, md: 8 } }}>
        <Typography variant="h1" component="h1" gutterBottom>
          Services
        </Typography>
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="body1" color="text.secondary">
            Services section coming soon...
          </Typography>
        </Paper>
      </Box>
    </ResponsiveContainer>
  );
}
