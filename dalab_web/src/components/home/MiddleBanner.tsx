'use client';

import { Box, Typography } from '@mui/material';
import Image from 'next/image';

interface MiddleBannerProps {
    src?: string;
    title?: string;
    subtitle?: string;
    bgcolor?: string;
}

export function MiddleBanner({
    src = "/middle_banner.png",
    title = "Extra 20% off...",
    subtitle = "USE ZAAD AND GET",
    bgcolor = "#008577"
}: MiddleBannerProps) {
    return (
        <Box
            sx={{
                width: '100%',
                // Use aspect ratio for strips to ensure full graphic is visible
                aspectRatio: '320/120', // Default mobile-friendly aspect ratio
                maxHeight: 120,
                background: 'transparent', // Removed background color
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center', // Center content
                color: 'white',
                flexShrink: 0,
                // boxShadow: '0 4px 12px rgba(0,0,0,0.08)', // Removed shadow for cleaner look
                position: 'relative',
                overflow: 'hidden',
                border: 'none',
                my: 1
            }}
        >

            <Box sx={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                zIndex: 0
            }}>
                <Image
                    src={src}
                    alt={title}
                    fill
                    style={{
                        objectFit: 'contain', // Always contain to prevent cutting
                    }}
                    quality={90}
                />
            </Box>
        </Box>
    );
}
