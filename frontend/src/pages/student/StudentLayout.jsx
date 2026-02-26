import React, { useState, useContext, useEffect } from 'react';
import {
    Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Typography, AppBar, Toolbar,
    IconButton, CssBaseline, Divider, Avatar, Badge, Tooltip, ListItemButton
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ListAltIcon from '@mui/icons-material/ListAlt';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

import StudentOverview from './StudentOverview';
import SubmitComplaint from './SubmitComplaint';
import MyComplaints from './MyComplaints';
import StudentProfile from './StudentProfile';
import NotificationCenter from '../../components/NotificationCenter';
import FloatingChatbot from '../../components/FloatingChatbot';
import api from '../../utils/api';

const DRAWER_WIDTH = 260;

const navItems = [
    { label: 'Dashboard', icon: <DashboardIcon />, path: '/student' },
    { label: 'Submit Complaint', icon: <AddCircleIcon />, path: '/student/submit' },
    { label: 'My Complaints', icon: <ListAltIcon />, path: '/student/my-complaints' },
    { label: 'My Profile', icon: <PersonIcon />, path: '/student/profile' },
];

const StudentLayout = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [stats, setStats] = useState({ total: 0, pending: 0 });

    useEffect(() => {
        api.get('/complaints/student').then(r => {
            const all = r.data;
            setStats({
                total: all.length,
                pending: all.filter(c => c.status === 'pending').length
            });
        }).catch(() => { });
    }, [location.pathname]);

    const handleLogout = () => { logout(); navigate('/'); };

    const isActive = (path) => {
        if (path === '/student') return location.pathname === '/student';
        return location.pathname.startsWith(path);
    };

    const drawer = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Header / Brand */}
            <Box component={Link} to="/student/profile" sx={{
                p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center',
                background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
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
                    <Typography variant="caption" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>Student Portal</Typography>
                </Box>
            </Box>

            <Divider />

            {/* Navigation */}
            <List sx={{ px: 1.5, pt: 2, flexGrow: 1 }}>
                {navItems.map((item) => (
                    <ListItem key={item.label} disablePadding sx={{ mb: 0.8 }}>
                        <ListItemButton
                            component={Link}
                            to={item.path}
                            onClick={() => setMobileOpen(false)}
                            selected={isActive(item.path)}
                            sx={{
                                borderRadius: 2, py: 1.3,
                                '&.Mui-selected': {
                                    bgcolor: '#e3f2fd',
                                    color: '#1565c0',
                                    '& .MuiListItemIcon-root': { color: '#1565c0' },
                                    '&:hover': { bgcolor: '#bbdefb' }
                                },
                                color: '#546e7a',
                                '& .MuiListItemIcon-root': { color: '#90a4ae' },
                                transition: 'all 0.2s',
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 42 }}>
                                {item.label === 'My Complaints' ? (
                                    <Badge badgeContent={stats.pending || 0} color="error" max={99}>
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
                background: 'linear-gradient(90deg, #1565c0 0%, #1976d2 100%)',
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
                        🎓 ASTU <Box component="span" sx={{ fontWeight: 300, opacity: 0.8, display: { xs: 'none', sm: 'inline' } }}> | Issue Tracking</Box>
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Tooltip title="Submit new issue">
                            <IconButton color="inherit" onClick={() => navigate('/student/submit')}>
                                <AddCircleIcon />
                            </IconButton>
                        </Tooltip>

                        <NotificationCenter />

                        <Divider orientation="vertical" flexItem sx={{ mx: 1, bgcolor: 'rgba(255,255,255,0.1)' }} />
                        <Box component={Link} to="/student/profile" sx={{
                            display: { xs: 'none', sm: 'block' },
                            textAlign: 'right', mr: 1,
                            textDecoration: 'none', color: 'inherit'
                        }}>
                            <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1 }}>{user?.name}</Typography>
                            <Typography variant="caption" sx={{ opacity: 0.7 }}>Student</Typography>
                        </Box>
                        <Avatar
                            component={Link} to="/student/profile"
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

            {/* Sidebar for Desktop */}
            <Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', md: 'block' },
                        '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box', borderRight: '1px solid #edf2f7' },
                    }}
                >
                    <Toolbar /> {/* Spacer */}
                    {drawer}
                </Drawer>
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={() => setMobileOpen(false)}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: 'block', md: 'none' },
                        '& .MuiDrawer-paper': { width: DRAWER_WIDTH }
                    }}
                >
                    {drawer}
                </Drawer>
            </Box>

            {/* Main Content */}
            <Box component="main" sx={{
                flexGrow: 1,
                minHeight: '100vh',
                bgcolor: '#f8fafc',
                p: { xs: 2, sm: 3 },
                mt: '64px',
                ml: { md: 0 }
            }}>
                <Routes>
                    <Route path="/" element={<StudentOverview />} />
                    <Route path="/submit" element={<SubmitComplaint />} />
                    <Route path="/my-complaints" element={<MyComplaints />} />
                    <Route path="/profile" element={<StudentProfile />} />
                </Routes>
                <FloatingChatbot />
            </Box>
        </Box>
    );
};

export default StudentLayout;

