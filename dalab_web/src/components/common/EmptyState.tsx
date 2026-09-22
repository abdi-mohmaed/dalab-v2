import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import {
    ShoppingCart as CartIcon,
    Receipt as ReceiptIcon,
    Search as SearchIcon,
    SentimentDissatisfied as SadIcon
} from '@mui/icons-material';

interface EmptyStateProps {
    type?: 'cart' | 'orders' | 'search' | 'default';
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    type = 'default',
    title,
    description,
    actionLabel,
    onAction
}) => {
    const getIcon = () => {
        switch (type) {
            case 'cart':
                return <CartIcon sx={{ fontSize: 60, color: 'text.secondary' }} />;
            case 'orders':
                return <ReceiptIcon sx={{ fontSize: 60, color: 'text.secondary' }} />;
            case 'search':
                return <SearchIcon sx={{ fontSize: 60, color: 'text.secondary' }} />;
            default:
                return <SadIcon sx={{ fontSize: 60, color: 'text.secondary' }} />;
        }
    };

    return (
        <Paper
            elevation={0}
            sx={{
                p: 6,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                bgcolor: 'transparent'
            }}
        >
            <Box sx={{ mb: 3, opacity: 0.5 }}>
                {getIcon()}
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                {title}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400 }}>
                {description}
            </Typography>
            {actionLabel && onAction && (
                <Button
                    variant="contained"
                    size="large"
                    onClick={onAction}
                    sx={{
                        fontWeight: 600,
                        px: 4,
                        py: 1.2
                    }}
                >
                    {actionLabel}
                </Button>
            )}
        </Paper>
    );
};
