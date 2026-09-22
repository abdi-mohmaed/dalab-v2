'use client';

import React, { useState, useRef } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Paper,
    CircularProgress,
    Stack,
    Alert,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Step,
    StepLabel,
    Stepper
} from '@mui/material';
import { CloudUpload, CheckCircle, Warning } from '@mui/icons-material';
import { Product } from '@/types/product';
import { useDashboard } from '@/context/DashboardContext';
import { parseExcelFile, ParseResult } from '@/utils/excelParser';


interface CsvImportModalProps {
    open: boolean;
    onClose: () => void;
    onImportSuccess: (products: Product[]) => void;
}

export function CsvImportModal({ open, onClose, onImportSuccess }: CsvImportModalProps) {
    const { stores, categories } = useDashboard();
    const [activeStep, setActiveStep] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [processingStatus, setProcessingStatus] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [parseResult, setParseResult] = useState<ParseResult | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const steps = ['Upload Excel', 'Analyze & Validate', 'Import Results'];


    const [isDragging, setIsDragging] = useState(false);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement> | File) => {
        const file = 'target' in e ? e.target.files?.[0] : e;
        if (!file) return;

        setIsProcessing(true);
        setError(null);

        try {
            const result = await parseExcelFile(file);
            if (result.products.length === 0) {
                setError('The file appears to be empty or has no recognizable data.');
                setIsProcessing(false);
                return;
            }
            setParseResult(result);
            setActiveStep(1); // Move to Analysis step
        } catch (err: any) {
            setError(`Failed to read file: ${err.message}`);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFileSelect(file);
    };



    const [importResults, setImportResults] = useState<{ success: number; failed: number; errors?: any[] } | null>(null);

    const handleImport = async () => {
        if (!parseResult) return;
        setIsProcessing(true);
        setError(null);

        try {
            const res = await fetch('/api/admin/products/bulk', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(parseResult.products)
            });

            const data = await res.json();

            if (res.ok && data.success) {
                setImportResults({
                    success: data.count,
                    failed: data.errors?.length || 0,
                    errors: data.errors
                });

                await onImportSuccess(data.results);
                setActiveStep(2); // Moved to results step

                if (!data.errors || data.errors.length === 0) {
                    setTimeout(() => {
                        handleClose();
                    }, 3000);
                }
            } else {
                setError(data.error || 'Failed to complete import process.');
            }
        } catch (err: any) {
            setError(`Error during import submission: ${err.message}`);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleClose = () => {
        onClose();
        // Reset state after a delay to avoid UI flickering while closing
        setTimeout(() => {
            setActiveStep(0);
            setParseResult(null);
            setError(null);
            setIsProcessing(false);
        }, 300);
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
            <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
                Bulk Import Products
            </DialogTitle>

            <Box sx={{ width: '100%', px: 3, mb: 2 }}>
                <Stepper activeStep={activeStep}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Box>

            <DialogContent sx={{ minHeight: 400 }}>
                {/* STEP 0: UPLOAD */}
                {activeStep === 0 && (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            Upload an Excel file (.xlsx, .xls) containing your product data.
                        </Typography>
                        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                        <Paper
                            variant="outlined"
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            sx={{
                                p: 6, textAlign: 'center', border: '2px dashed',
                                borderColor: isDragging ? 'primary.main' : 'divider',
                                bgcolor: isDragging ? 'primary.50' : 'grey.50',
                                borderRadius: 3, cursor: 'pointer',
                                transition: 'all 0.2s',
                                '&:hover': { borderColor: 'primary.main', bgcolor: 'primary.50' }
                            }}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input accept=".xlsx, .xls, .csv" style={{ display: 'none' }} type="file" ref={fileInputRef} onChange={handleFileSelect} />
                            {isProcessing ? <CircularProgress /> : (
                                <>
                                    <CloudUpload sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                                    <Typography variant="h6">
                                        {isDragging ? 'Drop file here' : 'Click or Drag & Drop to Upload Excel File'}
                                    </Typography>
                                </>
                            )}
                        </Paper>
                    </Box>
                )}



                {/* STEP 1: ANALYSIS */}
                {activeStep === 1 && parseResult && (
                    <Box sx={{ mt: 1 }}>
                        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                            <Alert severity="info" sx={{ flexGrow: 1 }}>
                                Found <strong>{parseResult.products.length}</strong> products ready to import.
                            </Alert>
                        </Stack>

                        <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 400 }}>
                            <Table stickyHeader size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Preview</TableCell>
                                        <TableCell>Title</TableCell>
                                        <TableCell>Price (USD)</TableCell>
                                        <TableCell>Category</TableCell>
                                        <TableCell>Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {parseResult.products.slice(0, 50).map((p: any, i) => (
                                        <TableRow key={i} hover sx={{ bgcolor: p.isDuplicate ? 'warning.50' : 'inherit' }}>
                                            <TableCell>
                                                <img src={p.image} alt="" style={{ width: 40, height: 40, borderRadius: 4, objectFit: 'cover' }} />
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" sx={{ fontWeight: p.isDuplicate ? 700 : 400 }}>
                                                    {p.title}
                                                    {p.isDuplicate && <Chip label="Duplicate" size="small" color="warning" sx={{ ml: 1, height: 20 }} />}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>${p.price || p.price_usd}</TableCell>
                                            <TableCell><Chip label={p.categoryName || p.category || 'Uncategorized'} size="small" /></TableCell>
                                            <TableCell><Chip label={p.status || 'ACTIVE'} size="small" color="success" variant="outlined" /></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                )}


                {/* STEP 2: COMPLETION / RESULTS */}
                {activeStep === 2 && (
                    <Box sx={{ py: 2 }}>
                        <Box sx={{ textAlign: 'center', mb: 4 }}>
                            <CheckCircle color="success" sx={{ fontSize: 64, mb: 2 }} />
                            <Typography variant="h5" gutterBottom>Import Complete</Typography>
                            <Typography color="text.secondary">
                                Successfully imported <strong>{importResults?.success || 0}</strong> products.
                            </Typography>
                        </Box>

                        {importResults?.errors && importResults.errors.length > 0 && (
                            <Box sx={{ mt: 3 }}>
                                <Typography variant="subtitle2" color="error" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Warning fontSize="small" />
                                    {importResults.errors.length} products failed to import:
                                </Typography>
                                <Paper variant="outlined" sx={{ maxHeight: 200, overflow: 'auto', p: 1, bgcolor: 'error.50' }}>
                                    {importResults.errors.slice(0, 50).map((err, idx) => (
                                        <Typography key={idx} variant="caption" display="block" color="error.dark" sx={{ mb: 0.5 }}>
                                            • <strong>{err.title}</strong>: {err.error}
                                        </Typography>
                                    ))}
                                    {importResults.errors.length > 50 && (
                                        <Typography variant="caption" color="text.secondary">...and {importResults.errors.length - 50} more errors</Typography>
                                    )}
                                </Paper>
                            </Box>
                        )}
                    </Box>
                )}

            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3, flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                        {isProcessing && (
                            <Typography variant="caption" color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <CircularProgress size={12} /> {processingStatus}
                            </Typography>
                        )}
                    </Box>
                    <Box>
                        <Button onClick={handleClose} disabled={isProcessing} sx={{ mr: 1 }}>
                            Cancel
                        </Button>


                        {activeStep === 0 && (
                            <Button
                                variant="contained"
                                disabled={isProcessing || !parseResult}
                                onClick={() => setActiveStep(1)}
                            >
                                {isProcessing ? <CircularProgress size={20} /> : 'Process File'}
                            </Button>
                        )}

                        {activeStep === 1 && (
                            <Button
                                variant="contained"
                                onClick={handleImport}
                                disabled={isProcessing}
                            >
                                Confirm Import ({parseResult?.products.length})
                            </Button>
                        )}
                    </Box>
                </Box>
            </DialogActions>

        </Dialog>
    );
}

