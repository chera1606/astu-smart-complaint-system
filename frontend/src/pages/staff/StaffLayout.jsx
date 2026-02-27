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
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';

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
    const { mode, toggleTheme } = useContext(ThemeContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [pendingCount, setPendingCount] = useState(0);

    useEffect(() => {
        api.get('/complaints/department').then(r => {
            setPendingCount(r.data.filter(c => c.status === 'pending').length);
        }).catch(() => { });
    }, [location.pathname]);

    const handleLogout = () => { logout(); navigate('/login/staff'); };

    const isActive = (path) => {
        if (path === '/staff') return location.pathname === '/staff';
        return location.pathname.startsWith(path);
    };

    const drawer = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper' }}>
            {/* Profile Header */}
            <Box sx={{
                p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center',
                background: mode === 'light' 
                    ? 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)'
                    : 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                color: 'white',
            }}>
                <Avatar sx={{
                    width: 64, height: 64, bgcolor: mode === 'light' ? '#42a5f5' : '#334155',
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
                                    bgcolor: mode === 'light' ? '#e3f2fd' : 'rgba(37, 99, 235, 0.15)',
                                    color: mode === 'light' ? '#1565c0' : '#60a5fa',
                                    '& .MuiListItemIcon-root': { color: mode === 'light' ? '#1565c0' : '#60a5fa' },
                                    '&:hover': { bgcolor: mode === 'light' ? '#bbdefb' : 'rgba(37, 99, 235, 0.25)' }
                                },
                                color: mode === 'light' ? '#555' : '#94a3b8',
                                '& .MuiListItemIcon-root': { color: mode === 'light' ? '#888' : '#475569' },
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
            <Box sx={{ px: 1.5, py: 2 }}>
                <ListItemButton
                    onClick={handleLogout}
                    sx={{
                        borderRadius: 2,
                        '&:hover': { bgcolor: '#fff5f5' },
                        color: '#d32f2f'
                    }}
                >
                    <ListItemIcon sx={{ minWidth: 42, color: 'inherit' }}><LogoutIcon /></ListItemIcon>
                    <ListItemText primary="Sign Out"
                        primaryTypographyProps={{ fontWeight: 600, fontSize: 13.5 }} />
                </ListItemButton>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" elevation={0} sx={{
                zIndex: (theme) => theme.zIndex.drawer + 1,
                background: mode === 'light' 
                    ? 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)'
                    : 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
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
                    <Typography variant="h6" noWrap fontWeight="bold" sx={{ flexGrow: 1, letterSpacing: -0.5 }}>
                        🎓 ASTU <Box component="span" sx={{ fontWeight: 300, opacity: 0.8, display: { xs: 'none', sm: 'inline' } }}> | Staff Portal</Box>
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
                            <IconButton color="inherit" onClick={toggleTheme}>
                                {mode === 'light' ? <Brightness4 /> : <Brightness7 />}
                            </IconButton>
                        </Tooltip>

                        <NotificationCenter />

                        <Divider orientation="vertical" flexItem sx={{ mx: 0.5, bgcolor: 'rgba(255,255,255,0.2)' }} />

                        {/* Sign Out Button in Header */}


                        <Divider orientation="vertical" flexItem sx={{ mx: 0.5, bgcolor: 'rgba(255,255,255,0.1)' }} />
                        <Box component={Link} to="/staff/profile" sx={{
                            display: { xs: 'none', sm: 'block' },
                            textAlign: 'right', mr: 1,
                            textDecoration: 'none', color: 'inherit'
                        }}>
                            <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1 }}>{user?.name}</Typography>
                            <Typography variant="caption" sx={{ opacity: 0.7 }}>Staff Member</Typography>
                        </Box>
                        <Avatar
                            component={Link} to="/staff/profile"
                            sx={{
                                width: 36, height: 36, bgcolor: '#ffffff', color: '#1565c0',
                                border: '2px solid rgba(255,255,255,0.2)',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                transition: 'transform 0.2s',
                                '&:hover': { transform: 'scale(1.1)' }
                            }}
                        >
                            {user?.name?.charAt(0)}
                        </Avatar>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Desktop Drawer */}
            <Drawer
                variant="permanent"
                sx={{
                    width: DRAWER_WIDTH,
                    display: { xs: 'none', md: 'block' },
                    '& .MuiDrawer-paper': { 
                        width: DRAWER_WIDTH, 
                        boxSizing: 'border-box', 
                        borderRight: mode === 'light' ? '1px solid #e8edf2' : '1px solid rgba(255,255,255,0.05)',
                        bgcolor: 'background.paper'
                    },
                }}
            >
                <Toolbar /> {/* Spacer */}
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
                minHeight: '100vh', bgcolor: 'background.default',
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
