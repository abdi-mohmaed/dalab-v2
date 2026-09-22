'use client';

import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
    MenuItem,
    Box,
    Typography,
    IconButton,
    Paper,
    Divider,
    Stack,
    Tabs,
    Tab,
    Chip,
    Switch,
    FormControlLabel,
    FormGroup,
    Select,
    InputLabel,
    FormControl,
} from '@mui/material';
import {
    Add, Delete, Inventory, Collections, Settings,
    AutoFixHigh, Psychology, ShoppingCart, LocalOffer,
    Star, Timer, Label
} from '@mui/icons-material';
import { CircularProgress } from '@mui/material';
import { Product, ProductVariant, ProductType } from '@/types/product';
import { useDashboard } from '@/context/DashboardContext';
import { MultiImageUploader } from './MultiImageUploader';
import { AiLensPanel } from './AiLensPanel';
import { ImageSearch } from '@mui/icons-material';

interface ProductModalProps {
    open: boolean;
    onClose: () => void;
    product: Partial<Product> | null;
    onSave: (product: any) => void;
}

export function ProductModal({ open, onClose, product, onSave }: ProductModalProps) {
    const { stores, categories, productTypes } = useDashboard();
    const [activeTab, setActiveTab] = useState(0);
    const [formData, setFormData] = useState<any>({
        title: '',
        price: 0,
        description: '',
        image: '',
        images: [],
        variants: [],
        productTypeId: '',
        attributes: [],
        // Advanced labeling fields
        productTags: [],
        showTags: true,
        distributionTags: [],
        showDistributionTags: true,
        manualRating: 0,
        useAutoRating: false,
        showRating: true,
        urgencyConfig: {
            enabled: false,
            type: 'COUNTDOWN',
            countdownHours: 24,
            countdownMinutes: 0,
            messageTemplate: 'This offer is only available for {{time}}'
        }
    });
    const [availableTags, setAvailableTags] = useState<any[]>([]);
    const [isRewriting, setIsRewriting] = useState(false);
    const [isExtracting, setIsExtracting] = useState(false);
    const [isFetchingAmazon, setIsFetchingAmazon] = useState(false);
    const [amazonAsin, setAmazonAsin] = useState('');
    const [lensOpen, setLensOpen] = useState(false);
    const [lensProvider, setLensProvider] = useState<'google' | 'lumin'>('google');

    useEffect(() => {
        if (open) {
            if (product) {
                setFormData({
                    ...product,
                    productTags: product.productTags?.map((pt: any) => pt.tagId) || [],
                    distributionTags: typeof product.distributionTags === 'string'
                        ? JSON.parse(product.distributionTags)
                        : (product.distributionTags || [])
                });
            } else {
                setFormData({
                    title: '',
                    price: 0,
                    description: '',
                    image: '',
                    images: [],
                    variants: [],
                    storeId: stores.find(s => s.slug === 'dalab')?.id || stores[0]?.id || '',
                    categoryId: categories[0]?.id || '',
                    productTypeId: productTypes[0]?.id || '',
                    attributes: [],
                    productTags: [availableTags.find((t: any) => t.name === 'best-seller')?.id].filter(Boolean) as string[],
                    showTags: true,
                    distributionTags: [],
                    showDistributionTags: true,
                    manualRating: 0,
                    useAutoRating: true,
                    showRating: true,
                    urgencyConfig: {
                        enabled: false,
                        type: 'COUNTDOWN',
                        countdownHours: 24,
                        countdownMinutes: 0,
                        messageTemplate: 'This offer is only available for {{time}}'
                    }
                });
            }
        }
    }, [open, product, availableTags]);

    useEffect(() => {
        if (open) {
            fetch('/api/admin/tags')
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) setAvailableTags(data);
                })
                .catch(err => console.error('Error fetching tags:', err));
        }
    }, [open]);

    const handleVariantChange = (id: string, field: string, value: any) => {
        setFormData({
            ...formData,
            variants: (formData.variants as any[] || []).map(v => 
                v.id === id ? { ...v, [field]: value } : v
            )
        });
    };

    const handleAddVariant = () => {
        const newVariant: ProductVariant = {
            id: `new-v-${Date.now()}`,
            productId: formData.id || '',
            sku: `SKU-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            price: formData.price || 0,
            stock: 0,
            status: 'ACTIVE',
            attributes: []
        };
        setFormData({ ...formData, variants: [...(formData.variants || []), newVariant] });
    };

    const handleRemoveVariant = (id: string) => {
        setFormData({ ...formData, variants: (formData.variants as any[] || []).filter(v => v.id !== id) });
    };

    const handleAiLensAccept = (result: any) => {
        setFormData({
            ...formData,
            title: result.name || formData.title,
            price: result.price || formData.price,
            description: result.description || formData.description,
            image: result.image || formData.image,
            // Optionally merge images if provider returns multiple
            brand: result.brand || formData.brand,
            category: result.category || formData.category,
        });
        setLensOpen(false);
    };

    const selectedType = productTypes.find(t => t.id === formData.productTypeId);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Inventory color="primary" />
                    <Typography variant="h6" component="span">
                        {formData.id ? 'Edit Product' : 'Add New Product'}
                    </Typography>
                </Stack>
            </DialogTitle>

            <Tabs
                value={activeTab}
                onChange={(_, v) => setActiveTab(v)}
                sx={{ px: 3, borderBottom: 1, borderColor: 'divider' }}
            >
                <Tab icon={<Settings fontSize="small" />} label="General Info" iconPosition="start" />
                <Tab icon={<Label fontSize="small" />} label="Labeling & Urgency" iconPosition="start" />
                <Tab icon={<Collections fontSize="small" />} label="Media" iconPosition="start" />
                <Tab icon={<Inventory fontSize="small" />} label="Variants" iconPosition="start" />
            </Tabs>

            <DialogContent sx={{ mt: 2 }}>
                {activeTab === 0 && (
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                                <Button
                                    variant="outlined"
                                    startIcon={<ImageSearch />}
                                    onClick={() => { setLensProvider('google'); setLensOpen(true); }}
                                    sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
                                >
                                    Find Product (Google Lens)
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    startIcon={<Psychology />}
                                    onClick={() => { setLensProvider('lumin'); setLensOpen(true); }}
                                    sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
                                >
                                    Find Product (Lumin Lens AI)
                                </Button>
                            </Stack>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth label="Product Title *"
                                value={formData.title || ''}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth select label="Store *"
                                value={formData.storeId || ''}
                                onChange={(e) => setFormData({ ...formData, storeId: e.target.value })}
                            >
                                {stores.map(s => <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>)}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth select label="Category"
                                value={formData.categoryId || ''}
                                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                            >
                                {categories.map(c => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth select label="Product Type"
                                value={formData.productTypeId || ''}
                                onChange={(e) => setFormData({ ...formData, productTypeId: e.target.value })}
                            >
                                {productTypes.map(t => <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>)}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth label="Base Price ($)" type="number"
                                value={formData.price === 0 ? '' : formData.price}
                                onChange={(e) => {
                                    const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                                    setFormData({ ...formData, price: isNaN(val) ? 0 : val });
                                }}
                                InputProps={{
                                    startAdornment: <Typography variant="body2" sx={{ mr: 1, color: 'text.secondary' }}>$</Typography>
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Box sx={{ mt: 1, p: 2, border: '1px dashed', borderColor: 'divider', borderRadius: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
                                {formData.image ? (
                                    <img src={formData.image} alt="Preview" style={{ width: 80, height: 80, borderRadius: 4, objectFit: 'contain' }} />
                                ) : (
                                    <Box sx={{ width: 80, height: 80, bgcolor: 'grey.100', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Collections color="disabled" />
                                    </Box>
                                )}
                                <Typography variant="body2" color="text.secondary">
                                    {formData.image ? 'Main product image set' : 'No main image set. Please upload one in the Media tab.'}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Product Description</Typography>
                                <Button
                                    size="small"
                                    startIcon={isRewriting ? <CircularProgress size={16} /> : <AutoFixHigh />}
                                    onClick={async () => {
                                        setIsRewriting(true);
                                        try {
                                            const res = await fetch('/api/admin/ai/rewrite', {
                                                method: 'POST',
                                                body: JSON.stringify({
                                                    text: formData.description,
                                                    title: formData.title,
                                                    type: 'description'
                                                })
                                            });
                                            const data = await res.json();
                                            if (data.result) {
                                                setFormData({ ...formData, description: data.result });
                                            }
                                        } catch (err) {
                                            console.error(err);
                                        } finally {
                                            setIsRewriting(false);
                                        }
                                    }}
                                    disabled={isRewriting || !formData.description}
                                >
                                    AI Rewrite
                                </Button>
                            </Box>
                            <TextField
                                fullWidth multiline rows={4}
                                value={formData.description || ''}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Enter product description..."
                            />
                        </Grid>

                        {selectedType && (
                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                        Dynamic Attributes
                                    </Typography>
                                    <Button
                                        size="small"
                                        color="secondary"
                                        startIcon={isExtracting ? <CircularProgress size={16} /> : <Psychology />}
                                        onClick={async () => {
                                            setIsExtracting(true);
                                            try {
                                                const res = await fetch('/api/admin/ai/rewrite', {
                                                    method: 'POST',
                                                    body: JSON.stringify({
                                                        text: formData.description,
                                                        title: formData.title,
                                                        type: 'extract_info'
                                                    })
                                                });
                                                const data = await res.json();
                                                if (data.result) {
                                                    const extracted = JSON.parse(data.result);
                                                    const newAttributes = [...(formData.attributes || [])];

                                                    // Try to match extracted keys with defined attributes
                                                    selectedType.attributes.forEach((attr: any) => {
                                                        const key = Object.keys(extracted).find(
                                                            k => k.toLowerCase() === attr.name.toLowerCase()
                                                        );
                                                        if (key) {
                                                            const existingIdx = newAttributes.findIndex(a => a.attributeId === attr.id);
                                                            if (existingIdx >= 0) {
                                                                newAttributes[existingIdx].value = extracted[key];
                                                            } else {
                                                                newAttributes.push({
                                                                    id: `ai-${Date.now()}-${attr.id}`,
                                                                    attributeId: attr.id,
                                                                    attribute: attr,
                                                                    value: extracted[key]
                                                                } as any);
                                                            }
                                                        }
                                                    });

                                                    // Sync with variants too
                                                    const newVariants = (formData.variants || []).map((v: any) => {
                                                        const vAttrs = [...(v.attributes || [])];
                                                        selectedType.attributes.forEach((attr: any) => {
                                                            const key = Object.keys(extracted).find(
                                                                k => k.toLowerCase() === attr.name.toLowerCase()
                                                            );
                                                            if (key) {
                                                                const exIdx = vAttrs.findIndex(a => a.attributeId === attr.id);
                                                                if (exIdx >= 0) vAttrs[exIdx].value = extracted[key];
                                                                else vAttrs.push({ id: `ai-v-${Date.now()}-${attr.id}`, attributeId: attr.id, value: extracted[key] } as any);
                                                            }
                                                        });
                                                        return { ...v, attributes: vAttrs };
                                                    });

                                                    setFormData({ ...formData, attributes: newAttributes, variants: newVariants });
                                                    alert("AI successfully extracted info!");
                                                }
                                            } catch (err) {
                                                console.error(err);
                                            } finally {
                                                setIsExtracting(false);
                                            }
                                        }}
                                        disabled={isExtracting || !formData.description}
                                    >
                                        AI Extract Info
                                    </Button>
                                </Box>
                                <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                                    <Grid container spacing={2}>
                                        {selectedType.attributes.map((attr: any) => {
                                            const val = formData.attributes?.find((a: any) => a.attributeId === attr.id)?.value || '';
                                            return (
                                                <Grid item xs={12} sm={4} key={attr.id}>
                                                    <TextField
                                                        fullWidth
                                                        label={attr.name}
                                                        size="small"
                                                        value={val}
                                                        onChange={(e) => {
                                                            const newAttrs = [...(formData.attributes || [])];
                                                            const idx = newAttrs.findIndex(a => a.attributeId === attr.id);
                                                            if (idx >= 0) {
                                                                newAttrs[idx].value = e.target.value;
                                                            } else {
                                                                newAttrs.push({
                                                                    id: `new-${Date.now()}-${attr.id}`,
                                                                    attributeId: attr.id,
                                                                    attribute: attr,
                                                                    value: e.target.value
                                                                } as any);
                                                            }
                                                            setFormData({ ...formData, attributes: newAttrs });
                                                        }}
                                                        placeholder={`Enter ${attr.name}`}
                                                    />
                                                </Grid>
                                            );
                                        })}
                                    </Grid>
                                </Paper>
                            </Grid>
                        )}
                    </Grid>
                )}

                {activeTab === 1 && (
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Paper variant="outlined" sx={{ p: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <LocalOffer color="primary" fontSize="small" />
                                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Product Tags</Typography>
                                    </Stack>
                                    <FormControlLabel
                                        control={<Switch checked={formData.showTags} onChange={(e) => setFormData({ ...formData, showTags: e.target.checked })} />}
                                        label={<Typography variant="body2">Show Tags</Typography>}
                                    />
                                </Box>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {availableTags.map((tag) => (
                                        <Chip
                                            key={tag.id}
                                            label={tag.displayName}
                                            onClick={() => {
                                                const currentTags = (formData.productTags as unknown as string[]) || [];
                                                const newTags = currentTags.includes(tag.id)
                                                    ? currentTags.filter(id => id !== tag.id)
                                                    : [...currentTags, tag.id];
                                                setFormData({ ...formData, productTags: newTags as any });
                                            }}
                                            color={((formData.productTags as string[]) || []).includes(tag.id) ? "primary" : "default"}
                                            variant={((formData.productTags as string[]) || []).includes(tag.id) ? "filled" : "outlined"}
                                            icon={tag.icon ? <span>{tag.icon}</span> : undefined}
                                            sx={{
                                                borderColor: tag.color,
                                                bgcolor: ((formData.productTags as string[]) || []).includes(tag.id) ? tag.color : 'transparent',
                                                color: ((formData.productTags as string[]) || []).includes(tag.id) ? '#fff' : 'inherit'
                                            }}
                                        />
                                    ))}
                                </Box>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Star color="warning" fontSize="small" />
                                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Rating Logic</Typography>
                                    </Stack>
                                    <FormControlLabel
                                        control={<Switch checked={formData.showRating} onChange={(e) => setFormData({ ...formData, showRating: e.target.checked })} />}
                                        label={<Typography variant="body2">Show Rating</Typography>}
                                    />
                                </Box>
                                <Stack spacing={2}>
                                    <FormControlLabel
                                        control={<Switch checked={formData.useAutoRating} onChange={(e) => setFormData({ ...formData, useAutoRating: e.target.checked })} />}
                                        label={<Typography variant="body2">Auto-generate random rating (1-5)</Typography>}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Manual Rating Override (1-5)"
                                        type="number"
                                        size="small"
                                        disabled={formData.useAutoRating}
                                        value={formData.manualRating || ''}
                                        onChange={(e) => setFormData({ ...formData, manualRating: parseFloat(e.target.value) })}
                                        inputProps={{ min: 0, max: 5, step: 0.1 }}
                                    />
                                </Stack>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <ShoppingCart color="secondary" fontSize="small" />
                                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Distribution Tags</Typography>
                                    </Stack>
                                    <FormControlLabel
                                        control={<Switch checked={formData.showDistributionTags} onChange={(e) => setFormData({ ...formData, showDistributionTags: e.target.checked })} />}
                                        label={<Typography variant="body2">Show in Lists</Typography>}
                                    />
                                </Box>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Distribution Tags</InputLabel>
                                    <Select
                                        multiple
                                        value={formData.distributionTags || []}
                                        onChange={(e) => setFormData({ ...formData, distributionTags: e.target.value as string[] })}
                                        renderValue={(selected) => (
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                {(selected as string[]).map((val) => {
                                                    const tag = availableTags.find(t => t.id === val);
                                                    return <Chip key={val} label={tag?.displayName || val} size="small" />;
                                                })}
                                            </Box>
                                        )}
                                    >
                                        {availableTags.map((tag) => (
                                            <MenuItem key={tag.id} value={tag.id}>
                                                {tag.displayName}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Paper>
                        </Grid>

                        <Grid item xs={12}>
                            <Paper variant="outlined" sx={{ p: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Timer color="error" fontSize="small" />
                                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Urgency & Countdown</Typography>
                                    </Stack>
                                    <FormControlLabel
                                        control={<Switch checked={formData.urgencyConfig?.enabled} onChange={(e) => setFormData({
                                            ...formData,
                                            urgencyConfig: { ...(formData.urgencyConfig || {}), enabled: e.target.checked } as any
                                        })} />}
                                        label={<Typography variant="body2">Enable Urgency</Typography>}
                                    />
                                </Box>

                                {formData.urgencyConfig?.enabled && (
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={4}>
                                            <FormControl fullWidth size="small">
                                                <InputLabel>Type</InputLabel>
                                                <Select
                                                    value={formData.urgencyConfig?.type}
                                                    onChange={(e) => setFormData({
                                                        ...formData,
                                                        urgencyConfig: { ...(formData.urgencyConfig || {}), type: e.target.value } as any
                                                    })}
                                                >
                                                    <MenuItem value="COUNTDOWN">Live Countdown</MenuItem>
                                                    <MenuItem value="STATIC">Static Message</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>

                                        {formData.urgencyConfig?.type === 'COUNTDOWN' ? (
                                            <>
                                                <Grid item xs={12} sm={4}>
                                                    <TextField
                                                        fullWidth label="Hours" type="number" size="small"
                                                        value={formData.urgencyConfig?.countdownHours || 0}
                                                        onChange={(e) => setFormData({
                                                            ...formData,
                                                            urgencyConfig: { ...(formData.urgencyConfig || {}), countdownHours: parseInt(e.target.value) } as any
                                                        })}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={4}>
                                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                                        <Button size="small" variant="outlined" onClick={() => setFormData({
                                                            ...formData,
                                                            urgencyConfig: { ...(formData.urgencyConfig || {}), countdownHours: 24 } as any
                                                        })}>24h</Button>
                                                        <Button size="small" variant="outlined" onClick={() => setFormData({
                                                            ...formData,
                                                            urgencyConfig: { ...(formData.urgencyConfig || {}), countdownHours: 42 } as any
                                                        })}>42h</Button>
                                                    </Box>
                                                </Grid>
                                            </>
                                        ) : (
                                            <Grid item xs={12} sm={8}>
                                                <TextField
                                                    fullWidth label="Static Urgency Message" size="small"
                                                    placeholder="e.g. Get this now within 30 minutes"
                                                    value={formData.urgencyConfig?.staticMessage || ''}
                                                    onChange={(e) => setFormData({
                                                        ...formData,
                                                        urgencyConfig: { ...(formData.urgencyConfig || {}), staticMessage: e.target.value } as any
                                                    })}
                                                />
                                            </Grid>
                                        )}

                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth label="Message Template" size="small"
                                                helperText="Use {{time}} as placeholder for countdown"
                                                value={formData.urgencyConfig?.messageTemplate || ''}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    urgencyConfig: { ...(formData.urgencyConfig || {}), messageTemplate: e.target.value } as any
                                                })}
                                            />
                                        </Grid>
                                    </Grid>
                                )}
                            </Paper>
                        </Grid>
                    </Grid>
                )}

                {activeTab === 2 && (
                    <MultiImageUploader
                        images={formData.images?.map((i: any) => i.url) || []}
                        onChange={(urls) => setFormData({
                            ...formData,
                            images: urls.map((url, i) => ({ id: `img-${i}`, url, order: i })),
                            image: urls[0] || ''
                        })}
                    />
                )}

                {activeTab === 3 && (
                    <Box>
                        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                Product Variants
                            </Typography>
                            <Button startIcon={<Add />} onClick={handleAddVariant} size="small">
                                Add Variant
                            </Button>
                        </Box>

                        {(formData.variants || []).length === 0 ? (
                            <Paper variant="outlined" sx={{ p: 4, textAlign: 'center', bgcolor: 'grey.50' }}>
                                <Typography color="text.secondary">No variants added yet.</Typography>
                            </Paper>
                        ) : (
                            <Stack spacing={2}>
                                {(formData.variants || []).map((v: any) => (
                                    <Paper key={v.id} variant="outlined" sx={{ p: 2 }}>
                                        <Grid container spacing={2} alignItems="center">
                                            <Grid item xs={12} sm={4}>
                                                <TextField
                                                    fullWidth label="SKU" size="small"
                                                    value={v.sku}
                                                    onChange={(e) => handleVariantChange(v.id, 'sku', e.target.value)}
                                                />
                                            </Grid>
                                            <Grid item xs={6} sm={3}>
                                                <TextField
                                                    fullWidth label="Price ($)" size="small" type="number"
                                                    value={v.price === 0 ? '' : v.price}
                                                    onChange={(e) => {
                                                        const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                                                        handleVariantChange(v.id, 'price', isNaN(val) ? 0 : val);
                                                    }}
                                                    InputProps={{
                                                        startAdornment: <Typography variant="body2" sx={{ mr: 1, color: 'text.secondary' }}>$</Typography>
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={6} sm={3}>
                                                <TextField
                                                    fullWidth label="Stock" size="small" type="number"
                                                    value={v.stock}
                                                    onChange={(e) => handleVariantChange(v.id, 'stock', parseInt(e.target.value))}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={2} sx={{ textAlign: 'right' }}>
                                                <IconButton color="error" onClick={() => handleRemoveVariant(v.id)}>
                                                    <Delete fontSize="small" />
                                                </IconButton>
                                            </Grid>

                                            {/* Variant Attributes */}
                                            {selectedType && selectedType.attributes.length > 0 && (
                                                <Grid item xs={12}>
                                                    <Divider sx={{ my: 1, borderStyle: 'dashed' }} />
                                                    <Grid container spacing={1}>
                                                        {selectedType.attributes.map((attr: any) => {
                                                            const attrValue = v.attributes?.find((a: any) => a.attributeId === attr.id)?.value || '';
                                                            return (
                                                                <Grid item xs={12} sm={4} key={attr.id}>
                                                                    <TextField
                                                                        fullWidth
                                                                        label={attr.name}
                                                                        size="small"
                                                                        value={attrValue}
                                                                        onChange={(e) => {
                                                                            const newAttrs = [...(v.attributes || [])];
                                                                            const index = newAttrs.findIndex(a => a.attributeId === attr.id);
                                                                            if (index >= 0) {
                                                                                newAttrs[index] = { ...newAttrs[index], value: e.target.value };
                                                                            } else {
                                                                                newAttrs.push({
                                                                                    id: `new-attr-${Date.now()}`,
                                                                                    attributeId: attr.id,
                                                                                    attribute: attr,
                                                                                    value: e.target.value
                                                                                });
                                                                            }
                                                                            handleVariantChange(v.id, 'attributes', newAttrs);
                                                                        }}
                                                                        placeholder={`Enter ${attr.name}`}
                                                                    />
                                                                </Grid>
                                                            );
                                                        })}
                                                    </Grid>
                                                </Grid>
                                            )}
                                        </Grid>
                                    </Paper>
                                ))}
                            </Stack>
                        )}
                    </Box>
                )}
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    variant="contained"
                    onClick={() => onSave(formData as Product)}
                    disabled={!formData.title || !formData.storeId || (!formData.image && (!formData.images || formData.images.length === 0))}
                >
                    Save Product
                </Button>
            </DialogActions>
            <AiLensPanel 
                open={lensOpen}
                onClose={() => setLensOpen(false)}
                provider={lensProvider}
                currentImage={formData.image}
                onAccept={handleAiLensAccept}
            />
        </Dialog>
    );
}
