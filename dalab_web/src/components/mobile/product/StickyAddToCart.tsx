'use client';

import React from 'react';
import { Box, Button, Typography, IconButton } from '@mui/material';
import {
    ShoppingCartOutlined as CartIcon,
    FavoriteBorder as HeartIcon,
    Share as ShareIcon
} from '@mui/icons-material';
import { spacing, borderRadius, elevation, dimensions } from '@/theme/mobile';

interface StickyAddToCartProps {
    price: number;
    originalPrice?: number;
    onAddToCart: () => void;
    onWishlist?: () => void;
    disabled?: boolean;
}

export const StickyAddToCart: React.FC<StickyAddToCartProps> = ({
    price,
    originalPrice,
    onAddToCart,
    onWishlist,
    disabled = false
}) => {
    return (
        <Box
            sx={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
                backgroundColor: 'background.paper',
                borderTop: '1px solid',
                borderColor: 'divider',
                padding: `${spacing.md}px ${spacing.lg}px`,
                display: 'flex',
                alignItems: 'center',
                gap: spacing.lg,
                boxShadow: '0 -4px 12px rgba(0,0,0,0.05)',
                height: 80,
            }}
        >
            {/* Price Display */}
            <Box sx={{ flexShrink: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography variant="h2" color="text.primary">
                        ${price.toFixed(2)}
                    </Typography>
                </Box>
                {originalPrice && (
                    <Typography variant="caption" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
                        ${originalPrice.toFixed(2)}
                    </Typography>
                )}
            </Box>

            {/* Main Action */}
            <Button
                fullWidth
                variant="contained"
                disabled={disabled}
                onClick={onAddToCart}
                startIcon={<CartIcon />}
                sx={{
                    height: 52,
                    borderRadius: borderRadius.lg,
                    fontSize: 16,
                    fontWeight: 700,
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    boxShadow: elevation.medium,
                    '&:hover': { backgroundColor: 'primary.dark' }
                }}
            >
                Add to Cart
            </Button>

            {/* Wishlist Icon Button */}
            <IconButton
                onClick={onWishlist}
                sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: borderRadius.md,
                    width: 52,
                    height: 52
                }}
            >
                <HeartIcon />
            </IconButton>
        </Box>
    );
};
