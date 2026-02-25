import React, { useEffect, useState, useContext } from 'react';
import {
    Box, Typography, Paper, Grid, Avatar, Chip, Divider, Skeleton, Stack
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SyncIcon from '@mui/icons-material/Sync';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import EmailIcon from '@mui/icons-material/Email';
import WorkIcon from '@mui/icons-material/Work';
import ApartmentIcon from '@mui/icons-material/Apartment';
import BadgeIcon from '@mui/icons-material/Badge';
import api from '../../utils/api';
import { AuthContext } from '../../context/AuthContext';

const StatCard = ({ label, value, icon, color }) => (
    <Paper elevation={0} sx={{
        p: 2.5, borderRadius: 3, border: '1px solid #e8edf2', textAlign: 'center',
        transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-3px)' }
    }}>
        <Box sx={{ color, fontSize: 36, mb: 0.5 }}>{icon}</Box>
        <Typography variant="h4" fontWeight="bold" color={color}>{value}</Typography>
        <Typography variant="caption" color="text.secondary" fontWeight={500}>{label}</Typography>
    </Paper>
);

const InfoRow = ({ icon, label, value }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1.5, borderBottom: '1px solid #f5f5f5' }}>
        <Box sx={{ color: '#1565c0', display: 'flex' }}>{icon}</Box>
        <Box sx={{ flexGrow: 1 }}>
            <Typography variant="caption" color="text.secondary" display="block">{label}</Typography>
            <Typography variant="body2" fontWeight={600}>{value || '—'}</Typography>
        </Box>
    </Box>
);

const StaffProfile = () => {
    const { user } = useContext(AuthContext);
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [profileData, setProfileData] = useState(null);

    useEffect(() => {
        Promise.all([
            api.get('/complaints/department'),
            api.get('/auth/me')
        ]).then(([cRes, uRes]) => {
            setComplaints(cRes.data);
            setProfileData(uRes.data);
        }).catch(console.error).finally(() => setLoading(false));
    }, []);

    const stats = {
        total: complaints.length,
        pending: complaints.filter(c => c.status === 'pending').length,
        inProgress: complaints.filter(c => c.status === 'in-progress').length,
        resolved: complaints.filter(c => c.status === 'resolved').length,
    };

    const displayUser = profileData || user;
    const initials = displayUser?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    return (
        <Box>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h5" fontWeight="bold" color="#1a1a2e">My Profile</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Your staff account information and complaint statistics.
                </Typography>
            </Box>

            <Grid container spacing={3}>
                {/* Profile Card */}
                <Grid item xs={12} md={4}>
                    <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid #e8edf2', overflow: 'hidden' }}>
                        {/* Banner */}
                        <Box sx={{
                            height: 80,
                            background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
                        }} />

                        <Box sx={{ px: 3, pb: 3, mt: '-40px' }}>
                            <Avatar sx={{
                                width: 80, height: 80,
                                bgcolor: '#42a5f5',
                                fontSize: 28,
                                fontWeight: 'bold',
                                border: '4px solid white',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                mb: 1.5
                            }}>
                                {loading ? '' : initials}
                            </Avatar>

                            {loading ? (
                                <>
                                    <Skeleton width={160} height={28} />
                                    <Skeleton width={100} height={20} />
                                </>
                            ) : (
                                <>
                                    <Typography variant="h6" fontWeight="bold">{displayUser?.name}</Typography>
                                    <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                                        <Chip label="Staff Member" size="small" color="primary" variant="outlined" />
                                        <Chip label="Active" size="small" color="success" />
                                    </Stack>
                                </>
                            )}

                            <Divider sx={{ my: 2 }} />

                            {loading ? (
                                [...Array(3)].map((_, i) => <Skeleton key={i} height={50} />)
                            ) : (
                                <>
                                    <InfoRow icon={<EmailIcon fontSize="small" />} label="Email Address" value={displayUser?.email} />
                                    <InfoRow icon={<WorkIcon fontSize="small" />} label="Role" value="Department Staff" />
                                    <InfoRow icon={<ApartmentIcon fontSize="small" />} label="Department" value={displayUser?.departmentId?.name || 'Not assigned'} />
                                    <InfoRow icon={<BadgeIcon fontSize="small" />} label="Staff ID" value={displayUser?.userId || displayUser?._id?.slice(-8)?.toUpperCase()} />
                                </>
                            )}
                        </Box>
                    </Paper>
                </Grid>

                {/* Stats Column */}
                <Grid item xs={12} md={8}>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e8edf2', mb: 3 }}>
                        <Typography variant="h6" fontWeight="bold" color="#1a1a2e" gutterBottom>
                            Department Complaint Summary
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            Statistics for all complaints in your department.
                        </Typography>

                        <Grid container spacing={2}>
                            {loading ? (
                                [...Array(4)].map((_, i) => (
                                    <Grid item xs={6} sm={3} key={i}>
                                        <Skeleton variant="rounded" height={110} sx={{ borderRadius: 3 }} />
                                    </Grid>
                                ))
                            ) : (
                                <>
                                    <Grid item xs={6} sm={3}>
                                        <StatCard label="Total Assigned" value={stats.total} icon={<AssignmentIcon fontSize="inherit" />} color="#1565c0" />
                                    </Grid>
                                    <Grid item xs={6} sm={3}>
                                        <StatCard label="Pending" value={stats.pending} icon={<PendingActionsIcon fontSize="inherit" />} color="#e65100" />
                                    </Grid>
                                    <Grid item xs={6} sm={3}>
                                        <StatCard label="In Progress" value={stats.inProgress} icon={<SyncIcon fontSize="inherit" />} color="#6a1b9a" />
                                    </Grid>
                                    <Grid item xs={6} sm={3}>
                                        <StatCard label="Resolved" value={stats.resolved} icon={<CheckCircleIcon fontSize="inherit" />} color="#2e7d32" />
                                    </Grid>
                                </>
                            )}
                        </Grid>
                    </Paper>

                    {/* Resolution rate */}
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e8edf2' }}>
                        <Typography variant="h6" fontWeight="bold" color="#1a1a2e" gutterBottom>
                            Resolution Rate
                        </Typography>
                        {loading ? (
                            <Skeleton variant="rounded" height={60} sx={{ borderRadius: 2 }} />
                        ) : (
                            <Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        {stats.resolved} of {stats.total} complaints resolved
                                    </Typography>
                                    <Typography variant="body2" fontWeight="bold" color="#2e7d32">
                                        {stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0}%
                                    </Typography>
                                </Box>
                                <Box sx={{ height: 12, bgcolor: '#e8edf2', borderRadius: 10, overflow: 'hidden' }}>
                                    <Box sx={{
                                        height: '100%',
                                        width: `${stats.total > 0 ? (stats.resolved / stats.total) * 100 : 0}%`,
                                        bgcolor: '#2e7d32',
                                        borderRadius: 10,
                                        transition: 'width 0.8s ease',
                                        background: 'linear-gradient(90deg, #43a047, #2e7d32)'
                                    }} />
                                </Box>
                                <Box sx={{ display: 'flex', gap: 3, mt: 2 }}>
                                    {[
                                        { label: 'Pending', color: '#e65100', value: stats.pending },
                                        { label: 'In Progress', color: '#6a1b9a', value: stats.inProgress },
                                        { label: 'Resolved', color: '#2e7d32', value: stats.resolved },
                                    ].map(item => (
                                        <Box key={item.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: item.color }} />
                                            <Typography variant="caption" color="text.secondary">{item.label}: <strong>{item.value}</strong></Typography>
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default StaffProfile;
