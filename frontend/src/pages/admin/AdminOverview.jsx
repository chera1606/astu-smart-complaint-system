import React, { useEffect, useState } from 'react';
import {
    Grid, Paper, Typography, Box, Chip, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, Button, Skeleton,
    Avatar, Stack
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import ReportIcon from '@mui/icons-material/Report';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import SyncIcon from '@mui/icons-material/Sync';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const statusColor = (s) => ({ resolved: 'success', pending: 'warning', 'in-progress': 'info', rejected: 'error' }[s] || 'default');
const priorityColor = (p) => ({ Critical: 'error', High: 'warning', Medium: 'default', Low: 'success' }[p] || 'default');

const StatCard = ({ title, value, icon, color, gradient }) => (
    <Paper elevation={0} sx={{
        p: 3, borderRadius: 3,
        background: gradient || 'white',
        color: gradient ? 'white' : 'inherit',
        border: gradient ? 'none' : '1px solid #e2e8f0',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 12px 20px -10px rgba(0,0,0,0.2)' }
    }}>
        <Box sx={{ position: 'absolute', right: -15, top: -15, opacity: 0.15, fontSize: 100 }}>
            {icon}
        </Box>
        <Typography variant="body2" sx={{ opacity: 0.8, fontWeight: 600, letterSpacing: 0.5 }}>{title.toUpperCase()}</Typography>
        <Box sx={{ mt: 1, display: 'flex', alignItems: 'baseline', gap: 1 }}>
            <Typography variant="h3" fontWeight="bold">{value ?? '0'}</Typography>
        </Box>
    </Paper>
);

const AdminOverview = () => {
    const navigate = useNavigate();
    const [analytics, setAnalytics] = useState(null);
    const [userCount, setUserCount] = useState({ students: 0, staff: 0 });
    const [recentComplaints, setRecentComplaints] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [aRes, uRes, cRes] = await Promise.all([
                    api.get('/complaints/analytics'),
                    api.get('/users'),
                    api.get('/complaints/all?limit=5')
                ]);
                setAnalytics(aRes.data);
                const students = uRes.data.filter(u => u.role === 'student').length;
                const staff = uRes.data.filter(u => u.role === 'staff').length;
                setUserCount({ students, staff });
                setRecentComplaints(cRes.data.slice(0, 5));
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const cards = [
        { title: 'Total Complaints', value: analytics?.totalComplaints, icon: <ReportIcon fontSize="inherit" />, gradient: 'linear-gradient(135deg, #1a237e, #1565c0)' },
        { title: 'Pending', value: analytics?.pendingComplaints, icon: <HourglassEmptyIcon fontSize="inherit" />, gradient: 'linear-gradient(135deg, #ff8f00, #ffa000)' },
        { title: 'In Progress', value: analytics?.inProgressComplaints || 0, icon: <SyncIcon fontSize="inherit" />, gradient: 'linear-gradient(135deg, #7b1fa2, #9c27b0)' },
        { title: 'Resolved', value: analytics?.resolvedComplaints, icon: <CheckCircleIcon fontSize="inherit" />, gradient: 'linear-gradient(135deg, #2e7d32, #43a047)' },
        { title: 'Total Students', value: userCount.students, icon: <PeopleIcon fontSize="inherit" />, gradient: 'linear-gradient(135deg, #00838f, #0097a7)' },
        { title: 'Total Staff', value: userCount.staff, icon: <ManageAccountsIcon fontSize="inherit" />, gradient: 'linear-gradient(135deg, #455a64, #607d8b)' },
    ];

    return (
        <Box>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <Box>
                    <Typography variant="h4" fontWeight="bold" color="#1a1a2e" letterSpacing="-1px">
                        Admin Dashboard
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Comprehensive overview of the ASTU Smart Complaint System.
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<ArrowForwardIcon />}
                    onClick={() => navigate('/admin/analytics')}
                    sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                >
                    Full Analytics
                </Button>
            </Box>

            {/* Stats Grid */}
            <Grid container spacing={3} sx={{ mb: 5 }}>
                {cards.map((c, i) => (
                    <Grid item xs={12} sm={6} md={4} key={i}>
                        {loading ? (
                            <Skeleton variant="rounded" height={130} sx={{ borderRadius: 3 }} />
                        ) : (
                            <StatCard {...c} />
                        )}
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={3}>
                {/* Complaints by Category Chart (Simulated with CSS) */}
                <Grid item xs={12} lg={4}>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0', height: '100%' }}>
                        <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>By Category</Typography>
                        {loading ? (
                            <Stack spacing={2}>{[...Array(5)].map((_, i) => <Skeleton key={i} height={40} />)}</Stack>
                        ) : (
                            <Box>
                                {analytics?.byCategory?.map((c, i) => {
                                    const percent = (c.count / (analytics.totalComplaints || 1)) * 100;
                                    return (
                                        <Box key={i} sx={{ mb: 2.5 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
                                                <Typography variant="body2" fontWeight={600} color="#4a5568">{c._id}</Typography>
                                                <Typography variant="caption" fontWeight={700}>{c.count}</Typography>
                                            </Box>
                                            <Box sx={{ height: 10, bgcolor: '#edf2f7', borderRadius: 5, overflow: 'hidden' }}>
                                                <Box sx={{
                                                    height: '100%',
                                                    width: `${percent}%`,
                                                    bgcolor: '#3182ce',
                                                    borderRadius: 5,
                                                    transition: 'width 1s ease-in-out'
                                                }} />
                                            </Box>
                                        </Box>
                                    );
                                })}
                            </Box>
                        )}
                    </Paper>
                </Grid>

                {/* Recent Complaints Table */}
                <Grid item xs={12} lg={8}>
                    <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                        <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9' }}>
                            <Typography variant="h6" fontWeight="bold">Recent Complaints</Typography>
                            <Button size="small" onClick={() => navigate('/admin/complaints')} sx={{ fontWeight: 600 }}>See All</Button>
                        </Box>
                        <TableContainer>
                            <Table>
                                <TableHead sx={{ bgcolor: '#f8fafc' }}>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 700, fontSize: 12, color: '#64748b' }}>TRACKING ID</TableCell>
                                        <TableCell sx={{ fontWeight: 700, fontSize: 12, color: '#64748b' }}>TITLE</TableCell>
                                        <TableCell sx={{ fontWeight: 700, fontSize: 12, color: '#64748b' }}>STUDENT</TableCell>
                                        <TableCell sx={{ fontWeight: 700, fontSize: 12, color: '#64748b' }}>STATUS</TableCell>
                                        <TableCell sx={{ fontWeight: 700, fontSize: 12, color: '#64748b' }}>DATE</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {loading ? (
                                        [...Array(5)].map((_, i) => (
                                            <TableRow key={i}>
                                                {[...Array(5)].map((_, j) => <TableCell key={j}><Skeleton /></TableCell>)}
                                            </TableRow>
                                        ))
                                    ) : recentComplaints.length === 0 ? (
                                        <TableRow><TableCell colSpan={5} align="center" sx={{ py: 4 }}>No recent complaints</TableCell></TableRow>
                                    ) : (
                                        recentComplaints.map(c => (
                                            <TableRow key={c._id} hover sx={{ '&:last-child td': { border: 0 } }}>
                                                <TableCell>
                                                    <Chip label={c.trackingId} size="small" variant="outlined" sx={{ fontWeight: 600, color: '#1e293b' }} />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" fontWeight={500} noWrap sx={{ maxWidth: 180 }}>{c.title}</Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Avatar sx={{ width: 24, height: 24, fontSize: 10, bgcolor: '#e0e7ff', color: '#4338ca' }}>
                                                            {c.studentId?.name?.charAt(0)}
                                                        </Avatar>
                                                        <Typography variant="body2">{c.studentId?.name}</Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip label={c.status} size="small" color={statusColor(c.status)} sx={{ fontSize: 11, fontWeight: 700 }} />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {new Date(c.createdAt).toLocaleDateString()}
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AdminOverview;
