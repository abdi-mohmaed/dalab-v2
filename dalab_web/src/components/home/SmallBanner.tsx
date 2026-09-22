'use client';

import { Box, Typography } from '@mui/material';
import Image from 'next/image';

interface SmallBannerProps {
    title?: string;
    src?: string;
    type?: string;
    bgcolor?: string;
}

export function SmallBanner({ title, src, type, bgcolor }: SmallBannerProps) {
    return (
        <Box
            sx={{
                width: '100%',
                height: 100,
                bgcolor: 'transparent', // Removed background
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                px: 2,
                color: 'white',
                overflow: 'hidden',
                position: 'relative'
            }}
        >


            {/* Background Media */}
            {src && (
                <Box sx={{ position: 'absolute', top: 0, right: 0, width: '100%', height: '100%' }}>
                    {type === 'video' ? (
                        <video
                            src={src}
                            autoPlay
                            loop
                            muted
                            playsInline
                            style={{ width: '100%', height: '100%', objectFit: 'contain', opacity: 1 }} // Changed to contain
                        />
                    ) : (
                        <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                            <Image
                                src={src}
                                alt={title || 'Banner'}
                                fill
                                style={{ objectFit: 'contain' }} // Changed to contain
                            />
                        </Box>
                    )}
                </Box>
            )}
        </Box>
    );
}
