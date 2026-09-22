'use client';

import React, { useState, useRef } from 'react';
import {
    Box,
    Typography,
    Button,
    CircularProgress,
    IconButton,
    Paper,
    Alert
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import ImageIcon from '@mui/icons-material/Image';

interface BannerUploaderProps {
    onUploadSuccess: (url: string, type: 'image' | 'video') => void;
    currentUrl?: string;
    currentType?: 'image' | 'video';
    label?: string;
}

export function BannerUploader({ onUploadSuccess, currentUrl, currentType = 'image', label = "Upload Banner" }: BannerUploaderProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(currentUrl || null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setError(null);
        setIsUploading(true);

        // Determine type
        const type = file.type.startsWith('video/') ? 'video' : 'image';

        // Local preview
        const localPreview = URL.createObjectURL(file);
        setPreview(localPreview);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'banners');

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            const data = await res.json();
            if (res.ok && data.url) {
                setPreview(data.url);
                onUploadSuccess(data.url, type);
            } else {
                setError(data.error || 'Upload failed');
                setPreview(currentUrl || null); // Revert
            }
        } catch (error) {
            console.error('Upload Error:', error);
            setError('Upload failed due to connection error');
            setPreview(currentUrl || null); // Revert
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemove = () => {
        setPreview(null);
        onUploadSuccess('', 'image'); // Reset
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <Box sx={{ width: '100%' }}>
            {label && (
                <Typography variant="caption" sx={{ mb: 1, fontWeight: 600, color: 'text.secondary', display: 'block' }}>
                    {label}
                </Typography>
            )}

            <Paper
                variant="outlined"
                sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 120,
                    position: 'relative',
                    bgcolor: '#fafafa',
                    borderStyle: 'dashed',
                    borderColor: error ? 'error.main' : 'divider',
                    '&:hover': {
                        borderColor: error ? 'error.main' : 'primary.main',
                        bgcolor: '#fff'
                    }
                }}
            >
                {preview ? (
                    <Box sx={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 100 }}>
                        {currentType === 'video' || (preview && preview.endsWith('.mp4')) || (preview && preview.endsWith('.webm')) ? (
                            <video
                                src={preview}
                                autoPlay
                                loop
                                muted
                                playsInline
                                style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 8 }}
                            />
                        ) : (
                            <img
                                src={preview}
                                alt="Banner Preview"
                                style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 8, objectFit: 'contain' }}
                            />
                        )}

                        {isUploading && (
                            <Box sx={{
                                position: 'absolute',
                                top: 0, left: 0, right: 0, bottom: 0,
                                bgcolor: 'rgba(255,255,255,0.7)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 1
                            }}>
                                <CircularProgress size={32} />
                            </Box>
                        )}

                        {!isUploading && (
                            <IconButton
                                size="small"
                                onClick={handleRemove}
                                sx={{
                                    position: 'absolute',
                                    top: -10,
                                    right: -10,
                                    bgcolor: 'background.paper',
                                    boxShadow: 1,
                                    '&:hover': { bgcolor: '#f5f5f5' }
                                }}
                            >
                                <DeleteIcon fontSize="small" color="error" />
                            </IconButton>
                        )}

                        {!isUploading && !error && (
                            <CheckCircleIcon color="success" sx={{ position: 'absolute', top: -10, left: -10, bgcolor: 'white', borderRadius: '50%' }} />
                        )}
                    </Box>
                ) : (
                    <Box sx={{ textAlign: 'center' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 1, color: 'text.disabled' }}>
                            <ImageIcon fontSize="large" />
                            <VideoLibraryIcon fontSize="large" />
                        </Box>
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                        >
                            Select Image or Video
                        </Button>
                        <Typography variant="caption" display="block" color="text.disabled" sx={{ mt: 1 }}>
                            Max 10MB
                        </Typography>
                    </Box>
                )}

                <input
                    type="file"
                    hidden
                    ref={fileInputRef}
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                />
            </Paper>
            {error && (
                <Alert severity="error" sx={{ mt: 1, py: 0 }}>{error}</Alert>
            )}
        </Box>
    );
}
