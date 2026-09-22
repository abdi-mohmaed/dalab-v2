'use client';

import React, { useState, useEffect } from 'react';
import {
    IconButton,
    Badge,
    Menu,
    MenuItem,
    Typography,
    Box,
    List,
    ListItem,
    ListItemText,
    Divider,
    CircularProgress,
    Button
} from '@mui/material';
import { Notifications as NotificationsIcon } from '@mui/icons-material';

interface Notification {
    id: string;
    title: string;
    message: string;
    read: boolean;
    createdAt: string;
}

export function NotificationCenter() {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const open = Boolean(anchorEl);

    const fetchNotifications = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/notifications');
            const data = await res.json();
            if (data.notifications) {
                setNotifications(data.notifications);
            }
        } catch (err) {
            console.error('Failed to fetch notifications', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Polling for notifications
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleMarkAsRead = async (id: string) => {
        try {
            await fetch('/api/notifications', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, read: true })
            });
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
        } catch (err) {
            console.error('Failed to mark as read', err);
        }
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <Box>
            <IconButton color="inherit" onClick={handleClick}>
                <Badge badgeContent={unreadCount} color="error">
                    <NotificationsIcon />
                </Badge>
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                    sx: { width: 320, maxHeight: 400, mt: 1.5, borderRadius: 2, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>Notifications</Typography>
                    {unreadCount > 0 && <Typography variant="caption" color="primary">{unreadCount} New</Typography>}
                </Box>
                <Divider />
                <List sx={{ py: 0 }}>
                    {isLoading && notifications.length === 0 ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                            <CircularProgress size={24} />
                        </Box>
                    ) : notifications.length === 0 ? (
                        <Box sx={{ p: 3, textAlign: 'center' }}>
                            <Typography color="text.secondary">No notifications yet</Typography>
                        </Box>
                    ) : (
                        notifications.map((notif) => (
                            <ListItem
                                key={notif.id}
                                sx={{
                                    bgcolor: notif.read ? 'transparent' : 'action.hover',
                                    borderBottom: '1px solid #f0f0f0',
                                    flexDirection: 'column',
                                    alignItems: 'flex-start',
                                    py: 1.5,
                                    '&:hover': { bgcolor: 'action.selected' }
                                }}
                                onClick={() => !notif.read && handleMarkAsRead(notif.id)}
                            >
                                <Typography variant="subtitle2" sx={{ fontWeight: notif.read ? 600 : 700 }}>{notif.title}</Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>{notif.message}</Typography>
                                <Typography variant="caption" color="text.disabled">
                                    {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </Typography>
                            </ListItem>
                        ))
                    )}
                </List>
                <Box sx={{ p: 1, textAlign: 'center' }}>
                    <Button fullWidth size="small">View All</Button>
                </Box>
            </Menu>
        </Box>
    );
}
