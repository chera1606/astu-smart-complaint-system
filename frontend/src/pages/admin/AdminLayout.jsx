import React, { useState, useContext, useEffect } from 'react';
import {
    Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Typography, AppBar, Toolbar,
    IconButton, CssBaseline, Divider, Avatar, Badge, Tooltip, Menu, MenuItem
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PeopleIcon from '@mui/icons-material/People';
import CategoryIcon from '@mui/icons-material/Category';
import ReportIcon from '@mui/icons-material/Report';
import BarChartIcon from '@mui/icons-material/BarChart';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

import AdminOverview from './AdminOverview';
import RegisterUser from './RegisterUser';
import ManageUsers from './ManageUsers';
import ManageDepartments from './ManageDepartments';
import AllComplaints from './AllComplaints';
import Analytics from './Analytics';
import KnowledgeBase from './KnowledgeBase';
import Settings from './Settings';
import AdminProfile from './AdminProfile';
import api from '../../utils/api';

const DRAWER_WIDTH = 260;

const navItems = [
    { label: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
    { label: 'Register User', icon: <PersonAddIcon />, path: '/admin/register-user' },
    { label: 'Manage Users', icon: <PeopleIcon />, path: '/admin/users' },
    { label: 'Manage Departments', icon: <CategoryIcon />, path: '/admin/departments' },
    { label: 'All Complaints', icon: <ReportIcon />, path: '/admin/complaints' },
    { label: 'Knowledge Base', icon: <AutoStoriesIcon />, path: '/admin/knowledge-base' },
    { label: 'Analytics', icon: <BarChartIcon />, path: '/admin/analytics' },
    { label: 'Settings', icon: <SettingsIcon />, path: '/admin/settings' },
    { label: 'Profile', icon: <PersonAddIcon />, path: '/admin/profile' },
];

const AdminLayout = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [pendingCount, setPendingCount] = useState(0);

    useEffect(() => {
        api.get('/complaints/analytics').then(r => {
            setPendingCount(r.data.pendingComplaints || 0);
        }).catch(() => { });
    }, []);

    const handleLogout = () => { logout(); navigate('/'); };

    const isActive = (path) => {
        if (path === '/admin') return location.pathname === '/admin';
        return location.pathname.startsWith(path);
    };

    const drawer = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Header / Brand */}
            <Box component={Link} to="/admin/profile" sx={{
                p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center',
                background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
                color: 'white',
                textDecoration: 'none',
                cursor: 'pointer',
                '&:hover .MuiAvatar-root': { transform: 'scale(1.05)' }
            }}>
                <Avatar sx={{
                    width: 64, height: 64, bgcolor: '#42a5f5',
                    fontSize: 26, fontWeight: 'bold', mb: 1.5,
                    border: '3px solid rgba(255,255,255,0.2)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    transition: 'transform 0.2s'
                }}>
                    {user?.name?.charAt(0)?.toUpperCase()}
                </Avatar>
                <Typography variant="subtitle1" fontWeight="bold" noWrap sx={{ maxWidth: 200, textAlign: 'center' }}>
                    {user?.name}
                </Typography>
                <Box sx={{ bgcolor: 'rgba(255,255,255,0.15)', px: 1.5, py: 0.3, borderRadius: 10, mt: 0.8 }}>
                    <Typography variant="caption" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>Administrator</Typography>
                </Box>
            </Box>

            <Divider />

            {/* Navigation */}
            <List sx={{ px: 1.5, pt: 2, flexGrow: 1 }}>
                {navItems.map((item) => (
                    <ListItem
                        button
                        key={item.label}
                        component={Link}
                        to={item.path}
                        onClick={() => setMobileOpen(false)}
                        sx={{
                            borderRadius: 2, mb: 0.8, py: 1.3,
                            bgcolor: isActive(item.path) ? '#e3f2fd' : 'transparent',
                            color: isActive(item.path) ? '#1a237e' : '#546e7a',
                            '& .MuiListItemIcon-root': { color: isActive(item.path) ? '#1a237e' : '#90a4ae' },
                            '&:hover': { bgcolor: isActive(item.path) ? '#e3f2fd' : '#f8f9fa' },
                            transition: 'all 0.2s',
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: 42 }}>
                            {item.label === 'All Complaints' ? (
                                <Badge badgeContent={pendingCount || 0} color="error" max={99}>
                                    {item.icon}
                                </Badge>
                            ) : item.icon}
                        </ListItemIcon>
                        <ListItemText
                            primary={item.label}
                            primaryTypographyProps={{
                                fontWeight: isActive(item.path) ? 700 : 500,
                                fontSize: 13.5,
                                letterSpacing: 0.2
                            }}
                        />
                    </ListItem>
                ))}
            </List>

            <Divider />
            <Box sx={{ px: 1.5, py: 2 }}>
                <ListItem
                    button
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
                </ListItem>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" elevation={0} sx={{
                zIndex: (theme) => theme.zIndex.drawer + 1,
                background: 'linear-gradient(90deg, #1a237e 0%, #1565c0 100%)',
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
                        🎓 ASTU <Box component="span" sx={{ fontWeight: 300, opacity: 0.8, display: { xs: 'none', sm: 'inline' } }}> | Admin Portal</Box>
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Tooltip title="Pending complaints">
                            <IconButton color="inherit" onClick={() => navigate('/admin/complaints')}>
                                <Badge badgeContent={pendingCount} color="error">
                                    <NotificationsNoneIcon />
                                </Badge>
                            </IconButton>
                        </Tooltip>
                        <Divider orientation="vertical" flexItem sx={{ mx: 1, bgcolor: 'rgba(255,255,255,0.1)' }} />
                        <Box component={Link} to="/admin/profile" sx={{
                            display: { xs: 'none', sm: 'block' },
                            textAlign: 'right', mr: 1,
                            textDecoration: 'none', color: 'inherit'
                        }}>
                            <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1 }}>{user?.name}</Typography>
                            <Typography variant="caption" sx={{ opacity: 0.7 }}>Super Admin</Typography>
                        </Box>
                        <Avatar
                            component={Link} to="/admin/profile"
                            sx={{
                                width: 36, height: 36, bgcolor: '#42a5f5',
                                border: '2px solid rgba(255,255,255,0.2)',
                                cursor: 'pointer',
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
                    '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box', borderRight: '1px solid #edf2f7' },
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
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': { width: DRAWER_WIDTH }
                }}
            >
                {drawer}
            </Drawer>

            {/* Main Content */}
            <Box component="main" sx={{
                flexGrow: 1,
                minHeight: '100vh',
                bgcolor: '#f8fafc',
                p: { xs: 2, sm: 3 },
                mt: '64px',
                ml: { md: 0 } // Sidebar is fixed
            }}>
                <Routes>
                    <Route path="/" element={<AdminOverview />} />
                    <Route path="/register-user" element={<RegisterUser />} />
                    <Route path="/users" element={<ManageUsers />} />
                    <Route path="/departments" element={<ManageDepartments />} />
                    <Route path="/complaints" element={<AllComplaints />} />
                    <Route path="/knowledge-base" element={<KnowledgeBase />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/profile" element={<AdminProfile />} />
                </Routes>
            </Box>
        </Box>
    );
};

export default AdminLayout;
