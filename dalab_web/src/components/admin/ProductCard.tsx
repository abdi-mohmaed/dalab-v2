'use client';

import React from 'react';
import {
    Box,
    Card,
    CardContent,
    CardMedia,
    Typography,
    Chip,
    IconButton,
    Stack,
    Tooltip,
    alpha,
    Button,
    Grid,
    useTheme
} from '@mui/material';
import {
    Edit,
    ContentCopy,
    Delete,
    CheckCircle,
    InfoOutlined,
    LocalOffer,
    Category as CategoryIcon,
    Inventory,
    ImageSearch,
    Psychology,
    Bolt
} from '@mui/icons-material';
import { Product } from '@/types/product';

interface ProductCardProps {
    product: Product;
    onEdit: (product: Product) => void;
    onDuplicate: (product: Product) => void;
    onDelete: (id: string) => void;
    onAiLens: (product: Product, provider: 'google' | 'lumin') => void;
    categories: any[];
    quickFillMode?: boolean;
}

export function ProductCard({ 
    product, 
    onEdit, 
    onDuplicate, 
    onDelete, 
    onAiLens,
    categories, 
    quickFillMode 
}: ProductCardProps) {
    const theme = useTheme();
    const category = categories.find(c => c.id === product.categoryId);
    const isActive = product.status === 'ACTIVE';

    // Get primary SKU from variants if available
    const primarySku = product.variants && product.variants.length > 0 
        ? product.variants[0].sku 
        : 'N/A';

    const variantCount = product.variants?.length || 0;

    return (
        <Card 
            sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 28px rgba(0,0,0,0.1)',
                },
                position: 'relative',
                overflow: 'visible'
            }}
        >
            {/* Status Indicator */}
            <Box 
                sx={{ 
                    position: 'absolute', 
                    top: 12, 
                    right: 12, 
                    zIndex: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    bgcolor: 'rgba(255,255,255,0.9)',
                    backdropFilter: 'blur(4px)',
                    px: 1,
                    py: 0.5,
                    borderRadius: 2,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
            >
                <Box 
                    sx={{ 
                        width: 8, 
                        height: 8, 
                        borderRadius: '50%', 
                        bgcolor: isActive ? 'success.main' : 'error.main' 
                    }} 
                />
                <Typography variant="caption" fontWeight={700} sx={{ color: isActive ? 'success.main' : 'error.main' }}>
                    {isActive ? 'Active' : 'Inactive'}
                </Typography>
            </Box>

            {/* Product Image */}
            <Box sx={{ pt: '100%', position: 'relative', borderRadius: '12px 12px 0 0', overflow: 'hidden', bgcolor: 'grey.50' }}>
                <CardMedia
                    component="img"
                    image={product.image || 'https://placehold.co/600x600?text=No+Image'}
                    alt={product.title}
                    sx={{ 
                        position: 'absolute', 
                        top: 0, 
                        left: 0, 
                        width: '100%', 
                        height: '100%',
                        objectFit: 'contain',
                        p: 1
                    }}
                />
                
                {/* Quick Fill AI Buttons Overlay */}
                {quickFillMode && (
                    <Box 
                        sx={{ 
                            position: 'absolute', 
                            top: 0, 
                            left: 0, 
                            width: '100%', 
                            height: '100%', 
                            bgcolor: alpha(theme.palette.primary.main, 0.4),
                            backdropFilter: 'blur(4px)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 1.5,
                            zIndex: 3,
                            p: 2
                        }}
                    >
                        <Button
                            variant="contained"
                            size="small"
                            startIcon={<ImageSearch />}
                            onClick={() => onAiLens(product, 'google')}
                            sx={{ 
                                borderRadius: 2, 
                                bgcolor: 'white', 
                                color: 'primary.main',
                                '&:hover': { bgcolor: 'grey.100' },
                                fontWeight: 800,
                                fontSize: '0.7rem'
                            }}
                        >
                            Google Lens
                        </Button>
                        <Button
                            variant="contained"
                            size="small"
                            color="secondary"
                            startIcon={<Psychology />}
                            onClick={() => onAiLens(product, 'lumin')}
                            sx={{ 
                                borderRadius: 2,
                                fontWeight: 800,
                                fontSize: '0.7rem'
                            }}
                        >
                            Lumin Lens
                        </Button>
                        <Typography variant="caption" sx={{ color: 'white', fontWeight: 800, textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
                            QUICK AI FILL
                        </Typography>
                    </Box>
                )}

                {/* Tag Overlay - Top Left */}
                <Stack 
                    direction="column" 
                    spacing={0.5} 
                    sx={{ position: 'absolute', top: 12, left: 12, zIndex: 1 }}
                >
                    {product.productTags?.filter(pt => pt.enabled).map((pt: any) => (
                        <Chip
                            key={pt.id}
                            label={pt.tag?.displayName}
                            size="small"
                            sx={{ 
                                bgcolor: pt.tag?.color || 'primary.main',
                                color: '#fff',
                                fontWeight: 800,
                                fontSize: '0.65rem',
                                height: 20,
                                textTransform: 'uppercase',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}
                        />
                    ))}
                </Stack>
            </Box>

            <CardContent sx={{ flexGrow: 1, p: 2 }}>
                <Stack spacing={1}>
                    {/* Category Label */}
                    <Stack direction="row" spacing={0.5} alignItems="center">
                        <CategoryIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                        <Typography variant="caption" fontWeight={600} color="text.secondary">
                            {category?.name || 'Uncategorized'}
                        </Typography>
                    </Stack>

                    {/* Title */}
                    <Typography 
                        variant="subtitle1" 
                        fontWeight={800} 
                        sx={{ 
                            lineHeight: 1.3,
                            height: '2.6em',
                            overflow: 'hidden',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxDirection: 'vertical'
                        }}
                    >
                        {product.title}
                    </Typography>

                    {/* Price Row */}
                    <Stack direction="row" spacing={1} alignItems="baseline">
                        <Typography variant="h6" fontWeight={900} color="primary.main">
                            ${product.price?.toLocaleString()}
                        </Typography>
                        {product.originalPrice && product.originalPrice > (product.price || 0) && (
                            <Typography 
                                variant="caption" 
                                sx={{ textDecoration: 'line-through', color: 'text.disabled' }}
                            >
                                ${product.originalPrice.toLocaleString()}
                            </Typography>
                        )}
                    </Stack>

                    {/* Meta Info */}
                    <Box sx={{ 
                        p: 1.5, 
                        bgcolor: 'grey.50', 
                        borderRadius: 2, 
                        border: '1px solid', 
                        borderColor: 'grey.100' 
                    }}>
                        <Grid container spacing={1}>
                            <Grid item xs={6}>
                                <Typography variant="caption" color="text.secondary" display="block">SKU</Typography>
                                <Typography variant="caption" fontWeight={700} sx={{ fontFamily: 'monospace' }}>{primarySku}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="caption" color="text.secondary" display="block">Variants</Typography>
                                <Stack direction="row" spacing={0.5} alignItems="center">
                                    <Inventory sx={{ fontSize: 12, color: 'text.secondary' }} />
                                    <Typography variant="caption" fontWeight={700}>{variantCount} types</Typography>
                                </Stack>
                            </Grid>
                        </Grid>
                    </Box>
                </Stack>
            </CardContent>

            {/* Footer Actions */}
            <Box sx={{ 
                p: 1.5, 
                borderTop: '1px solid', 
                borderColor: 'grey.100', 
                display: 'flex', 
                justifyContent: 'flex-end',
                bgcolor: alpha(theme.palette.primary.main, 0.02)
            }}>
                <Stack direction="row" spacing={1}>
                    <Tooltip title="Edit Product">
                        <IconButton size="small" onClick={() => onEdit(product)} sx={{ color: 'primary.main' }}>
                            <Edit fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Duplicate">
                        <IconButton size="small" onClick={() => onDuplicate(product)} sx={{ color: 'info.main' }}>
                            <ContentCopy fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                        <IconButton size="small" onClick={() => onDelete(product.id)} sx={{ color: 'error.main' }}>
                            <Delete fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Stack>
            </Box>
        </Card>
    );
}

