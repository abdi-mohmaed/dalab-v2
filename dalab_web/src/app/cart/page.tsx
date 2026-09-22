'use client';

import React from 'react';
import {
    Box,
    Typography,
    Container,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    IconButton,
    Button,
    Divider,
    Paper,
    Stack,
    Skeleton
} from '@mui/material';
import {
    Add as AddIcon,
    Remove as RemoveIcon,
    Delete as DeleteIcon,
    ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

import { EmptyState } from '@/components/common/EmptyState';

export default function CartPage() {
    const { items, totalPrice, totalItems, updateQuantity, removeFromCart } = useCart();
    const router = useRouter();

    if (items.length === 0) {
        return (
            <Container maxWidth="md" sx={{ py: 8 }}>
                <EmptyState
                    type="cart"
                    title="Your cart is empty"
                    description="Looks like you haven't added anything to your cart yet. Discover our latest collection and find something you love!"
                    actionLabel="Start Shopping"
                    onAction={() => router.push('/')}
                />
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ pt: 'calc(32px + env(safe-area-inset-top))', pb: 4 }}>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>
                Checkout ({totalItems} items)
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
                {/* Cart Items List */}
                <Box sx={{ flex: 2 }}>
                    <Paper elevation={0} sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                        <List disablePadding>
                            {items.map((item, index) => (
                                <React.Fragment key={item.id}>
                                    <ListItem
                                        alignItems="flex-start"
                                        sx={{ px: 0, py: 2 }}
                                        secondaryAction={
                                            <IconButton edge="end" onClick={() => removeFromCart(item.id)}>
                                                <DeleteIcon color="error" />
                                            </IconButton>
                                        }
                                    >
                                        <ListItemAvatar sx={{ mr: 2 }}>
                                            <Avatar
                                                src={item.image}
                                                variant="rounded"
                                                sx={{ width: 80, height: 80 }}
                                            />
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={
                                                <Box>
                                                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                                        {item.title}
                                                    </Typography>
                                                    {item.attributes && item.attributes.length > 0 && (
                                                        <Stack direction="row" spacing={1} sx={{ mb: 0.5 }}>
                                                            {item.attributes.map((attr: any, idx: number) => (
                                                                <Typography key={idx} variant="caption" color="text.secondary" sx={{ bgcolor: '#f0f0f0', px: 0.8, py: 0.2, borderRadius: 0.5 }}>
                                                                    {attr.name}: {attr.value}
                                                                </Typography>
                                                            ))}
                                                        </Stack>
                                                    )}
                                                </Box>
                                            }
                                            secondary={
                                                <Box sx={{ mt: 1 }}>
                                                    <Typography variant="body1" color="primary" sx={{ fontWeight: 700, mb: 1 }}>
                                                        ${item.price.toFixed(2)}
                                                    </Typography>
                                                    <Stack direction="row" alignItems="center" spacing={1}>
                                                        <Box sx={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            border: '1px solid #e0e0e0',
                                                            borderRadius: 1,
                                                            bgcolor: '#f8f8f8'
                                                        }}>
                                                            <IconButton size="small" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                                                                <RemoveIcon fontSize="small" />
                                                            </IconButton>
                                                            <Typography sx={{ px: 2, fontWeight: 600 }}>
                                                                {item.quantity}
                                                            </Typography>
                                                            <IconButton size="small" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                                                                <AddIcon fontSize="small" />
                                                            </IconButton>
                                                        </Box>
                                                    </Stack>
                                                </Box>
                                            }
                                        />
                                    </ListItem>
                                    {index < items.length - 1 && <Divider component="li" />}
                                </React.Fragment>
                            ))}
                        </List>
                    </Paper>
                </Box>

                {/* Order Summary */}
                <Box sx={{ flex: 1 }}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            border: '1px solid #e0e0e0',
                            borderRadius: 2,
                            position: 'sticky',
                            top: 24,
                            bgcolor: '#f9f9f9'
                        }}
                    >
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                            Order Summary
                        </Typography>
                        <Stack spacing={2}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography color="text.secondary">Subtotal</Typography>
                                <Typography sx={{ fontWeight: 600 }}>${totalPrice.toFixed(2)}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography color="text.secondary">Shipping Fee</Typography>
                                <Typography sx={{ color: 'success.main', fontWeight: 600 }}>FREE</Typography>
                            </Box>
                            <Divider />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>Total</Typography>
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>${totalPrice.toFixed(2)}</Typography>
                            </Box>
                            <Button
                                variant="contained"
                                fullWidth
                                size="large"
                                onClick={() => router.push('/checkout')}
                                sx={{
                                    mt: 2,
                                    bgcolor: '#FFC644',
                                    color: '#000',
                                    py: 1.5,
                                    fontWeight: 700,
                                    '&:hover': { bgcolor: '#e6b23d' }
                                }}
                            >
                                Proceed to Checkout
                            </Button>
                        </Stack>
                    </Paper>
                </Box>
            </Box>
        </Container>
    );
}
