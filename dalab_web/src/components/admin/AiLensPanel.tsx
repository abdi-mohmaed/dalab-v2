'use client';

import React, { useState } from 'react';
import {
    Drawer,
    Box,
    Typography,
    Button,
    Stack,
    IconButton,
    CircularProgress,
    Card,
    CardMedia,
    CardContent,
    Divider,
    Alert,
    alpha,
    Grid,
    Chip
} from '@mui/material';
import {
    Close,
    CloudUpload,
    CheckCircle,
    Cancel,
    ImageSearch,
    AutoFixHigh,
    Psychology
} from '@mui/icons-material';

interface AiLensPanelProps {
    open: boolean;
    onClose: () => void;
    onAccept: (data: any) => void;
    provider: 'google' | 'lumin';
    currentImage?: string;
}

export function AiLensPanel({ open, onClose, onAccept, provider, currentImage }: AiLensPanelProps) {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async (imageToSearch: string) => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/admin/ai/lens', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    image: imageToSearch,
                    provider 
                })
            });
            
            const data = await res.json();
            if (res.ok) {
                setResult(data);
            } else {
                setError(data.error || 'Failed to analyze image');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            sx={{ zIndex: 1400 }}
            PaperProps={{
                sx: { width: { xs: '100%', sm: 500 }, p: 0 }
            }}
        >
            <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid', borderColor: 'grey.100' }}>
                <Stack direction="row" spacing={1} alignItems="center">
                    {provider === 'google' ? <ImageSearch color="primary" /> : <Psychology color="secondary" />}
                    <Typography variant="h6" fontWeight={800}>
                        {provider === 'google' ? 'Google Lens Search' : 'Lumin Lens AI'}
                    </Typography>
                </Stack>
                <IconButton onClick={onClose} size="small">
                    <Close />
                </IconButton>
            </Box>

            <Box sx={{ p: 3, flexGrow: 1, overflowY: 'auto' }}>
                {!result && !loading && (
                    <Stack spacing={4} alignItems="center" sx={{ py: 4 }}>
                        {currentImage ? (
                            <Box sx={{ width: '100%', maxWidth: 300 }}>
                                <Typography variant="subtitle2" gutterBottom align="center">Search using current image?</Typography>
                                <Card variant="outlined" sx={{ mb: 2 }}>
                                    <CardMedia
                                        component="img"
                                        image={currentImage}
                                        sx={{ height: 200, objectFit: 'contain', p: 1 }}
                                    />
                                </Card>
                                <Button 
                                    fullWidth 
                                    variant="contained" 
                                    onClick={() => handleSearch(currentImage)}
                                    startIcon={<AutoFixHigh />}
                                >
                                    Scan Current Image
                                </Button>
                                <Divider sx={{ my: 3 }}>OR</Divider>
                            </Box>
                        ) : null}
                        
                        <Box 
                            sx={{ 
                                width: '100%', 
                                border: '2px dashed', 
                                borderColor: 'grey.300', 
                                borderRadius: 3, 
                                p: 6, 
                                textAlign: 'center',
                                bgcolor: 'grey.50',
                                cursor: 'pointer',
                                '&:hover': { bgcolor: alpha('#000', 0.02), borderColor: 'primary.main' }
                            }}
                        >
                            <CloudUpload sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                            <Typography fontWeight={700}>Upload New Image</Typography>
                            <Typography variant="body2" color="text.secondary">Drag and drop or click to browse</Typography>
                            <input type="file" hidden accept="image/*" onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    const reader = new FileReader();
                                    reader.onload = (ev) => handleSearch(ev.target?.result as string);
                                    reader.readAsDataURL(file);
                                }
                            }} />
                        </Box>
                    </Stack>
                )}

                {loading && (
                    <Stack spacing={2} alignItems="center" sx={{ py: 10 }}>
                        <CircularProgress size={48} thickness={5} />
                        <Typography fontWeight={700}>AI is scanning the internet...</Typography>
                        <Typography variant="body2" color="text.secondary">Finding product details, prices, and specs</Typography>
                    </Stack>
                )}

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
                        {error}
                    </Alert>
                )}

                {result && (
                    <Stack spacing={3}>
                        <Typography variant="subtitle1" fontWeight={800}>Suggested Product Details</Typography>
                        
                        <Card variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
                            <CardMedia
                                component="img"
                                image={result.image || currentImage}
                                sx={{ height: 250, objectFit: 'contain', bgcolor: 'grey.50', p: 2 }}
                            />
                            <CardContent>
                                <Typography variant="h6" fontWeight={900} gutterBottom>
                                    {result.name}
                                </Typography>
                                <Stack direction="row" spacing={1} mb={2}>
                                    <Chip label={result.brand || 'Generic'} size="small" variant="outlined" />
                                    <Chip label={result.category || 'Uncategorized'} size="small" variant="outlined" />
                                    <Typography variant="h6" color="primary.main" sx={{ ml: 'auto' }}>
                                        ${result.price}
                                    </Typography>
                                </Stack>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    {result.description}
                                </Typography>

                                {result.specs && result.specs.length > 0 && (
                                    <Box>
                                        <Typography variant="caption" fontWeight={800} color="text.disabled" sx={{ textTransform: 'uppercase' }}>
                                            Specifications
                                        </Typography>
                                        <Grid container spacing={1} sx={{ mt: 0.5 }}>
                                            {result.specs.slice(0, 4).map((spec: any, idx: number) => (
                                                <Grid item xs={6} key={idx}>
                                                    <Box sx={{ p: 1, bgcolor: 'grey.50', borderRadius: 1.5 }}>
                                                        <Typography variant="caption" display="block" color="text.secondary">{spec.label}</Typography>
                                                        <Typography variant="caption" fontWeight={700}>{spec.value}</Typography>
                                                    </Box>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>

                        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                            <Button 
                                fullWidth 
                                variant="contained" 
                                color="success" 
                                startIcon={<CheckCircle />}
                                onClick={() => onAccept(result)}
                                sx={{ borderRadius: 2, height: 48 }}
                            >
                                Accept & Fill
                            </Button>
                            <Button 
                                fullWidth 
                                variant="outlined" 
                                color="error" 
                                startIcon={<Cancel />}
                                onClick={() => setResult(null)}
                                sx={{ borderRadius: 2, height: 48 }}
                            >
                                Reject
                            </Button>
                        </Stack>
                    </Stack>
                )}
            </Box>
        </Drawer>
    );
}
