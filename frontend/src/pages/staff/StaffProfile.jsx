import React, { useEffect, useState, useContext } from 'react';
import {
    Box, Typography, Paper, Grid, Avatar, Chip, Divider, Skeleton, Stack,
    TextField, Button, Alert, IconButton, CircularProgress
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SyncIcon from '@mui/icons-material/Sync';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import EmailIcon from '@mui/icons-material/Email';
import WorkIcon from '@mui/icons-material/Work';
import ApartmentIcon from '@mui/icons-material/Apartment';
import BadgeIcon from '@mui/icons-material/Badge';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Close';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import HistoryIcon from '@mui/icons-material/History';
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

const InfoRow = ({ icon, label, value, editing, onChange, name, type = "text" }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1.5, borderBottom: '1px solid #f5f5f5' }}>
        <Box sx={{ color: '#1565c0', display: 'flex' }}>{icon}</Box>
        <Box sx={{ flexGrow: 1 }}>
            <Typography variant="caption" color="text.secondary" display="block">{label}</Typography>
            {editing ? (
                <TextField
                    fullWidth
                    size="small"
                    variant="standard"
                    name={name}
                    value={value || ''}
                    onChange={onChange}
                    type={type}
                    InputProps={{ disableUnderline: false, sx: { fontSize: '0.875rem', fontWeight: 600 } }}
                />
            ) : (
                <Typography variant="body2" fontWeight={600}>{value || '—'}</Typography>
            )}
        </Box>
    </Box>
);

