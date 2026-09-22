'use client';

import React, { useState } from 'react';
import {
    Box,
    Typography,
    Rating,
    TextField,
    Button,
    Alert,
    CircularProgress,
    Paper
} from '@mui/material';
import { Star } from '@mui/icons-material';

interface ReviewFormProps {
    productId: string;
    onSuccess: () => void;
}

export function ReviewForm({ productId, onSuccess }: ReviewFormProps) {
    const [rating, setRating] = useState<number | null>(0);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!rating) {
            setError('Please select a rating');
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await fetch(`/api/products/${productId}/reviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rating, comment })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to submit review');
            }

            setSuccess(true);
            onSuccess();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (success) {
        return (
            <Alert severity="success" sx={{ borderRadius: 2 }}>
                Thank you! Your review has been submitted successfully.
            </Alert>
        );
    }

    return (
        <Paper elevation={0} sx={{ p: 3, bgcolor: '#f9f9f9', borderRadius: 3, mb: 4 }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
                Write a Review
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Share your experience with this product to help other shoppers.
            </Typography>

            <form onSubmit={handleSubmit}>
                <Box sx={{ mb: 2 }}>
                    <Typography component="legend" variant="subtitle2" sx={{ mb: 0.5 }}>Your Rating</Typography>
                    <Rating
                        name="product-rating"
                        value={rating}
                        onChange={(_, newValue) => setRating(newValue)}
                        size="large"
                        emptyIcon={<Star style={{ opacity: 0.55 }} fontSize="inherit" />}
                    />
                </Box>

                <TextField
                    fullWidth
                    label="Your Comment (Optional)"
                    multiline
                    rows={3}
                    placeholder="What did you like or dislike? How was the quality?"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    sx={{ mb: 2, bgcolor: 'white' }}
                />

                {error && (
                    <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                        {error}
                    </Alert>
                )}

                <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                    sx={{
                        borderRadius: 2,
                        px: 4,
                        py: 1,
                        textTransform: 'none',
                        fontWeight: 600
                    }}
                >
                    {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Submit Review'}
                </Button>
            </form>
        </Paper>
    );
}
