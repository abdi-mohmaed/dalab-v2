'use client';

import React, { useState } from 'react';
import {
    Box,
    Drawer,
    AppBar,
    Toolbar,
    List,
    Typography,
    Divider,
    IconButton,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Avatar,
    Menu,
    MenuItem,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import {
    Menu as MenuIcon,
    Inventory,
    Category,
    Store as StoreIcon,
    ShoppingCart,
    People,
    Campaign,
    Receipt,
    Home as HomeIcon,
    Dashboard,
    Logout,
    LocalShipping,
    History as HistoryIcon,
    Label,
} from '@mui/icons-material';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const drawerWidth = 240;

interface MenuItemType {
    id: string;
    label: string;
    icon: React.ReactNode;
}

const MENU_ITEMS: MenuItemType[] = [
    { id: 'overview', label: 'Overview', icon: <HomeIcon /> },
    { id: 'products', label: 'Products', icon: <Inventory /> },
    { id: 'categories', label: 'Categories', icon: <Category /> },
    { id: 'stores', label: 'Stores', icon: <StoreIcon /> },
    { id: 'orders', label: 'Orders', icon: <ShoppingCart /> },
    { id: 'users', label: 'Users', icon: <People /> },
    { id: 'ads', label: 'Ads & Promotions', icon: <Campaign /> },
    { id: 'cashiers', label: 'Cashiers', icon: <Receipt /> },
    { id: 'homepage', label: 'Homepage Sections', icon: <Dashboard /> },
    { id: 'tags', label: 'Product Tags', icon: <Label /> },
    { id: 'delivery', label: 'Delivery', icon: <LocalShipping /> },
    { id: 'audit-logs', label: 'Audit Logs', icon: <HistoryIcon /> },
];

interface AdminLayoutProps {
    children: React.ReactNode;
    activeView: string;
    onViewChange: (view: string) => void;
}

export function AdminLayout({ children, activeView, onViewChange }: AdminLayoutProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const { user, logout } = useAuth();
    const router = useRouter();

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    const drawer = (
        <div>
            <Toolbar>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    DALAB ADMIN
                </Typography>
            </Toolbar>
            <Divider />
            <List>
                {MENU_ITEMS.map((item) => (
                    <ListItem key={item.id} disablePadding>
                        <ListItemButton
                            selected={activeView === item.id}
                            onClick={() => {
                                onViewChange(item.id);
                                if (isMobile) setMobileOpen(false);
                            }}
                            sx={{
                                '&.Mui-selected': {
                                    bgcolor: 'primary.light',
                                    color: 'primary.contrastText',
                                    '& .MuiListItemIcon-root': {
                                        color: 'primary.contrastText',
                                    },
                                },
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 500 }} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </div>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f7f9' }}>
            <AppBar
                position="fixed"
                sx={{
                    width: { md: `calc(100% - ${drawerWidth}px)` },
                    ml: { md: `${drawerWidth}px` },
                    bgcolor: 'white',
                    color: 'text.primary',
                    boxShadow: 'none',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                }}
            >
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { md: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>

                    <Typography variant="subtitle1" component="div" sx={{ fontWeight: 600 }}>
                        {MENU_ITEMS.find(i => i.id === activeView)?.label || 'Dashboard'}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
                            {user?.name || 'Admin'}
                        </Typography>
                        <IconButton onClick={handleMenu}>
                            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: '0.8rem' }}>
                                {user?.name?.[0] || 'A'}
                            </Avatar>
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        >
                            <MenuItem onClick={handleClose}>Profile</MenuItem>
                            <MenuItem onClick={handleLogout}>
                                <ListItemIcon><Logout fontSize="small" /></ListItemIcon>
                                Logout
                            </MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>

            <Box
                component="nav"
                sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: 'block', sm: 'block', md: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'none', md: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: '1px solid', borderColor: 'divider' },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { md: `calc(100% - ${drawerWidth}px)` },
                    mt: '64px',
                }}
            >
                {children}
            </Box>
        </Box>
    );
}
