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
    MenuItem,
    Grid,
    Switch,
    FormControlLabel,
    Stack,
    alpha
} from '@mui/material';
import { Add, Search, FilterList, Refresh, MoreVert, ToggleOn, ToggleOff, Delete, Edit, CloudUpload } from '@mui/icons-material';
import { useDashboard } from '@/context/DashboardContext';
import { AdminTable } from './AdminTable';
import { Product } from '@/types/product';
import { ProductModal } from './ProductModal';
import { CsvImportModal } from './CsvImportModal';
import { ProductCard } from './ProductCard';
import { ViewHeadline, ViewModule, Bolt } from '@mui/icons-material';
import { AiLensPanel } from './AiLensPanel';

export function ProductsView() {
    const { products, setProducts, stores, categories, saveProduct, deleteProduct, bulkImportProducts, refreshData } = useDashboard();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [open, setOpen] = useState(false);
    const [editProduct, setEditProduct] = useState<Partial<Product> | null>(null);
    const [csvOpen, setCsvOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid');
    const [quickFillMode, setQuickFillMode] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [lensOpen, setLensOpen] = useState(false);
    const [lensProvider, setLensProvider] = useState<'google' | 'lumin'>('google');
    const [targetProduct, setTargetProduct] = useState<Product | null>(null);

    const handleOpen = (product: Product | null = null) => {
        setEditProduct(product || {
            title: '',
            price: 0,
            image: 'https://placehold.co/600x600?text=New+Product',
            storeId: stores.find(s => s.slug === 'dalab')?.id || '',
            categoryId: categories[0]?.id || '',
            status: 'ACTIVE',
            description: '',
            variants: [],
            images: [],
        });
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditProduct(null);
    };

    const handleSave = async (product: Product) => {
        try {
            const res = await saveProduct(product);
            if (res.ok) {
                alert('Product saved successfully!');
                handleClose();
            } else {
                const data = await res.json();
                const details = data.details ? ` (${JSON.stringify(data.details)})` : '';
                alert(`Error saving product: ${data.error || 'Unknown error'}${details}`);
            }
        } catch (error: any) {
            alert(`Network error: ${error.message}`);
        }
    };

    const handleCsvImport = async () => {
        await refreshData();
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            await deleteProduct(id);
        }
    };

    const toggleStatus = async (product: Product) => {
        const newStatus = product.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
        await saveProduct({ ...product, status: newStatus as any });
    };

    const handleAiLensClick = (product: Product, provider: 'google' | 'lumin') => {
        setTargetProduct(product);
        setLensProvider(provider);
        setLensOpen(true);
    };

    const handleAiLensAccept = async (result: any) => {
        if (!targetProduct) return;
        
        const updatedProduct = {
            ...targetProduct,
            title: result.name || targetProduct.title,
            price: result.price || targetProduct.price,
            description: result.description || targetProduct.description,
            image: result.image || targetProduct.image,
        };
        
        await saveProduct(updatedProduct as any);
        setLensOpen(false);
        setTargetProduct(null);
    };

    const columns = [
        { id: 'image', label: '', minWidth: 60, format: (val: string) => <img src={val} alt="" style={{ width: 40, height: 40, borderRadius: 4, objectFit: 'contain' }} /> },
        { id: 'title', label: 'Product Name', minWidth: 200 },
        {
            id: 'categoryId',
            label: 'Category',
            minWidth: 120,
            format: (val: string) => {
                const cat = categories.find(c => c.id === val);
                return cat ? <Chip label={cat.name} size="small" variant="outlined" /> : '-';
            }
        },
        { id: 'store', label: 'Store', minWidth: 100, format: (val: string) => <Chip label={val} size="small" /> },
        { id: 'price', label: 'Price', minWidth: 100, format: (val: number) => `$${val.toLocaleString()}` },
        {
            id: 'status',
            label: 'Status',
            minWidth: 100,
            format: (val: string, row: Product) => (
                <Switch checked={val === 'ACTIVE'} onChange={() => toggleStatus(row)} size="small" />
            )
        },
        {
            id: 'actions',
            label: 'Actions',
            minWidth: 120,
            align: 'right',
            format: (_: any, row: Product) => (
                <Box>
                    <IconButton size="small" onClick={() => handleOpen(row)}><Edit fontSize="inherit" /></IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDelete(row.id)}><Delete fontSize="inherit" /></IconButton>
                </Box>
            )
        }
    ];

    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    const filteredProducts = products.filter(product => {
        const matchesCategory = selectedCategory === 'all' || product.categoryId === selectedCategory;
        const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const handleDuplicate = (product: Product) => {
        const newProduct = {
            ...product,
            id: `copy-${Date.now()}`,
            title: `${product.title} (Copy)`,
            status: 'INACTIVE'
        };
        saveProduct(newProduct as any);
    };

    return (
        <Box>
                <Stack direction="row" spacing={2} alignItems="center">
                    <TextField
                        size="small"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        InputProps={{
                            startAdornment: <Search sx={{ color: 'text.disabled', mr: 1, fontSize: 20 }} />
                        }}
                        sx={{ minWidth: 250 }}
                    />
                    <TextField
                        select
                        size="small"
                        label="Category"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        sx={{ minWidth: 150 }}
                    >
                        <MenuItem value="all">All Categories</MenuItem>
                        {categories.map((cat) => (
                            <MenuItem key={cat.id} value={cat.id}>
                                {cat.name}
                            </MenuItem>
                        ))}
                    </TextField>

                    <Box sx={{ bgcolor: 'grey.100', p: 0.5, borderRadius: 2, display: 'flex' }}>
                        <IconButton 
                            size="small" 
                            onClick={() => setViewMode('table')}
                            color={viewMode === 'table' ? 'primary' : 'default'}
                            sx={{ bgcolor: viewMode === 'table' ? 'white' : 'transparent', borderRadius: 1.5, '&:hover': { bgcolor: viewMode === 'table' ? 'white' : alpha('#fff', 0.5) } }}
                        >
                            <ViewHeadline fontSize="small" />
                        </IconButton>
                        <IconButton 
                            size="small" 
                            onClick={() => setViewMode('grid')}
                            color={viewMode === 'grid' ? 'primary' : 'default'}
                            sx={{ bgcolor: viewMode === 'grid' ? 'white' : 'transparent', borderRadius: 1.5, '&:hover': { bgcolor: viewMode === 'grid' ? 'white' : alpha('#fff', 0.5) } }}
                        >
                            <ViewModule fontSize="small" />
                        </IconButton>
                    </Box>

                    <Button
                        variant={quickFillMode ? "contained" : "outlined"}
                        color={quickFillMode ? "secondary" : "inherit"}
                        startIcon={<Bolt />}
                        onClick={() => setQuickFillMode(!quickFillMode)}
                        sx={{ borderRadius: 2 }}
                    >
                        Quick Fill
                    </Button>

                    <Button
                        variant="outlined"
                        startIcon={<CloudUpload />}
                        onClick={() => setCsvOpen(true)}
                        sx={{ borderRadius: 2 }}
                    >
                        Import
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => handleOpen()}
                        sx={{ borderRadius: 2, px: 3 }}
                    >
                        New Product
                    </Button>
                </Stack>

            {viewMode === 'table' ? (
                <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid', borderColor: 'grey.100' }}>
                    <AdminTable
                        columns={columns as any}
                        rows={filteredProducts}
                        count={filteredProducts.length}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        onPageChange={(_, p) => setPage(p)}
                        onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
                    />
                </Paper>
            ) : (
                <Grid container spacing={3}>
                    {filteredProducts.map((product) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} xl={2.4} key={product.id}>
                            <ProductCard 
                                product={product}
                                categories={categories}
                                onEdit={handleOpen}
                                onDelete={handleDelete}
                                onDuplicate={handleDuplicate}
                                quickFillMode={quickFillMode}
                                onAiLens={handleAiLensClick}
                            />
                        </Grid>
                    ))}
                    {filteredProducts.length === 0 && (
                        <Grid item xs={12}>
                            <Paper sx={{ p: 8, textAlign: 'center', borderRadius: 3, bgcolor: 'grey.50', border: '1px dashed', borderColor: 'grey.300' }}>
                                <Typography color="text.secondary">No products found matching your criteria</Typography>
                            </Paper>
                        </Grid>
                    )}
                </Grid>
            )}

            <ProductModal
                open={open}
                onClose={handleClose}
                product={editProduct}
                onSave={handleSave}
            />

            <CsvImportModal
                open={csvOpen}
                onClose={() => setCsvOpen(false)}
                onImportSuccess={handleCsvImport}
            />

            <AiLensPanel
                open={lensOpen}
                onClose={() => setLensOpen(false)}
                provider={lensProvider}
                currentImage={targetProduct?.image}
                onAccept={handleAiLensAccept}
            />
        </Box>
    );
}

