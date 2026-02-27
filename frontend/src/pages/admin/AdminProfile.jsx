import React, { useContext, useState } from 'react';
import {
    Box, Typography, Paper, Grid, Avatar, Button, TextField,
    Divider, Chip, Stack, Alert, IconButton, InputAdornment, useTheme
} from '@mui/material';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import PersonIcon from '@mui/icons-material/Person';
import SecurityIcon from '@mui/icons-material/Security';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import HistoryIcon from '@mui/icons-material/History';
import api from '../../utils/api';

const AdminProfile = () => {
    const theme = useTheme();
    const { user, setUser } = useContext(AuthContext);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        currentPassword: '',
        newPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);
        try {
            const res = await api.put(`/users/${user._id}`, formData);
            setSuccess('Profile updated successfully!');
            setUser({ ...user, ...res.data });
            setIsEditing(false);
            setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '' }));
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box maxWidth={1000} sx={{ mx: 'auto', mt: 2, mb: 6 }}>
            {/* Header / Hero Section */}
            <Paper elevation={0} sx={{
                p: { xs: 3, md: 5 },
                borderRadius: 4,
                background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
                color: 'white',
                mb: 4,
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Decorative Pattern / Circle */}
                <Box sx={{
                    position: 'absolute', top: -50, right: -50, width: 200, height: 200,
                    borderRadius: '50%', background: 'rgba(255,255,255,0.05)'
                }} />

                <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', gap: 3 }}>
                    <Avatar sx={{
                        width: 120, height: 120, bgcolor: 'white', color: '#1a237e', fontSize: 50, fontWeight: 'bold',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                        border: '4px solid rgba(255,255,255,0.3)'
                    }}>
                        {user?.name?.charAt(0)}
                    </Avatar>
                    <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                        <Typography variant="h3" fontWeight="bold" sx={{ mb: 1, letterSpacing: -1 }}>
                            {user?.name}
                        </Typography>
                        <Stack direction="row" spacing={1.5} justifyContent={{ xs: 'center', sm: 'flex-start' }} alignItems="center">
                            <Chip
                                icon={<VerifiedUserIcon sx={{ color: 'white !important', fontSize: '1rem !important' }} />}
                                label="Super Administrator"
                                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 700, px: 1 }}
                            />
                            <Typography variant="body1" sx={{ opacity: 0.9, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <CalendarTodayIcon fontSize="inherit" /> Joined {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
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
                                <PersonIcon sx={{ color: '#1a237e' }} /> Account Details
                            </Typography>
                            {!isEditing && (
                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={() => setIsEditing(true)}
                                    sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                                >
                                    Modify Profile
                                </Button>
                            )}
                        </Box>

                        {success && <Alert severity="success" variant="filled" sx={{ mb: 4, borderRadius: 2 }}>{success}</Alert>}
                        {error && <Alert severity="error" variant="filled" sx={{ mb: 4, borderRadius: 2 }}>{error}</Alert>}

                        {!isEditing ? (
                            <Stack spacing={4}>
                                <DetailItem label="Full Name" value={user?.name} />
                                <DetailItem label="Email Address" value={user?.email} />
                                <DetailItem label="System Identifier" value={user?.userId} isCode />
                                <DetailItem label="Department / Role" value="Central University Administration" />
                            </Stack>
                        ) : (
                            <form onSubmit={handleUpdate}>
                                <Stack spacing={3}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth label="Full Name" value={formData.name}
                                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                InputProps={{ sx: { borderRadius: 2.5 } }}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth label="Email Address" value={formData.email}
                                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                InputProps={{ sx: { borderRadius: 2.5 } }}
                                            />
                                        </Grid>
                                    </Grid>

                                    <Divider sx={{ my: 2 }}>
                                        <Typography variant="caption" color="text.secondary" fontWeight="bold">SECURITY UPDATE</Typography>
                                    </Divider>

                                    <TextField
                                        fullWidth label="Current Password" type={showPassword ? 'text' : 'password'}
                                        placeholder="Required for any changes"
                                        value={formData.currentPassword}
                                        onChange={e => setFormData({ ...formData, currentPassword: e.target.value })}
                                        InputProps={{
                                            sx: { borderRadius: 2.5 },
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                    <TextField
                                        fullWidth label="New Password" type={showPassword ? 'text' : 'password'}
                                        placeholder="Leave blank to keep current"
                                        value={formData.newPassword}
                                        onChange={e => setFormData({ ...formData, newPassword: e.target.value })}
                                        InputProps={{ sx: { borderRadius: 2.5 } }}
                                    />

                                    <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                                        <Button
                                            type="submit" variant="contained" disabled={loading}
                                            sx={{ borderRadius: 2.5, px: 5, py: 1.2, textTransform: 'none', fontWeight: 700, bgcolor: '#1a237e' }}
                                        >
                                            {loading ? 'Saving...' : 'Update Account'}
                                        </Button>
                                        <Button
                                            onClick={() => setIsEditing(false)}
                                            sx={{ borderRadius: 2.5, px: 3, textTransform: 'none', fontWeight: 600 }}
                                        >
                                            Discard Changes
                                        </Button>
                                    </Stack>
                                </Stack>
                            </form>
                        )}
                    </Paper>
                </Grid>

                {/* Status Column */}
                <Grid item xs={12} md={5}>
                    <Stack spacing={4}>
                        <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid #e2e8f0', bgcolor: '#f8fafc' }}>
                            <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <SecurityIcon sx={{ color: '#1a237e' }} /> Access Overview
                            </Typography>
                            <Stack spacing={2.5}>
                                <StatusBox title="Operational Scope" desc="Global Oversight (All Departments)" color="#ebf4ff" />
                                <StatusBox title="Security Clearance" desc="Level 3 - Root Administrator" color="#f0fff4" />
                                <StatusBox title="Last Authentication" desc="Today, 02:45 PM" color="#fffaf0" />
                            </Stack>
                        </Paper>

                        <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid #e2e8f0' }}>
                            <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <HistoryIcon sx={{ color: '#1a237e' }} /> Recent Activity
                            </Typography>
                            <Stack spacing={2}>
                                <ActivityItem time="2 hours ago" action="Updated department: Engineering" />
                                <ActivityItem time="5 hours ago" action="Resolved complaint: #CMP-2026-0004" />
                                <ActivityItem time="Yesterday" action="Registered new staff member: Dr. Abebe" />
                                <Button component={Link} to="/admin/audit-logs" fullWidth variant="text" sx={{ textTransform: 'none', fontWeight: 600, color: '#1a237e' }}>View Audit Logs</Button>
                            </Stack>
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
        <Typography variant="body1" fontWeight={600} sx={{ mt: 0.5, fontFamily: isCode ? 'monospace' : 'inherit', color: isCode ? '#1a237e' : 'inherit' }}>
            {value || 'Not Provided'}
        </Typography>
    </Box>
);

const StatusBox = ({ title, desc, color }) => (
    <Box sx={{ p: 2, bgcolor: color, borderRadius: 2.5, border: '1px solid rgba(0,0,0,0.05)' }}>
        <Typography variant="subtitle2" fontWeight="bold" sx={{ lineHeight: 1.2 }}>{title}</Typography>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>{desc}</Typography>
    </Box>
);

const ActivityItem = ({ time, action }) => (
    <Box sx={{ display: 'flex', gap: 2 }}>
        <Box sx={{
            width: 8, height: 8, borderRadius: '50%', bgcolor: '#1a237e', mt: 0.8, flexShrink: 0,
            boxShadow: '0 0 0 3px rgba(26, 35, 126, 0.1)'
        }} />
        <Box>
            <Typography variant="body2" fontWeight={600} sx={{ lineHeight: 1.2 }}>{action}</Typography>
            <Typography variant="caption" color="text.secondary">{time}</Typography>
        </Box>
    </Box>
);

export default AdminProfile;
