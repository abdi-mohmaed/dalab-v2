'use client';

import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Container,
    Stack,
    Divider,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    CircularProgress,
    Alert
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import AssignmentReturnOutlinedIcon from '@mui/icons-material/AssignmentReturnOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { notFound } from 'next/navigation';
import Image from 'next/image';

import ProductHeader from '@/components/product/ProductHeader';
import { VariantSelector } from '@/components/product/VariantSelector';
import { ReviewForm } from '@/components/product/ReviewForm';
import { ReviewList } from '@/components/product/ReviewList';
import { TrustBadges } from '@/components/common/TrustBadges';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function ProductPage({ params }: PageProps) {
    const { id } = React.use(params);
    const { addToCart } = useCart();

    const [product, setProduct] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [qty, setQty] = useState(1);
    const [selectedVariant, setSelectedVariant] = useState<any>(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [reviews, setReviews] = useState<any[]>([]);
    const [isAdded, setIsAdded] = useState(false);
    const { user } = useAuth();

    const fetchReviews = async () => {
        try {
            const res = await fetch(`/api/products/${id}/reviews`);
            const data = await res.json();
            if (data.data) setReviews(data.data);
        } catch (err) {
            console.error('Failed to fetch reviews', err);
        }
    };

    useEffect(() => {
        async function fetchProduct() {
            try {
                const res = await fetch(`/api/products/${id}`);
                if (!res.ok) {
                    if (res.status === 404) return notFound();
                    throw new Error('Failed to fetch product');
                }
                const data = await res.json();
                setProduct(data);

                // Set default variant
                if (data.variants && data.variants.length > 0) {
                    setSelectedVariant(data.variants[0]);
                }
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        }
        fetchProduct();
        fetchReviews();
    }, [id]);

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error || !product) {
        return (
            <Container sx={{ py: 10 }}>
                <Alert severity="error">{error || 'Product not found'}</Alert>
            </Container>
        );
    }

    const displayImages = product.images && product.images.length > 0
        ? product.images.map((img: any) => img.url)
        : [product.image];

    if (selectedVariant?.image && !displayImages.includes(selectedVariant.image)) {
        displayImages.unshift(selectedVariant.image);
    }

    const handleAddToCart = () => {
        if (!selectedVariant) return;

        addToCart({
            id: selectedVariant.id,
            productId: product.id,
            variantId: selectedVariant.id,
            title: product.title,
            price: selectedVariant.price,
            image: selectedVariant.image || product.image,
            quantity: qty,
            store: product.store?.name || 'Dalab',
            attributes: selectedVariant.attributes.map((attr: any) => ({
                name: attr.attribute.name,
                value: attr.value
            }))
        });

        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    return (
        <Box sx={{ bgcolor: '#fff', minHeight: '100vh', pb: 10 }}>
            <ProductHeader />

            <Box sx={{ mt: 0, mb: 2, position: 'relative' }}>
                <Box
                    sx={{
                        display: 'flex',
                        overflowX: 'auto',
                        scrollSnapType: 'x mandatory',
                        '&::-webkit-scrollbar': { display: 'none' },
                        aspectRatio: '1/1',
                        bgcolor: '#f5f5f5',
                    }}
                    onScroll={(e: any) => {
                        const width = e.target.offsetWidth;
                        const scrollLeft = e.target.scrollLeft;
                        const index = Math.round(scrollLeft / width);
                        if (index !== selectedImage) setSelectedImage(index);
                    }}
                >
                    {displayImages.map((img: string, index: number) => (
                        <Box
                            key={index}
                            sx={{
                                minWidth: '100%',
                                scrollSnapAlign: 'center',
                                position: 'relative',
                                overflow: 'hidden',
                            }}
                        >
                            <Image
                                src={img}
                                alt={`${product.title} view ${index + 1}`}
                                fill
                                style={{ objectFit: 'contain' }}
                                unoptimized
                            />
                        </Box>
                    ))}
                </Box>
                <Stack direction="row" justifyContent="center" spacing={1} sx={{ mt: 1 }}>
                    {displayImages.map((_: any, i: number) => (
                        <Box
                            key={i}
                            sx={{
                                width: 6, height: 6, borderRadius: '50%',
                                bgcolor: i === selectedImage ? 'primary.main' : 'grey.300',
                                transition: 'background-color 0.3s'
                            }}
                        />
                    ))}
                </Stack>
            </Box>

            <Container maxWidth="md">
                <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="primary" fontWeight="bold" gutterBottom>
                        {product.store?.name || 'Dalab'}
                    </Typography>
                    <Typography variant="body1" fontWeight={500} sx={{ lineHeight: 1.4, mb: 1 }}>
                        {product.title}
                    </Typography>

                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: 'green', color: 'white', px: 0.5, borderRadius: 0.5 }}>
                            <Typography variant="caption" fontWeight="bold">{(product.rating || 4.5).toFixed(1)}</Typography>
                            <Typography variant="caption" sx={{ ml: 0.2 }}>★</Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary">(Verified Purchase)</Typography>
                    </Stack>

                    <Typography variant="h5" fontWeight="bold" sx={{ mb: 0.5 }}>
                        ${(selectedVariant?.price || product.price || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </Typography>

                    {selectedVariant?.stock <= 5 && selectedVariant?.stock > 0 && (
                        <Typography variant="caption" color="error" sx={{ bgcolor: '#fff0f0', p: 0.5, borderRadius: 0.5 }}>
                            Only {selectedVariant.stock} left in stock
                        </Typography>
                    )}
                    {selectedVariant?.stock === 0 && (
                        <Typography variant="caption" color="error" sx={{ bgcolor: '#fff0f0', p: 0.5, borderRadius: 0.5 }}>
                            Out of stock
                        </Typography>
                    )}
                </Box>

                <Divider sx={{ my: 3 }} />

                {product.variants && product.variants.length > 0 && (
                    <Box sx={{ mb: 3 }}>
                        <VariantSelector
                            variants={product.variants}
                            selectedVariant={selectedVariant}
                            onVariantChange={(v) => {
                                setSelectedVariant(v);
                            }}
                        />
                    </Box>
                )}

                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>Quantity</Typography>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            border: '1px solid #ddd',
                            borderRadius: 1,
                            bgcolor: '#fff'
                        }}>
                            <Button
                                sx={{ minWidth: 40, color: '#000', fontSize: '1.2rem' }}
                                onClick={() => setQty(Math.max(1, qty - 1))}
                            >-</Button>
                            <Typography sx={{ mx: 2, fontWeight: 'bold' }}>{qty}</Typography>
                            <Button
                                sx={{ minWidth: 40, color: '#000', fontSize: '1.2rem' }}
                                onClick={() => setQty(qty + 1)}
                            >+</Button>
                        </Box>
                        {selectedVariant?.stock <= 5 && (
                            <Typography variant="caption" color="error">
                                {selectedVariant?.stock} left!
                            </Typography>
                        )}
                    </Stack>
                </Box>

                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Delivery Information</Typography>
                    <Box sx={{ border: '1px solid #eee', borderRadius: 2, p: 2 }}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <LocalShippingOutlinedIcon color="success" />
                                <Typography variant="body2">Free delivery available</Typography>
                            </Stack>
                            <Typography variant="caption" color="text.secondary">Est. 2-3 days</Typography>
                        </Stack>
                    </Box>
                </Box>

                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Product Overview</Typography>
                    <Accordion disableGutters elevation={0} sx={{ '&:before': { display: 'none' }, borderBottom: '1px solid #eee' }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography variant="body2">Description</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography variant="body2" color="text.secondary">
                                {product.description || 'No description available for this product.'}
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                </Box>

                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Additional Information</Typography>
                    <Stack spacing={1}>
                        <Box sx={{ display: 'flex', alignItems: 'center', p: 1.5, bgcolor: '#f8f9fa', borderRadius: 1 }}>
                            <StorefrontOutlinedIcon color="primary" sx={{ mr: 2 }} />
                            <Typography variant="body2">Safe and Secure Payments</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', p: 1.5, bgcolor: '#f8f9fa', borderRadius: 1 }}>
                            <AssignmentReturnOutlinedIcon color="primary" sx={{ mr: 2 }} />
                            <Typography variant="body2">Easy Returns</Typography>
                        </Box>
                    </Stack>
                </Box>

                <Divider sx={{ my: 4 }} />

                <Box id="reviews" sx={{ mb: 3 }}>
                    <Typography variant="h6" fontWeight={800} gutterBottom>
                        Customer Reviews
                    </Typography>

                    {user && (
                        <ReviewForm productId={id} onSuccess={fetchReviews} />
                    )}

                    <ReviewList reviews={reviews} />
                </Box>
            </Container>

            {/* Sticky Footer */}
            <Box
                sx={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: 1000,
                    bgcolor: 'white',
                    borderTop: '1px solid #eee',
                    px: 2,
                    py: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0.5,
                    boxShadow: '0 -4px 10px rgba(0,0,0,0.05)',
                    pb: 'calc(12px + env(safe-area-inset-bottom))'
                }}
            >
                <TrustBadges />

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                        <Typography variant="h6" fontWeight={800} sx={{ lineHeight: 1 }}>
                            ${(selectedVariant?.price || product.price || 0).toLocaleString()}
                        </Typography>
                        <Typography variant="caption" color="success.main" fontWeight={600} sx={{ fontSize: '0.7rem' }}>
                            Free Delivery by Sat, 20
                        </Typography>
                    </Box>

                    <Button
                        variant="contained"
                        size="large"
                        disabled={!selectedVariant || selectedVariant.stock === 0 || isAdded}
                        onClick={handleAddToCart}
                        sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 700,
                            fontSize: '1rem',
                            bgcolor: isAdded ? 'success.main' : '#FFC644',
                            color: isAdded ? '#fff' : '#000',
                            px: 4,
                            py: 1,
                            minWidth: 160,
                            boxShadow: 'none',
                            transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                            transform: isAdded ? 'scale(1.05)' : 'scale(1)',
                            '&:hover': { bgcolor: isAdded ? 'success.dark' : '#e6b23d' },
                            '&:active': { transform: 'scale(0.95)' },
                            '&:disabled': { bgcolor: isAdded ? 'success.main' : '#f5f5f5', color: isAdded ? '#fff' : '#999' }
                        }}
                    >
                        {isAdded ? (
                            <Stack direction="row" spacing={1} alignItems="center">
                                <CheckCircleOutlineIcon fontSize="small" />
                                <span>ADDED</span>
                            </Stack>
                        ) : (
                            selectedVariant?.stock === 0 ? 'Out of Stock' : 'ADD TO CART'
                        )}
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}
