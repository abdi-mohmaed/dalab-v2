'use client';

import { Box } from '@mui/material';
import { usePathname } from 'next/navigation';

import { BottomNav } from '@/components/BottomNav';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');
  const isProductPage = pathname.startsWith('/product/');

  const hideNavbarFooter = isAdmin;
  const showBottomNav = !isAdmin && !isProductPage; // Hide on product page to prevent overlap with sticky cart button

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        /* Handle iOS/Android safe area at bottom */
        pb: isProductPage
          ? 'calc(90px + env(safe-area-inset-bottom))'
          : (showBottomNav ? 'calc(75px + env(safe-area-inset-bottom))' : 'env(safe-area-inset-bottom)'),
        bgcolor: 'background.default'
      }}
    >

      <Box component="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>
      {showBottomNav && <BottomNav />}
    </Box>
  );
}
