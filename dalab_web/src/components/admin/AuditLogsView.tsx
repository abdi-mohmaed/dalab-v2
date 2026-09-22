'use client';

import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress,
    IconButton,
    Collapse
} from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';

function Row({ row }: { row: any }) {
    const [open, setOpen] = useState(false);

    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <IconButton size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    {new Date(row.createdAt).toLocaleString()}
                </TableCell>
                <TableCell>{row.action}</TableCell>
                <TableCell>{row.entityType}</TableCell>
                <TableCell>{row.entityId.substring(0, 8)}...</TableCell>
                <TableCell>{row.userId ? row.userId.substring(0, 8) + '...' : 'System'}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div" sx={{ fontSize: '0.9rem' }}>
                                Details
                            </Typography>
                            {row.newData && (
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2" color="success.main">New Data:</Typography>
                                    <pre style={{ fontSize: '0.75rem', background: '#f5f5f5', padding: '8px', borderRadius: '4px' }}>
                                        {JSON.stringify(row.newData, null, 2)}
                                    </pre>
                                </Box>
                            )}
                            {row.oldData && (
                                <Box>
                                    <Typography variant="subtitle2" color="error.main">Old Data:</Typography>
                                    <pre style={{ fontSize: '0.75rem', background: '#f5f5f5', padding: '8px', borderRadius: '4px' }}>
                                        {JSON.stringify(row.oldData, null, 2)}
                                    </pre>
                                </Box>
                            )}
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

export function AuditLogsView() {
    const [logs, setLogs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchLogs = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/audit-logs');
            const data = await res.json();
            if (data.logs) {
                setLogs(data.logs);
            }
        } catch (err) {
            console.error('Failed to fetch logs', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    return (
        <Box>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>Audit Logs</Typography>
            </Box>

            <TableContainer component={Paper} sx={{ boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: 2 }}>
                <Table aria-label="collapsible table">
                    <TableHead sx={{ bgcolor: '#f8f9fa' }}>
                        <TableRow>
                            <TableCell />
                            <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Action</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Entity Type</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Entity ID</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>User</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                                    <CircularProgress />
                                </TableCell>
                            </TableRow>
                        ) : logs.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                                    <Typography color="text.secondary">No logs found.</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            logs.map((row) => (
                                <Row key={row.id} row={row} />
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
