'use client';

import Link from 'next/link';
import { Box, Typography, Link as MuiLink, Grid } from '@mui/material';
import { ResponsiveContainer } from '@/utils/container';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        borderTop: 1,
        borderColor: 'divider',
        py: 4,
        mt: 'auto',
      }}
    >
      <ResponsiveContainer>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: 'primary.main' }}>
              Dalab
            </Typography>
            <Typography variant="body2" color="text.secondary">
              A professional Next.js application built with Material UI and TypeScript.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <MuiLink component={Link} href="/" color="text.secondary" underline="hover">
                Home
              </MuiLink>
              <MuiLink component={Link} href="/features" color="text.secondary" underline="hover">
                Features
              </MuiLink>
              <MuiLink component={Link} href="/services" color="text.secondary" underline="hover">
                Services
              </MuiLink>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
              Resources
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <MuiLink component={Link} href="/admin" color="text.secondary" underline="hover">
                Admin
              </MuiLink>
              <MuiLink component={Link} href="/docs" color="text.secondary" underline="hover">
                Documentation
              </MuiLink>
            </Box>
          </Grid>
        </Grid>
        <Box
          sx={{
            mt: 4,
            pt: 3,
            borderTop: 1,
            borderColor: 'divider',
            textAlign: 'center',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {currentYear} Dalab. All rights reserved.
          </Typography>
        </Box>
      </ResponsiveContainer>
    </Box>
  );
}
