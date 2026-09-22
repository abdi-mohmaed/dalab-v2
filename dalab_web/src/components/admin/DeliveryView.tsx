'use client';

import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Button,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Switch,
    FormControlLabel,
    Stack,
    Divider,
    Grid,
    Card,
    CardContent,
    Chip,
} from '@mui/material';
import { Add, Edit, Delete, LocationOn, MonetizationOn } from '@mui/icons-material';
import { AdminTable } from './AdminTable';

interface DeliveryZone {
    id: string;
    name: string;
    active: boolean;
    rules: DeliveryFeeRule[];
}

interface DeliveryFeeRule {
    id: string;
    zoneId: string;
    minOrderAmount: number;
    fee: number;
    active: boolean;
}

export function DeliveryView() {
    const [zones, setZones] = useState<DeliveryZone[]>([]);
    const [openZone, setOpenZone] = useState(false);
    const [openRule, setOpenRule] = useState(false);
    const [editZone, setEditZone] = useState<Partial<DeliveryZone> | null>(null);
    const [editRule, setEditRule] = useState<Partial<DeliveryFeeRule> | null>(null);

    // Mock initial data - in real app, fetch from API
    useEffect(() => {
        setZones([
            {
                id: '1',
                name: 'Downtown',
                active: true,
                rules: [
                    { id: 'r1', zoneId: '1', minOrderAmount: 0, fee: 5.0, active: true },
                    { id: 'r2', zoneId: '1', minOrderAmount: 50, fee: 0, active: true },
                ]
            },
            {
                id: '2',
                name: 'Suburbs',
                active: true,
                rules: [
                    { id: 'r3', zoneId: '2', minOrderAmount: 0, fee: 10.0, active: true },
                ]
            }
        ]);
    }, []);

    const handleSaveZone = () => {
        if (editZone?.id) {
            setZones(prev => prev.map(z => z.id === editZone.id ? { ...z, ...editZone } as DeliveryZone : z));
        } else {
            const newZone = { ...editZone, id: `z-${Date.now()}`, rules: [], active: true } as DeliveryZone;
            setZones(prev => [...prev, newZone]);
        }
        setOpenZone(false);
    };

    const handleSaveRule = () => {
        if (editRule?.id) {
            setZones(prev => prev.map(z => {
                if (z.id === editRule.zoneId) {
                    return { ...z, rules: z.rules.map(r => r.id === editRule.id ? { ...r, ...editRule } as DeliveryFeeRule : r) };
                }
                return z;
            }));
        } else {
            const newRule = { ...editRule, id: `r-${Date.now()}`, active: true } as DeliveryFeeRule;
            setZones(prev => prev.map(z => {
                if (z.id === newRule.zoneId) {
                    return { ...z, rules: [...z.rules, newRule] };
                }
                return z;
            }));
        }
        setOpenRule(false);
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>Delivery Configuration</Typography>
                <Button variant="contained" startIcon={<Add />} onClick={() => { setEditZone({ name: '' }); setOpenZone(true); }}>
                    Add Delivery Zone
                </Button>
            </Box>

            <Grid container spacing={3}>
                {zones.map((zone) => (
                    <Grid item xs={12} md={6} key={zone.id}>
                        <Card sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid #f0f0f0' }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <LocationOn color="primary" />
                                        <Typography variant="h6" sx={{ fontWeight: 700 }}>{zone.name}</Typography>
                                        <Chip
                                            label={zone.active ? "Active" : "Inactive"}
                                            size="small"
                                            color={zone.active ? "success" : "default"}
                                            variant="outlined"
                                        />
                                    </Stack>
                                    <Box>
                                        <IconButton size="small" onClick={() => { setEditZone(zone); setOpenZone(true); }}><Edit fontSize="small" /></IconButton>
                                        <IconButton size="small" color="error"><Delete fontSize="small" /></IconButton>
                                    </Box>
                                </Box>

                                <Divider sx={{ mb: 2 }} />

                                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'text.secondary' }}>Fee Rules</Typography>
                                <Stack spacing={1}>
                                    {zone.rules.map(rule => (
                                        <Box key={rule.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, bgcolor: '#f9f9f9', borderRadius: 1 }}>
                                            <Typography variant="body2">
                                                Orders over <strong>${rule.minOrderAmount}</strong>: <strong>${rule.fee}</strong> fee
                                            </Typography>
                                            <Box>
                                                <IconButton size="small" onClick={() => { setEditRule(rule); setOpenRule(true); }}><Edit sx={{ fontSize: 16 }} /></IconButton>
                                                <IconButton size="small" color="error"><Delete sx={{ fontSize: 16 }} /></IconButton>
                                            </Box>
                                        </Box>
                                    ))}
                                    <Button
                                        size="small"
                                        startIcon={<Add />}
                                        sx={{ alignSelf: 'flex-start', mt: 1 }}
                                        onClick={() => { setEditRule({ zoneId: zone.id, minOrderAmount: 0, fee: 0 }); setOpenRule(true); }}
                                    >
                                        Add Rule
                                    </Button>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Zone Dialog */}
            <Dialog open={openZone} onClose={() => setOpenZone(false)} fullWidth maxWidth="xs">
                <DialogTitle>{editZone?.id ? 'Edit Zone' : 'Add Zone'}</DialogTitle>
                <DialogContent dividers>
                    <TextField
                        fullWidth
                        label="Zone Name"
                        margin="normal"
                        value={editZone?.name || ''}
                        onChange={(e) => setEditZone({ ...editZone!, name: e.target.value })}
                    />
                    <FormControlLabel
                        control={<Switch checked={editZone?.active ?? true} onChange={(e) => setEditZone({ ...editZone!, active: e.target.checked })} />}
                        label="Active"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenZone(false)}>Cancel</Button>
                    <Button onClick={handleSaveZone} variant="contained">Save</Button>
                </DialogActions>
            </Dialog>

            {/* Rule Dialog */}
            <Dialog open={openRule} onClose={() => setOpenRule(false)} fullWidth maxWidth="xs">
                <DialogTitle>Fee Rule</DialogTitle>
                <DialogContent dividers>
                    <TextField
                        fullWidth
                        label="Min Order Amount ($)"
                        type="number"
                        margin="normal"
                        value={editRule?.minOrderAmount || 0}
                        onChange={(e) => setEditRule({ ...editRule!, minOrderAmount: parseFloat(e.target.value) })}
                    />
                    <TextField
                        fullWidth
                        label="Delivery Fee ($)"
                        type="number"
                        margin="normal"
                        value={editRule?.fee || 0}
                        onChange={(e) => setEditRule({ ...editRule!, fee: parseFloat(e.target.value) })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenRule(false)}>Cancel</Button>
                    <Button onClick={handleSaveRule} variant="contained">Save</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
