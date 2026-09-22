'use client';

import React from 'react';
import { AppBar, Toolbar, IconButton, Box, Badge } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share'; // Or IosShare
import { useRouter } from 'next/navigation';

export default function ProductHeader() {
    const router = useRouter();
    const [isScrolled, setIsScrolled] = React.useState(false);

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <AppBar
            position="fixed"
            color="transparent"
            elevation={isScrolled ? 1 : 0}
            sx={{
                top: 0,
                zIndex: 100,
                bgcolor: isScrolled ? 'rgba(255,255,255,0.98)' : 'transparent',
                backdropFilter: isScrolled ? 'blur(8px)' : 'none',
                transition: 'all 0.3s ease',
                borderBottom: isScrolled ? '1px solid #f0f0f0' : 'none',
                pt: 'env(safe-area-inset-top)'
            }}
        >
            <Toolbar sx={{ justifyContent: 'space-between', minHeight: 56 }}>
                <IconButton
                    edge="start"
                    onClick={() => router.back()}
                    sx={{
                        bgcolor: isScrolled ? 'transparent' : 'rgba(255,255,255,0.8)',
                        '&:hover': { bgcolor: isScrolled ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,1)' }
                    }}
                >
                    <ArrowBackIcon sx={{ color: '#000' }} />
                </IconButton>

                <Box>
                    <IconButton sx={{
                        bgcolor: isScrolled ? 'transparent' : 'rgba(255,255,255,0.8)',
                        mr: 0.5,
                        '&:hover': { bgcolor: isScrolled ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,1)' }
                    }}>
                        <SearchIcon sx={{ color: '#000' }} />
                    </IconButton>
                    <IconButton sx={{
                        bgcolor: isScrolled ? 'transparent' : 'rgba(255,255,255,0.8)',
                        mr: 0.5,
                        '&:hover': { bgcolor: isScrolled ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,1)' }
                    }}>
                        <FavoriteBorderIcon sx={{ color: '#000' }} />
                    </IconButton>
                    <IconButton edge="end" sx={{
                        bgcolor: isScrolled ? 'transparent' : 'rgba(255,255,255,0.8)',
                        '&:hover': { bgcolor: isScrolled ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,1)' }
                    }}>
                        <ShareIcon sx={{ color: '#000' }} />
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    );
}
