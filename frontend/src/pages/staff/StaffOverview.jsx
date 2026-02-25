import React, { useEffect, useState, useContext } from 'react';
import {
    Grid, Paper, Typography, Box, Chip, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, Button, Skeleton, Avatar
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SyncIcon from '@mui/icons-material/Sync';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { AuthContext } from '../../context/AuthContext';

const statusColor = (s) => ({ resolved: 'success', pending: 'warning', 'in-progress': 'info', rejected: 'error' }[s] || 'default');
const priorityColor = (p) => ({ Critical: 'error', High: 'warning', Medium: 'default', Low: 'success' }[p] || 'default');

const StatCard = ({ label, value, icon, color, gradient }) => (
    <Paper elevation={0} sx={{
        p: 3, borderRadius: 3,
        background: gradient,
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 24px rgba(0,0,0,0.15)' }
    }}>
        <Box sx={{ position: 'absolute', right: -10, top: -10, opacity: 0.15, fontSize: 90 }}>
            {icon}
        </Box>
        <Typography variant="body2" sx={{ opacity: 0.85, fontWeight: 500 }}>{label}</Typography>
        <Typography variant="h3" fontWeight="bold" sx={{ mt: 1, mb: 0 }}>{value}</Typography>
    </Paper>
);

const StaffOverview = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/complaints/department').then(r => {
            setComplaints(r.data);
        }).catch(console.error).finally(() => setLoading(false));
    }, []);

    const stats = {
        total: complaints.length,
        pending: complaints.filter(c => c.status === 'pending').length,
        inProgress: complaints.filter(c => c.status === 'in-progress').length,
        resolved: complaints.filter(c => c.status === 'resolved').length,
    };

    const recent = [...complaints].slice(0, 5);

    const cards = [
        { label: 'Total Assigned', value: stats.total, icon: <AssignmentIcon fontSize="inherit" />, gradient: 'linear-gradient(135deg, #1565c0, #1976d2)' },
        { label: 'Pending', value: stats.pending, icon: <PendingActionsIcon fontSize="inherit" />, gradient: 'linear-gradient(135deg, #e65100, #f57c00)' },
        { label: 'In Progress', value: stats.inProgress, icon: <SyncIcon fontSize="inherit" />, gradient: 'linear-gradient(135deg, #6a1b9a, #8e24aa)' },
        { label: 'Resolved', value: stats.resolved, icon: <CheckCircleIcon fontSize="inherit" />, gradient: 'linear-gradient(135deg, #2e7d32, #43a047)' },
    ];

    return (
        <Box>
            {/* Welcome Header */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="h5" fontWeight="bold" color="#1a1a2e">
                    Welcome back, {user?.name?.split(' ')[0]} 👋
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Here's your department's complaint overview for today.
                </Typography>
            </Box>

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {cards.map((c) => (
                    <Grid item xs={12} sm={6} lg={3} key={c.label}>
                        {loading ? (
                            <Skeleton variant="rounded" height={110} sx={{ borderRadius: 3 }} />
                        ) : (
                            <StatCard {...c} />
                        )}
                    </Grid>
                ))}
            </Grid>

            {/* Recent Complaints Table */}
            <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid #e8edf2', overflow: 'hidden' }}>
                <Box sx={{ p: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0f0f0' }}>
                    <Typography variant="h6" fontWeight="bold" color="#1a1a2e">
                        Recent Complaints
                    </Typography>
                    <Button
                        endIcon={<ArrowForwardIcon />}
                        size="small"
                        onClick={() => navigate('/staff/complaints')}
                        sx={{ textTransform: 'none', fontWeight: 600 }}
                    >
                        View All
                    </Button>
                </Box>

                <TableContainer>
                    <Table>
                        <TableHead sx={{ bgcolor: '#f8fafc' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700, color: '#555', fontSize: 12 }}>TRACKING ID</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: '#555', fontSize: 12 }}>TITLE</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: '#555', fontSize: 12 }}>STUDENT</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: '#555', fontSize: 12 }}>PRIORITY</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: '#555', fontSize: 12 }}>STATUS</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: '#555', fontSize: 12 }}>ACTION</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                [...Array(4)].map((_, i) => (
                                    <TableRow key={i}>
                                        {[...Array(6)].map((_, j) => (
                                            <TableCell key={j}><Skeleton /></TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : recent.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                                        <Box>
                                            <AssignmentIcon sx={{ fontSize: 48, color: '#ccc', mb: 1 }} />
                                            <Typography color="text.secondary">No complaints assigned yet</Typography>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                recent.map(c => (
                                    <TableRow key={c._id} hover sx={{ '&:last-child td': { border: 0 } }}>
                                        <TableCell>
                                            <Chip label={c.trackingId || 'N/A'} size="small" color="info" variant="outlined" />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight={500} noWrap sx={{ maxWidth: 200 }}>
                                                {c.title}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Avatar sx={{ width: 28, height: 28, fontSize: 12, bgcolor: '#e3f2fd', color: '#1565c0' }}>
                                                    {c.studentId?.name?.charAt(0)}
                                                </Avatar>
                                                <Typography variant="body2">{c.studentId?.name || 'Unknown'}</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Chip label={c.priority || 'Medium'} size="small" color={priorityColor(c.priority)} />
                                        </TableCell>
                                        <TableCell>
                                            <Chip label={c.status} size="small" color={statusColor(c.status)} />
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                sx={{ textTransform: 'none', borderRadius: 2 }}
                                                onClick={() => navigate(`/staff/complaints/${c._id}`)}
                                            >
                                                Update
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
};

export default StaffOverview;
