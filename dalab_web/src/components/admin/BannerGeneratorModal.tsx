'use client';

import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
    Grid,
    Typography,
    Box,
    CircularProgress,
    IconButton,
    Stack,
    Paper
} from '@mui/material';
import { Close, AutoAwesome, CloudUpload, CheckCircle } from '@mui/icons-material';

interface BannerGeneratorModalProps {
    open: boolean;
    onClose: () => void;
    onAccept: (url: string, config: any) => void;
}

export function BannerGeneratorModal({ open, onClose, onAccept }: BannerGeneratorModalProps) {
    const [loading, setLoading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [config, setConfig] = useState({
        title: '',
        subtitle: '',
        style: 'Modern',
        colors: ['#6366f1', '#a855f7'],
        banner_type: 'Hero',
        format: 'PNG'
    });
    const [imageFile, setImageFile] = useState<File | null>(null);

    const handleGenerate = async () => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('config', JSON.stringify(config));
            if (imageFile) {
                formData.append('image', imageFile);
            }

            const res = await fetch('/api/admin/generate-banner', {
                method: 'POST',
                body: formData
            });

            const data = await res.json();
            if (data.success) {
                setPreviewUrl(data.url);
            } else {
                alert('Generation failed: ' + data.error);
            }
        } catch (error) {
            console.error('Error generating banner:', error);
            alert('An error occurred during generation');
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AutoAwesome color="primary" />
                    <Typography variant="h6">AI Banner Generator</Typography>
                </Box>
                <IconButton onClick={onClose} size="small"><Close /></IconButton>
            </DialogTitle>

            <DialogContent dividers>
                <Grid container spacing={3}>
                    {/* Controls */}
                    <Grid item xs={12} md={5}>
                        <Stack spacing={2}>
                            <TextField
                                fullWidth label="Main Title"
                                value={config.title}
                                onChange={(e) => setConfig({ ...config, title: e.target.value })}
                                placeholder="e.g. MEGA SUMMER SALE"
                            />
                            <TextField
                                fullWidth
                                multiline
                                rows={2}
                                label="AI Prompt / Instructions"
                                value={config.subtitle}
                                onChange={(e) => setConfig({ ...config, subtitle: e.target.value })}
                                placeholder="Describe what you want (e.g. 'Flash Sale! 50% off everything this weekend')"
                            />

                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth select label="Style"
                                        value={config.style}
                                        onChange={(e) => setConfig({ ...config, style: e.target.value })}
                                    >
                                        <MenuItem value="Modern">Modern</MenuItem>
                                        <MenuItem value="Vibrant">Vibrant</MenuItem>
                                        <MenuItem value="Minimal">Minimal</MenuItem>
                                        <MenuItem value="Brutalist">Brutalist</MenuItem>
                                    </TextField>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth select label="Type"
                                        value={config.banner_type}
                                        onChange={(e) => setConfig({ ...config, banner_type: e.target.value })}
                                    >
                                        <MenuItem value="Hero">Hero (1200x400)</MenuItem>
                                        <MenuItem value="Strip">Strip (1200x120)</MenuItem>
                                        <MenuItem value="Grid">Grid (400x400)</MenuItem>
                                    </TextField>
                                </Grid>
                            </Grid>

                            <Box>
                                <Typography variant="caption" color="text.secondary">Primary Color</Typography>
                                <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                                    {['#6366f1', '#ef4444', '#10b981', '#f59e0b', '#000000'].map(c => (
                                        <Box
                                            key={c}
                                            onClick={() => setConfig({ ...config, colors: [c, config.colors[1]] })}
                                            sx={{
                                                width: 24, height: 24, borderRadius: '50%', bgcolor: c, cursor: 'pointer',
                                                border: config.colors[0] === c ? '2px solid #000' : '1px solid #ddd'
                                            }}
                                        />
                                    ))}
                                </Box>
                            </Box>

                            <Button
                                component="label"
                                variant="outlined"
                                startIcon={<CloudUpload />}
                                sx={{ justifyContent: 'flex-start' }}
                            >
                                {imageFile ? imageFile.name : 'Attach Image (Background)'}
                                <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                            </Button>

                            <TextField
                                select fullWidth label="Output Format"
                                value={config.format}
                                onChange={(e) => setConfig({ ...config, format: e.target.value })}
                            >
                                <MenuItem value="PNG">Static Image (PNG)</MenuItem>
                                <MenuItem value="GIF">Animated GIF</MenuItem>
                            </TextField>

                            <Button
                                variant="contained"
                                size="large"
                                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <AutoAwesome />}
                                onClick={handleGenerate}
                                disabled={loading || !config.title}
                                sx={{
                                    py: 1.5,
                                    background: 'linear-gradient(45deg, #6366f1 30%, #a855f7 90%)',
                                    boxShadow: '0 3px 5px 2px rgba(168, 85, 247, .3)',
                                }}
                            >
                                {loading ? 'Generating...' : 'Magic Generate'}
                            </Button>
                        </Stack>
                    </Grid>

                    {/* Preview */}
                    <Grid item xs={12} md={7}>
                        <Paper variant="outlined" sx={{
                            height: '100%',
                            minHeight: 300,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: '#f8fafc',
                            borderRadius: 2,
                            overflow: 'hidden',
                            position: 'relative'
                        }}>
                            {previewUrl ? (
                                <>
                                    <Box sx={{ p: 2, width: '100%', height: '100%', display: 'flex', alignItems: 'center' }}>
                                        <img
                                            src={previewUrl}
                                            alt="Preview"
                                            style={{ width: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: 4 }}
                                        />
                                    </Box>
                                    <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
                                        <Paper sx={{ px: 1, py: 0.5, borderRadius: 10, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <CheckCircle color="success" fontSize="small" />
                                            <Typography variant="caption" fontWeight={700}>GENERATED</Typography>
                                        </Paper>
                                    </Box>
                                </>
                            ) : (
                                <Box sx={{ textAlign: 'center', p: 4 }}>
                                    <AutoAwesome sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                                    <Typography color="text.secondary">
                                        Configure and click Generate to see the magic.
                                    </Typography>
                                </Box>
                            )}

                            {loading && (
                                <Box sx={{
                                    position: 'absolute', inset: 0, bgcolor: 'rgba(255,255,255,0.7)',
                                    display: 'flex', flexItems: 'center', justifyContent: 'center', zIndex: 1
                                }}>
                                    <CircularProgress />
                                </Box>
                            )}
                        </Paper>
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button onClick={onClose}>Discard</Button>
                <Button
                    variant="contained"
                    onClick={() => previewUrl && onAccept(previewUrl, config)}
                    disabled={!previewUrl || loading}
                >
                    Use This Banner
                </Button>
            </DialogActions>
        </Dialog>
    );
}
