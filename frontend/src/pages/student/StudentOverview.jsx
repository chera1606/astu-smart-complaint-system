import React, { useEffect, useState, useContext } from 'react';
import {
    Grid, Paper, Typography, Box, Stack, Button,
    Card, CardContent, CardActionArea, useTheme
} from '@mui/material';
import ReportIcon from '@mui/icons-material/Report';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SyncIcon from '@mui/icons-material/Sync';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ListAltIcon from '@mui/icons-material/ListAlt';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import api from '../../utils/api';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const StudentOverview = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [stats, setStats] = useState({ total: 0, open: 0, inProgress: 0, resolved: 0 });

    useEffect(() => {
        api.get('/complaints/student').then(r => {
            const all = r.data;
            setStats({
                total: all.length,
                open: all.filter(c => c.status === 'pending').length,
                inProgress: all.filter(c => c.status === 'in-progress').length,
                resolved: all.filter(c => c.status === 'resolved').length,
            });
        }).catch(console.error);
    }, []);

    const statCards = [
        { label: 'Total Submitted', value: stats.total, icon: <ReportIcon />, color: '#1565c0', bg: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)' },
        { label: 'Open / Pending', value: stats.open, icon: <HourglassEmptyIcon />, color: '#ed6c02', bg: 'linear-gradient(135deg, #ed6c02 0%, #ff9800 100%)' },
        { label: 'In Progress', value: stats.inProgress, icon: <SyncIcon />, color: '#9c27b0', bg: 'linear-gradient(135deg, #9c27b0 0%, #ba68c8 100%)' },
        { label: 'Resolved', value: stats.resolved, icon: <CheckCircleIcon />, color: '#2e7d32', bg: 'linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)' },
    ];

    const quickActions = [
        { label: 'New Complaint', desc: 'File a new facility or service issue', icon: <AddCircleOutlineIcon fontSize="large" />, path: '/student/submit', color: '#1565c0' },
        { label: 'Track History', desc: 'Check status of your past requests', icon: <ListAltIcon fontSize="large" />, path: '/student/my-complaints', color: '#2e7d32' },
        { label: 'Ask Assistant', desc: 'Get help from our AI chatbot', icon: <SmartToyIcon fontSize="large" />, path: '/student/ai', color: '#9c27b0' },
    ];

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="bold" sx={{ letterSpacing: -1, mb: 0.5 }}>
                    Welcome back, {user?.name?.split(' ')[0]} 👋
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Here's what's happening with your campus complaints.
                </Typography>
            </Box>

            {/* Stats Section */}
            <Grid container spacing={3} sx={{ mb: 5 }}>
                {statCards.map(c => (
                    <Grid item xs={12} sm={6} md={3} key={c.label}>
                        <Paper elevation={0} sx={{
                            p: 3, borderRadius: 4, background: c.bg, color: 'white',
                            position: 'relative', overflow: 'hidden',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                        }}>
                            <Box sx={{ position: 'relative', zIndex: 1 }}>
                                <Typography variant="h6" sx={{ opacity: 0.9, fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
                                    {c.label}
                                </Typography>
                                <Typography variant="h3" fontWeight="bold" sx={{ mt: 1 }}>
                                    {c.value}
                                </Typography>
                            </Box>
                            <Box sx={{
                                position: 'absolute', right: -15, bottom: -15,
                                opacity: 0.2, fontSize: 100, transform: 'rotate(-15deg)',
                                display: 'flex'
                            }}>
                                {c.icon}
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            {/* Quick Actions */}
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>Quick Actions</Typography>
            <Grid container spacing={3}>
                {quickActions.map(action => (
                    <Grid item xs={12} md={4} key={action.label}>
                        <Card elevation={0} sx={{
                            borderRadius: 4, border: '1px solid #e2e8f0',
                            transition: 'all 0.2s',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 12px 24px rgba(0,0,0,0.05)',
                                borderColor: action.color
                            }
                        }}>
                            <CardActionArea onClick={() => navigate(action.path)} sx={{ p: 3 }}>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Box sx={{
                                        p: 1.5, borderRadius: 3, bgcolor: `${action.color}15`,
                                        color: action.color, display: 'flex'
                                    }}>
                                        {action.icon}
                                    </Box>
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Typography variant="subtitle1" fontWeight="bold">{action.label}</Typography>
                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                            {action.desc}
                                        </Typography>
                                    </Box>
                                    <ArrowForwardIcon sx={{ color: '#cbd5e1' }} />
                                </Stack>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Recent Tips Section */}
            <Paper elevation={0} sx={{ mt: 5, p: 4, borderRadius: 4, bgcolor: '#f1f5f9', border: '1px dashed #cbd5e1' }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    💡 Pro Tip
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Provide clear photos and exact locations (e.g., "Block 5, Room 204") for faster resolution of maintenance issues.
                    You can use the **AI Assistant** if you're not sure which category to pick.
                </Typography>
            </Paper>
        </Box>
    );
};

export default StudentOverview;