const StaffProfile = () => {
    const { user, setUser } = useContext(AuthContext);
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', currentPassword: '', newPassword: '' });
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [cRes, uRes] = await Promise.all([
                api.get('/complaints/department'),
                api.get('/auth/me')
            ]);
            setComplaints(cRes.data);
            setProfileData(uRes.data);
            setFormData({
                name: uRes.data.name || '',
                email: uRes.data.email || '',
                currentPassword: '',
                newPassword: ''
            });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdating(true);
        setError('');
        setSuccess('');
        try {
            const res = await api.put('/users/profile', formData);
            setProfileData(res.data);
            setUser({ ...user, ...res.data });
            setIsEditing(false);
            setSuccess('Profile updated successfully!');
            setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '' }));
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setUpdating(false);
        }
    };

    const stats = {
        total: complaints.length,
        pending: complaints.filter(c => c.status === 'pending').length,
        inProgress: complaints.filter(c => c.status === 'in-progress').length,
        resolved: complaints.filter(c => c.status === 'resolved').length,
    };

    const displayUser = profileData || user;
    const initials = displayUser?.name
        ? displayUser.name.split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : '';

    if (loading) return (
        <Box sx={{ p: 3 }}>
            <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 4, mb: 4 }} />
            <Grid container spacing={4}>
                <Grid item xs={12} md={7}><Skeleton variant="rectangular" height={400} sx={{ borderRadius: 4 }} /></Grid>
                <Grid item xs={12} md={5}><Skeleton variant="rectangular" height={400} sx={{ borderRadius: 4 }} /></Grid>
            </Grid>
        </Box>
    );

    return (
        <Box maxWidth={1000} sx={{ mx: 'auto', mt: 1, mb: 6 }}>
            {/* Hero Section */}
            <Paper elevation={0} sx={{
                p: { xs: 3, md: 5 },
                borderRadius: 4,
                background: 'linear-gradient(135deg, #1565c0 0%, #1a237e 100%)',
                color: 'white',
                mb: 4,
                position: 'relative',
                overflow: 'hidden'
            }}>
                <Box sx={{
                    position: 'absolute', top: -50, right: -50, width: 200, height: 200,
                    borderRadius: '50%', background: 'rgba(255,255,255,0.05)'
                }} />

                <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', gap: 3 }}>
                    <Avatar sx={{
                        width: 120, height: 120, bgcolor: 'white', color: '#1565c0', fontSize: 50, fontWeight: 'bold',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                        border: '4px solid rgba(255,255,255,0.3)'
                    }}>
                        {initials}
                    </Avatar>
                    <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                        <Typography variant="h3" fontWeight="bold" sx={{ mb: 1, letterSpacing: -1 }}>
                            {displayUser?.name}
                        </Typography>
                        <Stack direction="row" spacing={1.5} justifyContent={{ xs: 'center', sm: 'flex-start' }} alignItems="center">
                            <Chip
                                label="Department Staff"
                                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 700, px: 1 }}
                            />
                            <Typography variant="body1" sx={{ opacity: 0.9, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                {displayUser?.departmentId?.name || 'Academic Department'}
                            </Typography>
                        </Stack>
                    </Box>
                </Box>
            </Paper>

            <Grid container spacing={4}>
                {/* Information Column */}
                <Grid item xs={12} md={7}>
                    <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid #e2e8f0', height: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h6" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <PersonIcon sx={{ color: '#1565c0' }} /> Account Details
                            </Typography>
                            {!isEditing && (
                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={() => setIsEditing(true)}
                                    sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                                >
                                    Edit Profile
                                </Button>
                            )}
                        </Box>

                        {success && <Alert severity="success" sx={{ mb: 4, borderRadius: 2 }}>{success}</Alert>}
                        {error && <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>{error}</Alert>}

                        {!isEditing ? (
                            <Stack spacing={4}>
                                <DetailItem label="Full Name" value={displayUser?.name} />
                                <DetailItem label="Email Address" value={displayUser?.email} />
                                <DetailItem label="Department" value={displayUser?.departmentId?.name} />
                                <DetailItem label="Staff ID" value={displayUser?.userId || displayUser?._id?.slice(-8).toUpperCase()} isCode />
                            </Stack>
                        ) : (
                            <form onSubmit={handleUpdate}>
                                <Stack spacing={3}>
                                    <TextField
                                        fullWidth label="Full Name" value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        InputProps={{ sx: { borderRadius: 2.5 } }}
                                    />
                                    <TextField
                                        fullWidth label="Email Address" value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        InputProps={{ sx: { borderRadius: 2.5 } }}
                                    />

                                    <Divider sx={{ my: 2 }}>
                                        <Typography variant="caption" color="text.secondary" fontWeight="bold">SECURITY UPDATE</Typography>
                                    </Divider>

                                    <TextField
                                        fullWidth label="Current Password" type="password"
                                        placeholder="Required for any changes"
                                        value={formData.currentPassword}
                                        onChange={e => setFormData({ ...formData, currentPassword: e.target.value })}
                                        InputProps={{ sx: { borderRadius: 2.5 } }}
                                    />
                                    <TextField
                                        fullWidth label="New Password" type="password"
                                        placeholder="Leave blank to keep current"
                                        value={formData.newPassword}
                                        onChange={e => setFormData({ ...formData, newPassword: e.target.value })}
                                        InputProps={{ sx: { borderRadius: 2.5 } }}
                                    />

                                    <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                                        <Button
                                            type="submit" variant="contained" disabled={updating}
                                            sx={{ borderRadius: 2.5, px: 5, py: 1.2, textTransform: 'none', fontWeight: 700, bgcolor: '#1565c0' }}
                                        >
                                            {updating ? <CircularProgress size={24} color="inherit" /> : 'Save Changes'}
                                        </Button>
                                        <Button
                                            onClick={() => setIsEditing(false)}
                                            sx={{ borderRadius: 2.5, px: 3, textTransform: 'none', fontWeight: 600 }}
                                        >
                                            Cancel
                                        </Button>
                                    </Stack>
                                </Stack>
                            </form>
                        )}
                    </Paper>
                </Grid>

                {/* Performance Column */}
                <Grid item xs={12} md={5}>
                    <Stack spacing={4}>
                        <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid #e2e8f0', bgcolor: '#f8fafc' }}>
                            <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <SyncIcon sx={{ color: '#1565c0' }} /> Department Statistics
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={6}><SummaryTile label="Total" value={stats.total} color="#1565c0" /></Grid>
                                <Grid item xs={6}><SummaryTile label="Resolved" value={stats.resolved} color="#2e7d32" /></Grid>
                                <Grid item xs={6}><SummaryTile label="Pending" value={stats.pending} color="#e65100" /></Grid>
                                <Grid item xs={6}><SummaryTile label="In Progress" value={stats.inProgress} color="#6a1b9a" /></Grid>
                            </Grid>
                        </Paper>

                        <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid #e2e8f0' }}>
                            <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <HistoryIcon sx={{ color: '#1565c0' }} /> Resolution Rate
                            </Typography>
                            <Box sx={{ mb: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2" color="text.secondary">Overall Productivity</Typography>
                                    <Typography variant="body2" fontWeight="bold">{stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0}%</Typography>
                                </Box>
                                <Box sx={{ height: 8, bgcolor: '#e2e8f0', borderRadius: 4, overflow: 'hidden' }}>
                                    <Box sx={{
                                        height: '100%',
                                        width: `${stats.total > 0 ? (stats.resolved / stats.total) * 100 : 0}%`,
                                        bgcolor: '#2e7d32',
                                        transition: 'width 1s ease'
                                    }} />
                                </Box>
                            </Box>
                        </Paper>
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );
};

const DetailItem = ({ label, value, isCode }) => (
    <Box>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>{label}</Typography>
        <Typography variant="body1" fontWeight={600} sx={{ mt: 0.5, fontFamily: isCode ? 'monospace' : 'inherit', color: isCode ? '#1565c0' : 'inherit' }}>
            {value || 'Not Assigned'}
        </Typography>
    </Box>
);

const SummaryTile = ({ label, value, color }) => (
    <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 3, border: '1px solid #e2e8f0', textAlign: 'center' }}>
        <Typography variant="h5" fontWeight="bold" sx={{ color }}>{value}</Typography>
        <Typography variant="caption" color="text.secondary" fontWeight="bold">{label}</Typography>
    </Box>
);

export default StaffProfile;
