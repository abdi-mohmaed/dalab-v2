import Link from 'next/link';
import { Box, Typography, Rating, Chip } from '@mui/material';
import Image from 'next/image';

interface AmazonProductCardProps {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    rating: number;
    image: string;
}

export function AmazonProductCard({ id, name, price, originalPrice, rating, image }: AmazonProductCardProps) {
    const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

    return (
        <Link href={`/product/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <Box
                sx={{
                    width: '100%',
                    bgcolor: '#fff',
                    p: 1.5,
                    borderRadius: 1,
                    '&:hover': {
                        '& .product-title': { color: '#C7511F' }
                    }
                }}
            >
                <Box sx={{ position: 'relative', width: '100%', height: 200, mb: 1, display: 'flex', justifyContent: 'center' }}>
                    <Image
                        src={image}
                        alt={name}
                        fill
                        style={{ objectFit: 'contain' }}
                    />
                </Box>

                <Typography
                    className="product-title"
                    variant="body1"
                    sx={{
                        fontSize: '0.9rem',
                        lineHeight: 1.2,
                        height: '2.4rem',
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        mb: 0.5,
                        color: '#0F1111'
                    }}
                >
                    {name}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                    <Rating value={rating} precision={0.5} size="small" readOnly />
                    <Typography variant="caption" sx={{ color: '#007185' }}>
                        1,234
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                    <Typography variant="h5" sx={{ fontWeight: 500, color: '#0F1111', fontSize: '1.2rem' }}>
                        ${price.toLocaleString()}
                    </Typography>
                    {originalPrice && (
                        <Typography variant="caption" sx={{ textDecoration: 'line-through', color: '#565959' }}>
                            ${originalPrice.toLocaleString()}
                        </Typography>
                    )}
                </Box>

                {discount > 0 && (
                    <Typography variant="caption" sx={{ color: '#CC0C39', fontWeight: 600 }}>
                        ({discount}% off)
                    </Typography>
                )}

                <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Image src="/prime-logo.png" alt="Prime" width={40} height={12} style={{ objectFit: 'contain' }} />
                    <Typography variant="caption" sx={{ fontWeight: 600, color: '#0F1111' }}>
                        FREE Delivery
                    </Typography>
                </Box>

                <Typography variant="caption" sx={{ color: '#565959' }}>
                    Get it as soon as tomorrow
                </Typography>
            </Box>
        </Link>
    );
}
