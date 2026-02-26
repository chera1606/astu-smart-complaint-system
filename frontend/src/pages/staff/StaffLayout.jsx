import React, { useState, useContext, useEffect } from 'react';
import {
    Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Typography, AppBar, Toolbar,
    IconButton, CssBaseline, Divider, Avatar, Badge, Tooltip, ListItemButton, Button
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

import StaffOverview from './StaffOverview';
import AssignedComplaints from './AssignedComplaints';
import UpdateComplaint from './UpdateComplaint';
import StaffProfile from './StaffProfile';
import NotificationCenter from '../../components/NotificationCenter';
import api from '../../utils/api';

const DRAWER_WIDTH = 250;

const navItems = [
    { label: 'Dashboard', icon: <DashboardIcon />, path: '/staff' },
    { label: 'Assigned Complaints', icon: <AssignmentIcon />, path: '/staff/complaints' },
    { label: 'Profile', icon: <PersonIcon />, path: '/staff/profile' },
];

const StaffLayout = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [pendingCount, setPendingCount] = useState(0);

    useEffect(() => {
        api.get('/complaints/department').then(r => {
            setPendingCount(r.data.filter(c => c.status === 'pending').length);
        }).catch(() => { });
    }, [location.pathname]);

    const handleLogout = () => { logout(); navigate('/'); };

    const isActive = (path) => {
        if (path === '/staff') return location.pathname === '/staff';
        return location.pathname.startsWith(path);
    };

    const drawer = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Profile Header */}
            <Box sx={{
                p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center',
                background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
                color: 'white',
            }}>
                <Avatar sx={{
                    width: 64, height: 64, bgcolor: '#42a5f5',
                    fontSize: 26, fontWeight: 'bold', mb: 1,
                    border: '3px solid rgba(255,255,255,0.3)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                }}>
                    {user?.name?.charAt(0)?.toUpperCase()}
                </Avatar>
                <Typography variant="subtitle1" fontWeight="bold" noWrap sx={{ maxWidth: 180, textAlign: 'center' }}>
                    {user?.name}
                </Typography>
                <Box sx={{ bgcolor: 'rgba(255,255,255,0.2)', px: 1.5, py: 0.3, borderRadius: 10, mt: 0.5 }}>
                    <Typography variant="caption" sx={{ opacity: 0.9 }}>Staff Member</Typography>
                </Box>
            </Box>

            <Divider />

            {/* Navigation */}
            <List sx={{ px: 1, pt: 2, flexGrow: 1 }}>
                {navItems.map((item) => (
                    <ListItem key={item.label} disablePadding sx={{ mb: 0.5 }}>
                        <ListItemButton
                            component={Link}
                            to={item.path}
                            onClick={() => setMobileOpen(false)}
                            selected={isActive(item.path)}
                            sx={{
                                borderRadius: 2, py: 1.2,
                                '&.Mui-selected': {
                                    bgcolor: '#e3f2fd',
                                    color: '#1565c0',
                                    '& .MuiListItemIcon-root': { color: '#1565c0' },
                                    '&:hover': { bgcolor: '#bbdefb' }
                                },
                                color: '#555',
                                '& .MuiListItemIcon-root': { color: '#888' },
                                transition: 'all 0.2s',
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 40 }}>
                                {item.label === 'Assigned Complaints' ? (
                                    <Badge badgeContent={pendingCount || 0} color="error" max={99}>
                                        {item.icon}
                                    </Badge>
                                ) : item.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.label}
                                primaryTypographyProps={{ fontWeight: isActive(item.path) ? 700 : 400, fontSize: 14 }}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>

            <Divider />
            <Box sx={{ px: 1, py: 1.5 }}>
                <ListItemButton
                    onClick={handleLogout}
                    sx={{ borderRadius: 2, '&:hover': { bgcolor: '#ffeaea' } }}
                >
                    <ListItemIcon sx={{ minWidth: 40, color: 'error.main' }}><LogoutIcon /></ListItemIcon>
                    <ListItemText primary="Sign Out" sx={{ color: 'error.main' }}
                        primaryTypographyProps={{ fontWeight: 500, fontSize: 14 }} />
                </ListItemButton>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" elevation={0} sx={{
                zIndex: (theme) => theme.zIndex.drawer + 1,
                background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
                borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        edge="start"
                        sx={{ mr: 2, display: { md: 'none' } }}
                        onClick={() => setMobileOpen(!mobileOpen)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap fontWeight="bold" sx={{ flexGrow: 1 }}>
                        🎓 ASTU Smart Complaint System
                    </Typography>

                    <NotificationCenter />

                    <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                        <Button
                            color="inherit"
                            onClick={handleLogout}
                            startIcon={<LogoutIcon />}
                            sx={{
                                textTransform: 'none',
                                fontWeight: 600,
                                borderRadius: 2,
                                px: 2,
                                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                            }}
                        >
                            Sign Out
                        </Button>
                    </Box>

                    <Box sx={{
                        bgcolor: 'rgba(255,255,255,0.15)', px: 2, py: 0.5,
                        borderRadius: 10, display: { xs: 'none', sm: 'block' }, ml: 1
                    }}>
                        <Typography variant="caption" fontWeight="bold">Staff Portal</Typography>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Desktop Drawer */}
            <Drawer
                variant="permanent"
                sx={{
                    width: DRAWER_WIDTH,
                    display: { xs: 'none', md: 'block' },
                    '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box', mt: '64px', borderRight: '1px solid #e8edf2' },
                }}
            >
                {drawer}
            </Drawer>

            {/* Mobile Drawer */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={() => setMobileOpen(false)}
                sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { width: DRAWER_WIDTH } }}
            >
                {drawer}
            </Drawer>

            {/* Main Content */}
            <Box component="main" sx={{
                flexGrow: 1, p: { xs: 2, md: 3 }, mt: '64px',
                minHeight: '100vh', bgcolor: '#f0f4f8',
                ml: { md: `${DRAWER_WIDTH}px` }
            }}>
                <Routes>
                    <Route path="/" element={<StaffOverview />} />
                    <Route path="/complaints" element={<AssignedComplaints />} />
                    <Route path="/complaints/:id" element={<UpdateComplaint />} />
                    <Route path="/profile" element={<StaffProfile />} />
                </Routes>
            </Box>
        </Box>
    );
};

export default StaffLayout;
