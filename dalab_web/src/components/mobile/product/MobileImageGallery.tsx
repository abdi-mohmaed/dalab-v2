'use client';

import React, { useState } from 'react';
import { Box, Card, Typography } from '@mui/material';
import { spacing, borderRadius } from '@/theme/mobile';

interface MobileImageGalleryProps {
    images: string[];
}

export const MobileImageGallery: React.FC<MobileImageGalleryProps> = ({ images }) => {
    const [activeTab, setActiveTab] = useState(0);

    if (!images || images.length === 0) return null;

    return (
        <Box sx={{ position: 'relative', width: '100%', backgroundColor: 'background.paper' }}>
            {/* Main Image Viewport */}
            <Box
                sx={{
                    width: '100%',
                    pt: '100%',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: `${images.length * 100}%`,
                        height: '100%',
                        display: 'flex',
                        transform: `translateX(-${(activeTab * 100) / images.length}%)`,
                        transition: 'transform 0.3s ease-out',
                    }}
                >
                    {images.map((img, idx) => (
                        <Box
                            key={idx}
                            sx={{
                                width: `${100 / images.length}%`,
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                p: spacing.md
                            }}
                        >
                            <img
                                src={img}
                                alt={`Product view ${idx + 1}`}
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '100%',
                                    objectFit: 'contain'
                                }}
                            />
                        </Box>
                    ))}
                </Box>
            </Box>

            {/* Pagination Indicator */}
            {images.length > 1 && (
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: spacing.lg,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        display: 'flex',
                        gap: 1,
                        backgroundColor: 'rgba(0,0,0,0.2)',
                        px: 1,
                        py: 0.5,
                        borderRadius: borderRadius.full,
                        backdropFilter: 'blur(4px)'
                    }}
                >
                    {images.map((_, idx) => (
                        <Box
                            key={idx}
                            onClick={() => setActiveTab(idx)}
                            sx={{
                                width: 6,
                                height: 6,
                                borderRadius: '50%',
                                backgroundColor: activeTab === idx ? 'white' : 'rgba(255,255,255,0.5)',
                                transition: 'all 0.2s',
                                cursor: 'pointer'
                            }}
                        />
                    ))}
                </Box>
            )}

            {/* Thumbnail Indicator (Optional) */}
            <Box
                sx={{
                    display: 'flex',
                    gap: spacing.sm,
                    px: spacing.lg,
                    py: spacing.md,
                    overflowX: 'auto',
                    '&::-webkit-scrollbar': { display: 'none' }
                }}
            >
                {images.map((img, idx) => (
                    <Box
                        key={idx}
                        onClick={() => setActiveTab(idx)}
                        sx={{
                            width: 56,
                            height: 56,
                            borderRadius: borderRadius.md,
                            border: '2px solid',
                            borderColor: activeTab === idx ? 'primary.main' : 'transparent',
                            overflow: 'hidden',
                            flexShrink: 0,
                            backgroundColor: 'grey.100'
                        }}
                    >
                        <img
                            src={img}
                            alt={`Thumbnail ${idx + 1}`}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    </Box>
                ))}
            </Box>
        </Box>
    );
};
