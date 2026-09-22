'use client';

import React from 'react';
import {
    SwipeableDrawer,
    Box,
    Typography,
    IconButton,
    Button,
    Grid,
    Chip
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { spacing, borderRadius, typography } from '@/theme/mobile';

interface VariantOption {
    id: string;
    name: string;
    value: string;
}

interface Variant {
    id: string;
    price: number;
    stock: number;
    attributes: { attribute: { name: string }, value: string }[];
}

interface VariantBottomSheetProps {
    open: boolean;
    onClose: () => void;
    variants: Variant[];
    selectedVariantId?: string;
    onSelect: (variant: Variant) => void;
}

export const VariantBottomSheet: React.FC<VariantBottomSheetProps> = ({
    open,
    onClose,
    variants,
    selectedVariantId,
    onSelect
}) => {
    // Extract unique attribute types (e.g., Color, Size)
    const attributeNames = Array.from(new Set(
        variants.flatMap(v => v.attributes.map(a => a.attribute.name))
    ));

    return (
        <SwipeableDrawer
            anchor="bottom"
            open={open}
            onClose={onClose}
            onOpen={() => { }}
            PaperProps={{
                sx: {
                    borderTopLeftRadius: borderRadius.xl,
                    borderTopRightRadius: borderRadius.xl,
                    maxHeight: '80vh',
                    backgroundColor: 'background.paper'
                }
            }}
        >
            <Box sx={{ px: spacing.lg, pt: spacing.sm, pb: spacing.lg }}>
                {/* Handle */}
                <Box sx={{
                    width: 40,
                    height: 4,
                    backgroundColor: 'divider',
                    borderRadius: 2,
                    mx: 'auto',
                    mb: spacing.md
                }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: spacing.lg }}>
                    <Typography variant="h3">Select Options</Typography>
                    <IconButton onClick={onClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>

                <Box sx={{ mb: spacing.xl }}>
                    {variants.map((variant) => (
                        <Box
                            key={variant.id}
                            onClick={() => {
                                onSelect(variant);
                                onClose();
                            }}
                            sx={{
                                p: spacing.lg,
                                mb: spacing.md,
                                borderRadius: borderRadius.lg,
                                border: '1px solid',
                                borderColor: selectedVariantId === variant.id ? 'primary.main' : 'divider',
                                backgroundColor: selectedVariantId === variant.id ? 'primary.50' : 'background.paper',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                cursor: 'pointer'
                            }}
                        >
                            <Box>
                                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                    {variant.attributes.map(a => a.value).join(' / ')}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {variant.stock > 0 ? `${variant.stock} in stock` : 'Out of stock'}
                                </Typography>
                            </Box>
                            <Typography variant="h3" color="primary.main">
                                ${variant.price.toFixed(2)}
                            </Typography>
                        </Box>
                    ))}
                </Box>

                <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={onClose}
                    sx={{ mb: spacing.md }}
                >
                    Confirm
                </Button>
            </Box>
        </SwipeableDrawer>
    );
};
