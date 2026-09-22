'use client';

import React from 'react';
import { Box, Typography, Button, Stack, Chip } from '@mui/material';

interface AttributeValue {
    id: string;
    name: string;
    value: string;
}

interface Variant {
    id: string;
    sku: string;
    price: number;
    stock: number;
    image?: string;
    attributes: {
        attribute: {
            id: string;
            name: string;
            type: string;
        };
        value: string;
    }[];
}

interface VariantSelectorProps {
    variants: Variant[];
    selectedVariant: Variant | null;
    onVariantChange: (variant: Variant) => void;
}

export function VariantSelector({ variants, selectedVariant, onVariantChange }: VariantSelectorProps) {
    // 1. Group attributes and their possible values from all variants
    const allAttributes: Record<string, { id: string; name: string; type: string; values: Set<string> }> = {};

    variants.forEach(variant => {
        variant.attributes.forEach(attr => {
            if (!allAttributes[attr.attribute.name]) {
                allAttributes[attr.attribute.name] = {
                    id: attr.attribute.id,
                    name: attr.attribute.name,
                    type: attr.attribute.type,
                    values: new Set<string>()
                };
            }
            allAttributes[attr.attribute.name].values.add(attr.value);
        });
    });

    // 2. Current selected values
    const currentSelections: Record<string, string> = {};
    if (selectedVariant) {
        selectedVariant.attributes.forEach(attr => {
            currentSelections[attr.attribute.name] = attr.value;
        });
    }

    const handleSelect = (attrName: string, value: string) => {
        const nextSelections = { ...currentSelections, [attrName]: value };

        // Find variant that matches the best
        const matchingVariant = variants.find(variant => {
            return variant.attributes.every(attr => {
                const selectedVal = nextSelections[attr.attribute.name];
                return !selectedVal || attr.value === selectedVal;
            });
        });

        if (matchingVariant) {
            onVariantChange(matchingVariant);
        }
    };

    return (
        <Stack spacing={3}>
            {Object.values(allAttributes).map(attr => (
                <Box key={attr.id}>
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1, textTransform: 'capitalize' }}>
                        {attr.name}
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        {Array.from(attr.values).map(val => {
                            const isSelected = currentSelections[attr.name] === val;
                            const isColor = attr.type === 'COLOR';

                            if (isColor) {
                                return (
                                    <Box
                                        key={val}
                                        onClick={() => handleSelect(attr.name, val)}
                                        sx={{
                                            width: 44,
                                            height: 44,
                                            borderRadius: '50%',
                                            bgcolor: val.toLowerCase().replace(' ', ''),
                                            border: isSelected ? '2px solid #ffffff' : '1px solid #ddd',
                                            outline: isSelected ? '2px solid #000000' : 'none',
                                            cursor: 'pointer',
                                            boxShadow: 'none',
                                            transition: 'all 0.2s',
                                            '&:hover': { transform: 'scale(1.05)' }
                                        }}
                                        title={val}
                                    />
                                );
                            }

                            return (
                                <Box
                                    key={val}
                                    onClick={() => handleSelect(attr.name, val)}
                                    sx={{
                                        border: isSelected ? '2px solid #000000' : '1px solid #e0e0e0',
                                        borderRadius: '8px',
                                        px: 2,
                                        py: 1,
                                        cursor: 'pointer',
                                        bgcolor: isSelected ? '#fff' : '#f9f9f9',
                                        minWidth: 48,
                                        textAlign: 'center',
                                        transition: 'all 0.1s'
                                    }}
                                >
                                    <Typography
                                        variant="body2"
                                        fontWeight={isSelected ? 700 : 400}
                                        color={isSelected ? '#000' : '#666'}
                                    >
                                        {val}
                                    </Typography>
                                </Box>
                            );
                        })}
                    </Stack>
                </Box>
            ))}
        </Stack>
    );
}
