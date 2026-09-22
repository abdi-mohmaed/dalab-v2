'use client';

import React, { useState, useCallback } from 'react';
import {
    Box,
    Typography,
    IconButton,
    Grid,
    Paper,
    Button,
    CircularProgress,
} from '@mui/material';
import {
    CloudUpload,
    Delete,
    DragIndicator,
} from '@mui/icons-material';

interface ImageUploaderProps {
    images: string[];
    onChange: (images: string[]) => void;
    folder?: string;
}

export function MultiImageUploader({ images, onChange, folder = 'products' }: ImageUploaderProps) {
    const [dragOver, setDragOver] = useState(false);
    const [uploadingIndices, setUploadingIndices] = useState<number[]>([]);

    const uploadFile = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            return data.url;
        } catch (error) {
            console.error('Upload Error:', error);
            return null;
        }
    };

    const handleFiles = async (files: File[]) => {
        // Start showing loading states for new slots
        const startIndex = images.length;
        const newUploadingIndices = files.map((_, i) => startIndex + i);
        setUploadingIndices(prev => [...prev, ...newUploadingIndices]);

        const uploadPromises = files.map(file => uploadFile(file));
        const uploadedUrls = await Promise.all(uploadPromises);

        const validUrls = uploadedUrls.filter(url => url !== null);
        onChange([...images, ...validUrls]);

        // Remove from uploading states
        setUploadingIndices(prev => prev.filter(i => !newUploadingIndices.includes(i)));
    };

    const onDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
        handleFiles(files);
    }, [images, onChange]);

    const handleRemove = (index: number) => {
        const newImages = images.filter((_, i) => i !== index);
        onChange(newImages);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files).filter(f => f.type.startsWith('image/'));
            handleFiles(files);
        }
    };

    return (
        <Box>
            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                Product Images
            </Typography>

            <Grid container spacing={2}>
                {images.map((url, index) => (
                    <Grid item xs={4} sm={3} key={index}>
                        <Paper
                            sx={{
                                position: 'relative',
                                pt: '100%',
                                borderRadius: 2,
                                overflow: 'hidden',
                                border: '1px solid',
                                borderColor: 'divider',
                            }}
                        >
                            <Box
                                component="img"
                                src={url}
                                sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                }}
                            />
                            <IconButton
                                size="small"
                                sx={{
                                    position: 'absolute',
                                    top: 4,
                                    right: 4,
                                    bgcolor: 'rgba(255,255,255,0.8)',
                                    '&:hover': { bgcolor: 'white' }
                                }}
                                onClick={() => handleRemove(index)}
                            >
                                <Delete fontSize="small" color="error" />
                            </IconButton>
                        </Paper>
                    </Grid>
                ))}

                {uploadingIndices.map((idx) => (
                    <Grid item xs={4} sm={3} key={`uploading-${idx}`}>
                        <Paper
                            sx={{
                                position: 'relative',
                                pt: '100%',
                                borderRadius: 2,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                bgcolor: '#fafafa',
                                border: '1px solid #eee'
                            }}
                        >
                            <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <CircularProgress size={24} sx={{ color: '#FFC644' }} />
                            </Box>
                        </Paper>
                    </Grid>
                ))}

                <Grid item xs={4} sm={3}>
                    <Button
                        component="label"
                        sx={{
                            width: '100%',
                            pt: '100%',
                            position: 'relative',
                            border: '2px dashed',
                            borderColor: dragOver ? '#FFC644' : 'divider',
                            borderRadius: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            bgcolor: dragOver ? 'rgba(255, 198, 68, 0.05)' : 'transparent',
                            '&:hover': { borderColor: '#FFC644', bgcolor: 'rgba(255, 198, 68, 0.05)' }
                        }}
                        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={onDrop}
                    >
                        <Box
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <CloudUpload color="primary" sx={{ mb: 1, color: '#FFC644' }} />
                            <Typography variant="caption" color="text.secondary">
                                Upload
                            </Typography>
                        </Box>
                        <input
                            type="file"
                            multiple
                            hidden
                            accept="image/*"
                            onChange={handleFileSelect}
                        />
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
}
