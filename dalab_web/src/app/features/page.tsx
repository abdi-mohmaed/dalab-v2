'use client';

import { Box, Typography, Paper } from '@mui/material';
import { ResponsiveContainer } from '@/utils/container';

export default function FeaturesPage() {
  return (
    <ResponsiveContainer>
      <Box sx={{ py: { xs: 4, md: 8 } }}>
        <Typography variant="h1" component="h1" gutterBottom>
          Features
        </Typography>
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="body1" color="text.secondary">
            Features section coming soon...
          </Typography>
        </Paper>
      </Box>
    </ResponsiveContainer>
  );
}
