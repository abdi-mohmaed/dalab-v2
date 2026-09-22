'use client';

import Link from 'next/link';
import { Card, CardContent, CardMedia, Typography, Box, Stack, IconButton, Chip } from '@mui/material';
import { Product } from '@/types/product';
import { Favorite, FavoriteBorder, Star, Add, Timer } from '@mui/icons-material';
import { useWishlist } from '@/context/WishlistContext';
import { getProductRating } from '@/utils/ratingGenerator';
import { calculateCountdown, formatUrgencyMessage, CountdownTime } from '@/utils/countdownTimer';
import { useState, useEffect } from 'react';

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const {
        id, title, price, image, rating,
        productTags, showTags,
        manualRating, useAutoRating, showRating,
        urgencyConfig,
        showDiscount, discountPercentage, originalPrice
    } = product;
    const { toggleWishlist, isInWishlist } = useWishlist();
    const isWishlisted = isInWishlist(id);

    const [countdown, setCountdown] = useState<CountdownTime | null>(null);

    useEffect(() => {
        if (urgencyConfig?.enabled && urgencyConfig?.type === 'COUNTDOWN') {
            const updateTimer = () => {
                const time = calculateCountdown(
                    urgencyConfig.countdownHours || 0,
                    urgencyConfig.countdownMinutes || 0,
                    new Date(product.createdAt || Date.now()) // Use creation time as start
                );
                setCountdown(time);
            };

            updateTimer();
            const interval = setInterval(updateTimer, 1000);
            return () => clearInterval(interval);
        }
    }, [urgencyConfig]);

    // Effective rating logic
    const effectiveRating = getProductRating({ manualRating, useAutoRating, rating });

    return (
        <Link href={`/product/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <Card
                elevation={0}
                sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    bgcolor: '#ffffff',
                    borderRadius: '12px',
                    overflow: 'visible', // For floating elements
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                        zIndex: 1,
                    }
                }}
            >
                {/* Image Container */}
                <Box sx={{ position: 'relative', p: 1, bgcolor: '#ffffff', borderRadius: '12px 12px 0 0' }}>

                    {/* Dynamic Tags */}
                    {showTags && productTags && productTags.length > 0 && (
                        <Stack
                            direction="column"
                            spacing={0.5}
                            sx={{
                                position: 'absolute',
                                top: 8,
                                left: 8,
                                zIndex: 2,
                            }}
                        >
                            {productTags.filter((pt: any) => pt.enabled).map((pt: any) => (
                                <Chip
                                    key={pt.tag.id}
                                    label={pt.tag.displayName}
                                    size="small"
                                    sx={{
                                        bgcolor: pt.tag.color || '#257A02',
                                        color: '#fff',
                                        fontWeight: 700,
                                        fontSize: '0.65rem',
                                        height: 20,
                                        borderRadius: '4px',
                                        '& .MuiChip-label': { px: 1 }
                                    }}
                                    icon={pt.tag.icon ? <span style={{ fontSize: '10px' }}>{pt.tag.icon}</span> : undefined}
                                />
                            ))}
                        </Stack>
                    )}

                    {/* Wishlist Button (Top Right) */}
                    <IconButton
                        size="small"
                        sx={{
                            position: 'absolute',
                            top: 4,
                            right: 4,
                            zIndex: 2,
                            color: isWishlisted ? 'error.main' : 'text.secondary',
                            bgcolor: 'rgba(255,255,255,0.8)',
                            '&:hover': { bgcolor: 'rgba(255,255,255,1)' }
                        }}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleWishlist(id);
                        }}
                    >
                        {isWishlisted ? <Favorite fontSize="small" /> : <FavoriteBorder fontSize="small" />}
                    </IconButton>

                    <CardMedia
                        component="img"
                        height="180"
                        image={image}
                        alt={title}
                        sx={{
                            objectFit: 'contain',
                            borderRadius: 1,
                            mb: 1
                        }}
                    />

                    {/* Add Button (Floating Bottom Right) */}
                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: -16,
                            right: 8,
                            zIndex: 10,
                            bgcolor: '#ffffff',
                            borderRadius: '50%',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        }}
                    >
                        <IconButton
                            size="small"
                            sx={{
                                bgcolor: '#f0f0f0',
                                color: '#000',
                                p: 1,
                                '&:hover': { bgcolor: '#FFC644' }
                            }}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                // Add to cart logic here
                            }}
                        >
                            <Add fontSize="small" />
                        </IconButton>
                    </Box>
                </Box>

                <CardContent sx={{ px: 1.5, py: 1.5, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    {/* Title */}
                    <Typography
                        variant="body2"
                        component="h3"
                        sx={{
                            fontWeight: 500,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            lineHeight: 1.3,
                            minHeight: '2.6em',
                            mb: 0.5,
                            fontSize: '0.9rem',
                            color: '#0F172A'
                        }}
                    >
                        {title}
                    </Typography>

                    {/* Price Section */}
                    <Stack direction="row" alignItems="baseline" spacing={0.5} sx={{ mb: 0.5 }}>
                        <Typography variant="h6" fontWeight="bold" sx={{ fontSize: '1.1rem', color: '#000' }}>
                            ${(price || 0).toLocaleString()}
                        </Typography>
                        {showDiscount && discountPercentage && originalPrice && (
                            <>
                                <Typography variant="caption" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
                                    ${originalPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#38AE04', fontWeight: 'bold' }}>
                                    {discountPercentage}%
                                </Typography>
                            </>
                        )}
                    </Stack>

                    {/* Urgency Section */}
                    {urgencyConfig?.enabled && (
                        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 1, bgcolor: '#FFF5F5', p: 0.5, borderRadius: 1 }}>
                            <Timer sx={{ color: '#FD3C3C', fontSize: 14 }} />
                            <Typography variant="caption" sx={{ fontSize: '0.7rem', color: '#FD3C3C', fontWeight: 700 }}>
                                {urgencyConfig.type === 'COUNTDOWN' && countdown
                                    ? formatUrgencyMessage(urgencyConfig.messageTemplate, countdown)
                                    : (urgencyConfig.staticMessage || 'Limited time offer!')}
                            </Typography>
                        </Stack>
                    )}

                    {/* Rating & reviews */}
                    {showRating && (
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                            <Star sx={{ color: '#FFC644', fontSize: 14 }} />
                            <Typography variant="caption" fontWeight="bold" sx={{ color: '#000' }}>
                                {effectiveRating.toFixed(1)}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                ({Math.floor(Math.random() * 2000) + 100})
                            </Typography>
                        </Stack>
                    )}

                    {/* Delivery Promise - Removed hardcoded text */}
                </CardContent>
            </Card>
        </Link>
    );
};

export default ProductCard;
