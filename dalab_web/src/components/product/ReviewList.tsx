'use client';

import React from 'react';
import {
    Box,
    Typography,
    Rating,
    Stack,
    Divider,
    Avatar,
    Paper
} from '@mui/material';
import { Star } from '@mui/icons-material';

interface Review {
    id: string;
    rating: number;
    comment: string | null;
    createdAt: string;
    user: {
        name: string | null;
    };
}

interface ReviewListProps {
    reviews: Review[];
}

export function ReviewList({ reviews }: ReviewListProps) {
    if (reviews.length === 0) {
        return (
            <Box sx={{ py: 4, textAlign: 'center' }}>
                <Typography color="text.secondary">No reviews yet. Be the first to review this product!</Typography>
            </Box>
        );
    }

    return (
        <Stack spacing={3} sx={{ mt: 2 }}>
            {reviews.map((review) => (
                <Paper
                    key={review.id}
                    elevation={0}
                    sx={{
                        p: 2,
                        border: '1px solid #f0f0f0',
                        borderRadius: 3,
                        bgcolor: 'rgba(0,0,0,0.01)'
                    }}
                >
                    <Stack direction="row" spacing={2} sx={{ mb: 1.5 }}>
                        <Avatar sx={{ bgcolor: 'primary.light', fontSize: '1rem' }}>
                            {review.user?.name ? review.user.name[0].toUpperCase() : 'U'}
                        </Avatar>
                        <Box>
                            <Typography variant="subtitle2" fontWeight={700}>
                                {review.user?.name || 'Anonymous User'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {new Date(review.createdAt).toLocaleDateString(undefined, {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </Typography>
                        </Box>
                    </Stack>

                    <Rating
                        value={review.rating}
                        readOnly
                        size="small"
                        emptyIcon={<Star style={{ opacity: 0.55 }} fontSize="inherit" />}
                        sx={{ mb: 1 }}
                    />

                    {review.comment && (
                        <Typography variant="body2" sx={{ lineHeight: 1.5, color: '#444' }}>
                            {review.comment}
                        </Typography>
                    )}
                </Paper>
            ))}
        </Stack>
    );
}
