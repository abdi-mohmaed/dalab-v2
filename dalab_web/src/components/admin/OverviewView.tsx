'use client';

import React from 'react';
import {
    Box,
    Grid,
    Paper,
    Typography,
    Card,
    CardContent,
    Stack,
    Divider,
} from '@mui/material';
import {
    TrendingUp,
    ShoppingCart,
    People,
    Storefront,
    FileDownload as DownloadIcon
} from '@mui/icons-material';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import { useDashboard } from '@/context/DashboardContext';
import { useState, useEffect } from 'react';

export function OverviewView() {
    const { stores, cashiers } = useDashboard();
    const [analytics, setAnalytics] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await fetch('/api/admin/analytics');
                const data = await res.json();
                if (data.stats) {
                    setAnalytics(data);
                }
            } catch (err) {
                console.error('Failed to fetch analytics', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    const handleExport = () => {
        if (!analytics) return;
        const csvContent = "data:text/csv;charset=utf-8,"
            + "Metric,Value\n"
            + `Total Revenue,${analytics.stats.revenue}\n`
            + `Total Orders,${analytics.stats.orders}\n`
            + `Total Users,${analytics.stats.customers}\n`
            + `Active Stores,${stores.length}`;

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "dashboard_metrics.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const stats = [
        {
            label: 'Total Revenue',
            value: analytics ? `$${analytics.stats.revenue.toLocaleString()}` : (isLoading ? '...' : '$0'),
            icon: <TrendingUp color="primary" />,
            color: '#e3f2fd'
        },
        {
            label: 'Total Orders',
            value: analytics ? analytics.stats.orders : (isLoading ? '...' : '0'),
            icon: <ShoppingCart color="success" />,
            color: '#e8f5e9'
        },
        {
            label: 'Total Users',
            value: analytics ? analytics.stats.customers : (isLoading ? '...' : '0'),
            icon: <People color="info" />,
            color: '#e1f5fe'
        },
        {
            label: 'Active Stores',
            value: stores.length,
            icon: <Storefront color="warning" />,
            color: '#fff3e0'
        },
    ];

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>Dashboard Overview</Typography>
                <Box
                    component="button"
                    onClick={handleExport}
                    disabled={isLoading || !analytics}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        bgcolor: 'white',
                        border: '1px solid #e0e0e0',
                        px: 2,
                        py: 1,
                        borderRadius: 2,
                        cursor: analytics ? 'pointer' : 'default',
                        opacity: analytics ? 1 : 0.5,
                        '&:hover': analytics ? { bgcolor: '#f5f5f5' } : {}
                    }}
                >
                    <DownloadIcon fontSize="small" />
                    <Typography variant="subtitle2" fontWeight={600}>Export Report</Typography>
                </Box>
            </Box>

            <Grid container spacing={3}>
                {stats.map((stat, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Paper
                            sx={{
                                p: 2,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                                borderRadius: 3,
                                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                bgcolor: 'white'
                            }}
                        >
                            <Box
                                sx={{
                                    bgcolor: stat.color,
                                    p: 1.5,
                                    borderRadius: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                {stat.icon}
                            </Box>
                            <Box>
                                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                    {stat.label}
                                </Typography>
                                <Typography variant="h5" fontWeight={700}>
                                    {stat.value}
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', minHeight: 400 }}>
                        <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Sales Overview (Last 7 Days)</Typography>
                        <Box sx={{ height: 320, width: '100%' }}>
                            {analytics && analytics.chartData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={analytics.chartData}>
                                        <defs>
                                            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#2196f3" stopOpacity={0.1} />
                                                <stop offset="95%" stopColor="#2196f3" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#666' }} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#666' }} />
                                        <Tooltip
                                            contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                            formatter={(value: any) => [`$${value.toLocaleString()}`, 'Sales']}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="sales"
                                            stroke="#2196f3"
                                            strokeWidth={3}
                                            fillOpacity={1}
                                            fill="url(#colorSales)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            ) : (
                                <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f9f9f9', borderRadius: 2 }}>
                                    <Typography color="text.secondary">No recent sales data available</Typography>
                                </Box>
                            )}
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', height: '100%' }}>
                        <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>System Insights</Typography>
                        <Stack spacing={2}>
                            <Box sx={{ p: 2, bgcolor: '#fff4e5', borderRadius: 2, borderLeft: '4px solid #ffa726' }}>
                                <Typography variant="subtitle2" fontWeight={700}>Inventory Status</Typography>
                                <Typography variant="caption">{analytics ? `${analytics.stats.products} active products in catalog` : 'Checking inventory...'}</Typography>
                            </Box>
                            <Box sx={{ p: 2, bgcolor: '#e3f2fd', borderRadius: 2, borderLeft: '4px solid #2196f3' }}>
                                <Typography variant="subtitle2" fontWeight={700}>Average Order Value</Typography>
                                <Typography variant="caption">
                                    {analytics && analytics.stats.orders > 0
                                        ? `$${(analytics.stats.revenue / analytics.stats.orders).toFixed(2)}`
                                        : '$0.00'}
                                </Typography>
                            </Box>
                            <Divider />
                            <Box sx={{ pt: 1 }}>
                                <Typography variant="subtitle2" fontWeight={700}>Active Staff</Typography>
                                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                                    {cashiers.slice(0, 3).map((c, i) => (
                                        <Box
                                            key={i}
                                            title={c.fullName}
                                            sx={{
                                                width: 32,
                                                height: 32,
                                                borderRadius: '50%',
                                                bgcolor: c.status === 'online' ? 'success.main' : 'grey.400',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'white',
                                                fontSize: '0.7rem'
                                            }}
                                        >
                                            {c.fullName[0]}
                                        </Box>
                                    ))}
                                    {cashiers.length > 3 && (
                                        <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: 'grey.100', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>
                                            +{cashiers.length - 3}
                                        </Box>
                                    )}
                                </Stack>
                            </Box>
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}

