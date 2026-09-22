'use client';

import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Stack,
    Alert,
} from '@mui/material';
import { Add, Edit, Delete, Label } from '@mui/icons-material';

interface Tag {
    id: string;
    name: string;
    displayName: string;
    color: string;
    icon?: string;
    _count?: {
        products: number;
    };
}

export function TagsView() {
    const [tags, setTags] = useState<Tag[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingTag, setEditingTag] = useState<Tag | null>(null);
    const [formData, setFormData] = useState<Partial<Tag>>({
        displayName: '',
        color: '#FF6B6B',
        icon: ''
    });

    const fetchTags = async () => {
        try {
            const res = await fetch('/api/admin/tags');
            const data = await res.json();
            if (Array.isArray(data)) {
                setTags(data);
            }
        } catch (err) {
            console.error('Error fetching tags:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTags();
    }, []);

    const handleOpenModal = (tag?: Tag) => {
        if (tag) {
            setEditingTag(tag);
            setFormData({
                displayName: tag.displayName,
                color: tag.color,
                icon: tag.icon || ''
            });
        } else {
            setEditingTag(null);
            setFormData({
                displayName: '',
                color: '#FF6B6B',
                icon: ''
            });
        }
        setModalOpen(true);
    };

    const handleSave = async () => {
        try {
            const url = editingTag ? `/api/admin/tags/${editingTag.id}` : '/api/admin/tags';
            const method = editingTag ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.displayName?.toLowerCase().replace(/\s+/g, '-'),
                    ...formData
                })
            });

            if (res.ok) {
                fetchTags();
                setModalOpen(false);
            }
        } catch (err) {
            console.error('Error saving tag:', err);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this tag?')) return;
        try {
            const res = await fetch(`/api/admin/tags/${id}`, { method: 'DELETE' });
            if (res.ok) fetchTags();
        } catch (err) {
            console.error('Error deleting tag:', err);
        }
    };

    return (
        <Box>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h5" fontWeight={700}>Product Tags</Typography>
                    <Typography color="text.secondary">Manage labels and badges for your products</Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => handleOpenModal()}
                >
                    Create Tag
                </Button>
            </Box>

            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
                <Table>
                    <TableHead sx={{ bgcolor: 'grey.50' }}>
                        <TableRow>
                            <TableCell>Label</TableCell>
                            <TableCell>Preview</TableCell>
                            <TableCell>Color Code</TableCell>
                            <TableCell>Products</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tags.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                                    <Label sx={{ fontSize: 40, color: 'grey.300', mb: 1 }} />
                                    <Typography color="grey.500">No tags found. Create your first tag!</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            tags.map((tag) => (
                                <TableRow key={tag.id} hover>
                                    <TableCell sx={{ fontWeight: 600 }}>{tag.displayName}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={tag.displayName}
                                            size="small"
                                            icon={tag.icon ? <span>{tag.icon}</span> : undefined}
                                            sx={{
                                                bgcolor: tag.color,
                                                color: '#fff',
                                                fontWeight: 700,
                                                '& .MuiChip-label': { px: 1.5 }
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: tag.color }} />
                                            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{tag.color}</Typography>
                                        </Stack>
                                    </TableCell>
                                    <TableCell>{tag._count?.products || 0} products</TableCell>
                                    <TableCell align="right">
                                        <IconButton size="small" onClick={() => handleOpenModal(tag)} color="primary">
                                            <Edit fontSize="small" />
                                        </IconButton>
                                        <IconButton size="small" onClick={() => handleDelete(tag.id)} color="error">
                                            <Delete fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle>{editingTag ? 'Edit Tag' : 'Create New Tag'}</DialogTitle>
                <DialogContent>
                    <Stack spacing={3} sx={{ mt: 1 }}>
                        <TextField
                            fullWidth
                            label="Display Name"
                            placeholder="e.g. Best Seller"
                            value={formData.displayName}
                            onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                        />
                        <Box>
                            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                                Tag Color
                            </Typography>
                            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
                                {['#FF6B6B', '#4CAF50', '#2196F3', '#FFD700', '#9C27B0', '#FF9800', '#3F51B5', '#000000'].map(c => (
                                    <Box
                                        key={c}
                                        onClick={() => setFormData({ ...formData, color: c })}
                                        sx={{
                                            width: 32,
                                            height: 32,
                                            borderRadius: '50%',
                                            bgcolor: c,
                                            cursor: 'pointer',
                                            border: formData.color === c ? '3px solid' : 'none',
                                            borderColor: 'primary.main',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                ))}
                            </Stack>
                            <TextField
                                fullWidth
                                label="Custom Hex Color"
                                size="small"
                                value={formData.color}
                                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                placeholder="#HEXCODE"
                            />
                        </Box>
                        <TextField
                            fullWidth
                            label="Icon (Emoji or Icon Code)"
                            placeholder="e.g. ⭐, 🔥, 🆕"
                            value={formData.icon}
                            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setModalOpen(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleSave}
                        disabled={!formData.displayName}
                    >
                        {editingTag ? 'Update Tag' : 'Create Tag'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
