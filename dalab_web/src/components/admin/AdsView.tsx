'use client';

import React, { useState } from 'react';
import {
    Box,
    Button,
    Typography,
    Paper,
    IconButton,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    FormControlLabel,
    Switch,
} from '@mui/material';
import { Add, Edit, Delete, PlayCircle, AutoAwesome } from '@mui/icons-material';
import { useDashboard } from '@/context/DashboardContext';
import { Banner } from '@/types/admin';
import { BannerGeneratorModal } from './BannerGeneratorModal';

export function AdsView() {
    const { ads, setAds, stores, categories } = useDashboard();
    const [open, setOpen] = useState(false);
    const [genModalOpen, setGenModalOpen] = useState(false);
    const [editAd, setEditAd] = useState<Partial<Banner> | null>(null);

    const handleOpen = (ad: Banner | null = null) => {
        setEditAd(ad || {
            title: '',
            mediaUrl: 'https://placehold.co/1200x400?text=New+Promo',
            mediaType: 'IMAGE',
            bannerType: 'Hero',
            placement: 'Home',
            isActive: true,
        });
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditAd(null);
    };

    const handleSave = () => {
        if (editAd?.id) {
            setAds(prev => prev.map(a => a.id === editAd.id ? (editAd as Banner) : a));
        } else {
            const newAd = { ...editAd, id: `ad-${Date.now()}` } as Banner;
            setAds(prev => [newAd, ...prev]);
        }
        handleClose();
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Delete this banner?')) {
            setAds(prev => prev.filter(a => a.id !== id));
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>Ads & Promotions</Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        variant="outlined"
                        startIcon={<AutoAwesome />}
                        onClick={() => setGenModalOpen(true)}
                        sx={{
                            borderColor: 'divider',
                            color: 'primary.main',
                            '&:hover': { borderColor: 'primary.main', bgcolor: 'rgba(99, 102, 241, 0.04)' }
                        }}
                    >
                        Generate with AI
                    </Button>
                    <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>
                        Create Banner
                    </Button>
                </Box>
            </Box>

            <Grid container spacing={3}>
                {ads.map((ad) => (
                    <Grid item xs={12} sm={6} lg={4} key={ad.id}>
                        <Card sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                            <Box sx={{ position: 'relative' }}>
                                <CardMedia
                                    component="img"
                                    height="140"
                                    image={ad.mediaUrl}
                                    alt={ad.title}
                                />
                                {ad.mediaType === 'VIDEO' && (
                                    <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'white', opacity: 0.8 }}>
                                        <PlayCircle fontSize="large" />
                                    </Box>
                                )}
                            </Box>
                            <CardContent sx={{ pb: 1 }}>
                                <Typography variant="subtitle1" fontWeight={700} noWrap>{ad.title}</Typography>
                                <Typography variant="caption" color="text.secondary" display="block">
                                    Type: {ad.bannerType} | Placement: {ad.placement}
                                </Typography>
                                <FormControlLabel
                                    control={<Switch size="small" checked={ad.isActive} />}
                                    label="Active"
                                    sx={{ mt: 1 }}
                                />
                            </CardContent>
                            <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2 }}>
                                <IconButton size="small" onClick={() => handleOpen(ad)}><Edit fontSize="inherit" /></IconButton>
                                <IconButton size="small" color="error" onClick={() => handleDelete(ad.id)}><Delete fontSize="inherit" /></IconButton>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>{editAd?.id ? 'Edit Banner' : 'Create Banner'}</DialogTitle>
                <DialogContent dividers>
                    <TextField
                        fullWidth label="Banner Title" margin="normal"
                        value={editAd?.title || ''}
                        onChange={(e) => setEditAd({ ...editAd!, title: e.target.value })}
                    />
                    <TextField
                        fullWidth label="Media URL" margin="normal"
                        value={editAd?.mediaUrl || ''}
                        onChange={(e) => setEditAd({ ...editAd!, mediaUrl: e.target.value })}
                    />
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth select label="Media Type" margin="normal"
                                value={editAd?.mediaType || 'IMAGE'}
                                onChange={(e) => setEditAd({ ...editAd!, mediaType: e.target.value as any })}
                            >
                                <MenuItem value="IMAGE">PNG / JPG</MenuItem>
                                <MenuItem value="GIF">GIF</MenuItem>
                                <MenuItem value="VIDEO">Video</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth select label="Banner Type" margin="normal"
                                value={editAd?.bannerType || 'Hero'}
                                onChange={(e) => setEditAd({ ...editAd!, bannerType: e.target.value })}
                            >
                                <MenuItem value="Hero">Hero Banner</MenuItem>
                                <MenuItem value="Strip">Strip Banner</MenuItem>
                                <MenuItem value="Grid">Grid Banner</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth label="Placement" margin="normal" placeholder="e.g. Home, Category"
                                value={editAd?.placement || ''}
                                onChange={(e) => setEditAd({ ...editAd!, placement: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth label="Schedule End" margin="normal" type="date" InputLabelProps={{ shrink: true }}
                                value={editAd?.scheduledEnd || ''}
                                onChange={(e) => setEditAd({ ...editAd!, scheduledEnd: e.target.value })}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained">Save Banner</Button>
                </DialogActions>
            </Dialog>

            <BannerGeneratorModal
                open={genModalOpen}
                onClose={() => setGenModalOpen(false)}
                onAccept={(url, config) => {
                    // Pre-fill create dialog with generated data
                    setEditAd({
                        title: config.title,
                        mediaUrl: url,
                        mediaType: config.format === 'GIF' ? 'GIF' : 'IMAGE',
                        bannerType: config.banner_type,
                        placement: 'Home',
                        isActive: true,
                    });
                    setGenModalOpen(false);
                    setOpen(true);
                }}
            />
        </Box>
    );
}
