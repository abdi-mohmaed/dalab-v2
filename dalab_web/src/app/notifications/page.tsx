'use client';

import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Divider,
    IconButton,
    Button,
    CircularProgress
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import OrderIcon from '@mui/icons-material/ShoppingBag';
import PromoIcon from '@mui/icons-material/LocalOffer';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { useRouter } from 'next/navigation';

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const fetchNotifications = async () => {
        try {
            const res = await fetch('/api/notifications');
            const data = await res.json();
            if (data.notifications) {
                setNotifications(data.notifications);
            }
        } catch (err) {
            console.error('Failed to fetch notifications');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const markAllRead = async () => {
        try {
            const res = await fetch('/api/notifications', { method: 'PATCH' });
            if (res.ok) {
                setNotifications(notifications.map(n => ({ ...n, read: true })));
            }
        } catch (err) {
            console.error('Failed to mark all as read');
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'ORDER_STATUS': return <OrderIcon sx={{ color: '#FFC644' }} />;
            case 'PROMO': return <PromoIcon sx={{ color: '#2ecc71' }} />;
            default: return <NotificationsIcon sx={{ color: 'text.secondary' }} />;
        }
    };

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress sx={{ color: '#FFC644' }} />
            </Box>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>
                    Notifications
                </Typography>
                {notifications.some(n => !n.read) && (
                    <Button
                        startIcon={<DoneAllIcon />}
                        onClick={markAllRead}
                        sx={{ color: 'text.secondary', textTransform: 'none' }}
                    >
                        Mark all as read
                    </Button>
                )}
            </Box>

            {notifications.length === 0 ? (
                <Paper elevation={0} sx={{ p: 4, textAlign: 'center', border: '1px solid #e0e0e0', borderRadius: 4 }}>
                    <NotificationsIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                    <Typography color="text.secondary">
                        No notifications yet. We'll alert you here for updates on your orders.
                    </Typography>
                </Paper>
            ) : (
                <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 4, overflow: 'hidden' }}>
                    <List sx={{ p: 0 }}>
                        {notifications.map((notif, index) => (
                            <React.Fragment key={notif.id}>
                                <ListItem
                                    sx={{
                                        py: 2,
                                        px: 3,
                                        bgcolor: notif.read ? 'transparent' : '#fffdf5',
                                        '&:hover': { bgcolor: '#f9f9f9' }
                                    }}
                                >
                                    <ListItemIcon>
                                        {getIcon(notif.type)}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={
                                            <Typography variant="subtitle2" sx={{ fontWeight: notif.read ? 600 : 800 }}>
                                                {notif.title}
                                            </Typography>
                                        }
                                        secondary={
                                            <Box>
                                                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                                    {notif.message}
                                                </Typography>
                                                <Typography variant="caption" color="text.disabled">
                                                    {new Date(notif.createdAt).toLocaleString()}
                                                </Typography>
                                            </Box>
                                        }
                                    />
                                </ListItem>
                                {index < notifications.length - 1 && <Divider />}
                            </React.Fragment>
                        ))}
                    </List>
                </Paper>
            )}
        </Container>
    );
}
