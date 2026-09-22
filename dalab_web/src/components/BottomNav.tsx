'use client';

import React from 'react';
import { Box, Paper, BottomNavigation, BottomNavigationAction } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import CategoryIcon from '@mui/icons-material/Category'; // Or GridView
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import { usePathname, useRouter } from 'next/navigation';

export function BottomNav() {
    const router = useRouter();
    const pathname = usePathname();

    // Determine active value based on pathname
    let value = 0;
    if (pathname === '/') value = 0;
    else if (pathname.startsWith('/category')) value = 1;
    else if (pathname.startsWith('/cart')) value = 2;
    else if (pathname.startsWith('/account')) value = 3;

    if (pathname.startsWith('/admin')) return null;

    return (
        <Box sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1100,
            bgcolor: 'background.paper',
            pb: 'env(safe-area-inset-bottom)'
        }}>
            <Paper elevation={3} square>
                <BottomNavigation
                    showLabels
                    value={value}
                    onChange={(event, newValue) => {
                        if (newValue === 0) router.push('/');
                        if (newValue === 1) router.push('/category');
                        if (newValue === 2) router.push('/cart'); // Will implement later
                        if (newValue === 3) router.push('/account'); // Will implement later
                    }}
                    sx={{
                        height: 65,
                        '& .MuiBottomNavigationAction-root': {
                            color: '#9e9e9e', // Inactive color
                            minWidth: 'auto',
                            padding: '6px 0 8px',
                        },
                        '& .Mui-selected': {
                            color: '#FFC644', // Dalab Yellow
                        },
                        '& .MuiBottomNavigationAction-label': {
                            fontSize: '0.75rem',
                            marginTop: '4px',
                            fontWeight: 500
                        },
                        '& .Mui-selected .MuiBottomNavigationAction-label': {
                            fontSize: '0.75rem',
                        }
                    }}
                >
                    <BottomNavigationAction label="Home" icon={<HomeIcon />} />
                    <BottomNavigationAction label="Category" icon={<CategoryIcon />} />
                    <BottomNavigationAction label="Cart" icon={<ShoppingCartIcon />} />
                    <BottomNavigationAction label="Account" icon={<PersonIcon />} />
                </BottomNavigation>
            </Paper>
        </Box>
    );
}
