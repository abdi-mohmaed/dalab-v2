'use client';

import { Box, Typography, Button } from '@mui/material';
import Image from 'next/image';

interface BigBannerProps {
    src?: string;
    title?: string;
    bgcolor?: string;
    showOverlay?: boolean;
}

export function BigBanner({ src = "/big-banner.png", title = "ONLINE SHOPPING", bgcolor = "#f5f5f5", showOverlay = true }: BigBannerProps) {
    return (
        <Box
            sx={{
                width: '100%',
                // Remove fixed aspect ratio effectively
                minHeight: 50,
                borderRadius: '20px',
                overflow: 'hidden',
                position: 'relative',
                bgcolor: 'transparent',
                // border: '1px solid transparent', // Trick to force browser rendering
                isolation: 'isolate',
                transform: 'translateZ(0)',
                display: 'flex', // Flex ensures height collapses to content
            }}
        >
            <Image
                src={src}
                alt={title}
                width={800} // Default generic width to maintain aspect ratio logic
                height={400} // Default generic height
                style={{
                    width: '100%',
                    height: 'auto', // Allow natural height
                    objectFit: 'contain',
                    borderRadius: '20px'
                }}
                priority
                quality={90}
            />

        </Box >
    );
}
