'use client';

import React, { useState } from 'react';
import {
    Box,
    Button,
    Typography,
    Paper,
    IconButton,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    ListItemIcon,
    Checkbox,
    Stack,
    Switch,
    FormControlLabel,
} from '@mui/material';
import { Add, Edit, Delete, DragHandle, Star, AutoAwesome } from '@mui/icons-material';
import { useDashboard } from '@/context/DashboardContext';
import { AdminTable } from './AdminTable';
import { HomepageSection } from '@/types/admin';
import { BannerGeneratorModal } from './BannerGeneratorModal';
import { BannerUploader } from './BannerUploader';

export function HomepageSectionsView() {
    const {
        homepageSections,
        setHomepageSections,
        products,
        saveHomepageSection,
        deleteHomepageSection
    } = useDashboard();

    const [open, setOpen] = useState(false);
    const [editSection, setEditSection] = useState<Partial<HomepageSection> | null>(null);
    const [productSearch, setProductSearch] = useState('');
    const [genModalOpen, setGenModalOpen] = useState(false);
    const [activeBannerIndex, setActiveBannerIndex] = useState<number | null>(null);

    const handleOpen = (section: HomepageSection | null = null) => {
        setEditSection(section || {
            title: '',
            type: 'PRODUCTS',
            productIds: [],
            config: {},
            order: homepageSections.length + 1,
            active: true,
        });
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditSection(null);
    };

    const handleSave = async () => {
        if (editSection) {
            // Ensure productIds are moved into config for PRODUCTS type
            const finalSection = { ...editSection };
            if (finalSection.type === 'PRODUCTS' && finalSection.productIds) {
                finalSection.config = {
                    ...finalSection.config,
                    productIds: finalSection.productIds
                };
            }

            console.log('Sending Section Update:', JSON.stringify(finalSection, null, 2)); // DEBUG
            await saveHomepageSection(finalSection);
        }
        handleClose();
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Delete this section?')) {
            await deleteHomepageSection(id);
        }
    };

    const handleToggleProduct = (productId: string) => {
        const currentIds = editSection?.productIds || [];
        const newIds = currentIds.includes(productId)
            ? currentIds.filter(id => id !== productId)
            : [...currentIds, productId];
        setEditSection({ ...editSection!, productIds: newIds });
    };

    const filteredProducts = products.filter(p =>
        p.title.toLowerCase().includes(productSearch.toLowerCase())
    );

    const columns = [
        { id: 'order', label: 'Order', minWidth: 60 },
        { id: 'title', label: 'Section Title', minWidth: 200 },
        { id: 'type', label: 'Type', minWidth: 120 },
        { id: 'productIds', label: 'Items', minWidth: 100, format: (val: string[]) => val ? `${val.length} Items` : '0 Items' },
        {
            id: 'active',
            label: 'Visible',
            minWidth: 100,
            format: (val: boolean, row: HomepageSection) => (
                <Switch
                    checked={val}
                    size="small"
                    onChange={() => saveHomepageSection({ ...row, active: !row.active })}
                />
            )
        },
        {
            id: 'actions',
            label: 'Actions',
            minWidth: 120,
            align: 'right',
            format: (_: any, row: HomepageSection) => (
                <Box>
                    <IconButton size="small" onClick={() => handleOpen(row)}><Edit fontSize="inherit" /></IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDelete(row.id)}><Delete fontSize="inherit" /></IconButton>
                </Box>
            )
        }
    ];

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>Homepage Layout Engine</Typography>
                <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>
                    Add Section
                </Button>
            </Box>

            <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <AdminTable
                    columns={columns as any}
                    rows={[...homepageSections].sort((a, b) => a.order - b.order)}
                    count={homepageSections.length}
                    page={0}
                    rowsPerPage={10}
                    onPageChange={() => { }}
                    onRowsPerPageChange={() => { }}
                />
            </Paper>

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>{editSection?.id ? 'Edit Section' : 'Add Section'}</DialogTitle>
                <DialogContent dividers>
                    <TextField
                        fullWidth label="Section Title" margin="normal"
                        value={editSection?.title || ''}
                        onChange={(e) => setEditSection({ ...editSection!, title: e.target.value })}
                        placeholder="e.g. Recommended, Hot Sellers"
                    />

                    <TextField
                        select
                        fullWidth
                        label="Section Type"
                        margin="normal"
                        value={editSection?.type || 'PRODUCTS'}
                        onChange={(e) => setEditSection({ ...editSection!, type: e.target.value })}
                        SelectProps={{ native: true }}
                    >
                        <option value="PRODUCTS">Products Row</option>
                        <option value="BANNERS">Big Banner Slider</option>
                        <option value="CATEGORIES">Categories Grid</option>
                        <option value="SMALL_BANNERS">Small Banner</option>
                        <option value="PROMO">Promo Banner</option>
                    </TextField>

                    <TextField
                        fullWidth label="Display Order" margin="normal" type="number"
                        value={editSection?.order || 1}
                        onChange={(e) => setEditSection({ ...editSection!, order: parseInt(e.target.value) })}
                    />

                    {(editSection?.type === 'BANNERS' || editSection?.type === 'SMALL_BANNERS' || editSection?.type === 'PROMO') && (
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>Banner Configuration</Typography>

                            {/* Auto Scroll Toggle */}
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={editSection.config?.autoScroll || false}
                                        onChange={(e) => {
                                            const newConfig = { ...editSection.config, autoScroll: e.target.checked };
                                            setEditSection({ ...editSection, config: newConfig });
                                        }}
                                    />
                                }
                                label="Auto Scroll"
                            />

                            {/* Banners List */}
                            <Box sx={{ mt: 2 }}>
                                {(editSection.config?.banners || [{}]).map((banner: any, index: number) => (
                                    <Paper key={index} variant="outlined" sx={{ p: 2, mb: 2, bgcolor: '#fafafa' }}>
                                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                                            Banner #{index + 1}
                                        </Typography>

                                        <Stack spacing={2} sx={{ mt: 1 }}>
                                            <Box sx={{ display: 'flex', gap: 2 }}>
                                                <TextField
                                                    select
                                                    label="Type"
                                                    size="small"
                                                    value={banner.type || 'image'}
                                                    onChange={(e) => {
                                                        const newBanners = [...(editSection.config?.banners || [{}])];
                                                        newBanners[index] = { ...newBanners[index], type: e.target.value };
                                                        setEditSection({ ...editSection, config: { ...editSection.config, banners: newBanners } });
                                                    }}
                                                    SelectProps={{ native: true }}
                                                    sx={{ width: 120 }}
                                                >
                                                    <option value="image">Image</option>
                                                    <option value="video">Video</option>
                                                </TextField>

                                                <TextField
                                                    fullWidth
                                                    label="Banner Name"
                                                    size="small"
                                                    value={banner.title || ''}
                                                    onChange={(e) => {
                                                        const newBanners = [...(editSection.config?.banners || [{}])];
                                                        newBanners[index] = { ...newBanners[index], title: e.target.value };
                                                        setEditSection({ ...editSection, config: { ...editSection.config, banners: newBanners } });
                                                    }}
                                                />
                                            </Box>

                                            <BannerUploader
                                                label="Banner Media"
                                                currentUrl={banner.src || ''}
                                                currentType={banner.type === 'video' ? 'video' : 'image'}
                                                onUploadSuccess={(url, type) => {
                                                    const newBanners = [...(editSection.config?.banners || [{}])];
                                                    newBanners[index] = {
                                                        ...newBanners[index],
                                                        src: url,
                                                        type: type // Update type automatically
                                                    };
                                                    setEditSection({ ...editSection, config: { ...editSection.config, banners: newBanners } });
                                                }}
                                            />

                                            <TextField
                                                fullWidth
                                                type="datetime-local"
                                                label="End Schedule"
                                                size="small"
                                                InputLabelProps={{ shrink: true }}
                                                value={banner.scheduleEnd || ''}
                                                onChange={(e) => {
                                                    const newBanners = [...(editSection.config?.banners || [{}])];
                                                    newBanners[index] = { ...newBanners[index], scheduleEnd: e.target.value };
                                                    setEditSection({ ...editSection, config: { ...editSection.config, banners: newBanners } });
                                                }}
                                            />

                                            <Button
                                                size="small"
                                                color="error"
                                                onClick={() => {
                                                    const newBanners = [...(editSection.config?.banners || [])];
                                                    newBanners.splice(index, 1);
                                                    setEditSection({ ...editSection, config: { ...editSection.config, banners: newBanners } });
                                                }}
                                            >
                                                Remove Banner
                                            </Button>
                                        </Stack>
                                    </Paper>
                                ))}

                                <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                                    <Button
                                        startIcon={<Add />}
                                        variant="outlined"
                                        onClick={() => {
                                            const currentBanners = editSection.config?.banners || [];
                                            const newBanners = [...currentBanners, { type: 'image', title: '', src: '' }];
                                            setEditSection({ ...editSection, config: { ...editSection.config, banners: newBanners } });
                                        }}
                                    >
                                        Add Another Banner
                                    </Button>
                                    <Button
                                        startIcon={<AutoAwesome />}
                                        variant="outlined"
                                        color="secondary"
                                        onClick={() => {
                                            setActiveBannerIndex(null); // Adding new
                                            setGenModalOpen(true);
                                        }}
                                    >
                                        Generate with AI
                                    </Button>
                                </Stack>
                            </Box>
                        </Box>
                    )}

                    {editSection?.type === 'PRODUCTS' && (
                        <>
                            <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, fontWeight: 700 }}>Select Products ({editSection?.productIds?.length || 0})</Typography>
                            <TextField
                                fullWidth label="Search Products" size="small" margin="dense"
                                value={productSearch}
                                onChange={(e) => setProductSearch(e.target.value)}
                            />
                            <List sx={{ maxHeight: 300, overflow: 'auto', mt: 1, bgcolor: '#f9f9f9', borderRadius: 1 }}>
                                {filteredProducts.map((p) => (
                                    <ListItem key={p.id} dense disablePadding>
                                        <ListItemButton onClick={() => handleToggleProduct(p.id)}>
                                            <ListItemIcon sx={{ minWidth: 40 }}>
                                                <Checkbox
                                                    edge="start"
                                                    checked={editSection?.productIds?.includes(p.id) || false}
                                                    tabIndex={-1}
                                                    disableRipple
                                                />
                                            </ListItemIcon>
                                            <ListItemText primary={p.title} secondary={`$${p.price}`} />
                                        </ListItemButton>
                                    </ListItem>
                                ))}
                            </List>
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained">Save Section</Button>
                </DialogActions>
            </Dialog>

            <BannerGeneratorModal
                open={genModalOpen}
                onClose={() => setGenModalOpen(false)}
                onAccept={(url, config) => {
                    const currentBanners = [...(editSection?.config?.banners || [])];
                    const newBanner = {
                        type: config.format === 'GIF' ? 'video' : 'image', // Homepage config uses lowercase
                        title: config.title,
                        src: url,
                        scheduleEnd: ''
                    };

                    if (activeBannerIndex !== null) {
                        currentBanners[activeBannerIndex] = newBanner;
                    } else {
                        currentBanners.push(newBanner);
                    }

                    setEditSection({
                        ...editSection!,
                        config: { ...editSection!.config, banners: currentBanners }
                    });
                    setGenModalOpen(false);
                }}
            />
        </Box>
    );
}
