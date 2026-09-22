import Link from 'next/link';
import { Box, Typography, IconButton } from '@mui/material';
import Image from 'next/image';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

interface SheinProductCardProps {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
}

export function SheinProductCard({ id, name, price, originalPrice, image }: SheinProductCardProps) {
    const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

    return (
        <Link href={`/product/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <Box
                sx={{
                    width: '100%',
                    bgcolor: '#fff',
                    position: 'relative',
                    '&:hover .add-to-cart': { opacity: 1 }
                }}
            >
                <Box sx={{ position: 'relative', width: '100%', height: 280, mb: 1 }}>
                    <Image
                        src={image}
                        alt={name}
                        fill
                        style={{ objectFit: 'cover' }}
                    />
                    {discount > 0 && (
                        <Box
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                bgcolor: '#000',
                                color: '#fff',
                                px: 1,
                                py: 0.5,
                                fontSize: '0.75rem',
                                fontWeight: 700
                            }}
                        >
                            -{discount}%
                        </Box>
                    )}

                    <IconButton
                        className="add-to-cart"
                        sx={{
                            position: 'absolute',
                            bottom: 8,
                            right: 8,
                            bgcolor: 'rgba(255,255,255,0.9)',
                            opacity: 1, // Always visible for mobile-first feel
                            transition: 'opacity 0.2s',
                            '&:hover': { bgcolor: '#fff' }
                        }}
                    >
                        <AddShoppingCartIcon fontSize="small" />
                    </IconButton>
                </Box>

                <Box sx={{ px: 0.5 }}>
                    <Typography
                        variant="body2"
                        sx={{
                            fontSize: '0.8rem',
                            color: '#222',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            mb: 0.25
                        }}
                    >
                        {name}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                        <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#000' }}>
                            ${price.toLocaleString()}
                        </Typography>
                        {originalPrice && (
                            <Typography sx={{ textDecoration: 'line-through', color: '#999', fontSize: '0.75rem' }}>
                                ${originalPrice.toLocaleString()}
                            </Typography>
                        )}
                    </Box>

                    <Typography variant="caption" sx={{ color: '#fa6338', fontWeight: 600, fontSize: '0.7rem' }}>
                        Flash Sale
                    </Typography>
                </Box>
            </Box>
        </Link>
    );
}
