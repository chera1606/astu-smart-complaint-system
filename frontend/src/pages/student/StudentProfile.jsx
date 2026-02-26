import React, { useState, useContext } from 'react';
import {
    Box, Typography, Paper, Grid, TextField, Button, Avatar,
    Stack, Divider, IconButton, Alert, Card, CardContent, Chip
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';
import SecurityIcon from '@mui/icons-material/Security';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { AuthContext } from '../../context/AuthContext';
import api from '../../utils/api';

const StudentProfile = () => {
    const { user } = useContext(AuthContext);
    const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        setSuccess('');
        setError('');
        if (passwordData.new !== passwordData.confirm) {
            return setError('New passwords do not match');
        }
        setLoading(true);
        try {
            await api.put('/users/profile', {
                password: passwordData.new,
                currentPassword: passwordData.current
            });
            setSuccess('Password updated successfully!');
            setPasswordData({ current: '', new: '', confirm: '' });
        } catch (err) {
            setError(err.response?.data?.message || 'Update failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box maxWidth={1000} sx={{ mx: 'auto' }}>
            {/* Hero Section */}
            <Paper elevation={0} sx={{
                p: 5, borderRadius: 5, mb: 4,
                background: 'linear-gradient(135deg, #1565c0 0%, #1e40af 100%)',
                color: 'white', position: 'relative', overflow: 'hidden'
            }}>
                <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Avatar sx={{ width: 100, height: 100, bgcolor: 'rgba(255,255,255,0.2)', border: '4px solid rgba(255,255,255,0.3)' }}>
                        <PersonIcon sx={{ fontSize: 60 }} />
                    </Avatar>
                    <Box>
                        <Typography variant="h3" fontWeight="bold" sx={{ mb: 0.5 }}>{user?.name}</Typography>
                        <Stack direction="row" spacing={2}>
                            <Chip label={`Student ID: ${user?.ugr || 'N/A'}`} sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 'bold' }} />
                            <Chip label="Student Account" sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white' }} />
                        </Stack>
                    </Box>
                </Box>
                {/* Decorative Pattern */}
                <Box sx={{ position: 'absolute', right: -50, top: -50, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
                <Box sx={{ position: 'absolute', left: '20%', bottom: -80, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
            </Paper>

            <Grid container spacing={4}>
                {/* Account Details */}
                <Grid item xs={12} md={6}>
                    <Card elevation={0} sx={{ borderRadius: 4, border: '1px solid #e2e8f0', height: '100%' }}>
                        <CardContent sx={{ p: 4 }}>
                            <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <BadgeIcon sx={{ color: '#1565c0' }} /> Account Information
                            </Typography>

                            <Stack spacing={3}>
                                <InfoItem icon={<PersonIcon sx={{ color: '#64748b' }} />} label="Full Name" value={user?.name} />
                                <InfoItem icon={<EmailIcon sx={{ color: '#64748b' }} />} label="Email Address" value={user?.email} />
                                <InfoItem icon={<BadgeIcon sx={{ color: '#64748b' }} />} label="University ID (UGR)" value={user?.ugr} />
                                <InfoItem icon={<SecurityIcon sx={{ color: '#64748b' }} />} label="Role" value="Undergraduate Student" />
                            </Stack>

                            <Paper sx={{ mt: 4, p: 2.5, bgcolor: '#f8fafc', borderRadius: 3, border: '1px solid #e2e8f0' }}>
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, fontWeight: 'bold' }}>DEPARTMENT / FACULTY</Typography>
                                <Typography variant="body1" fontWeight="bold">{user?.departmentId?.name || 'Science & Technology Faculty'}</Typography>
                                <Typography variant="caption" color="text.secondary">Your complaints are routed to this department by default.</Typography>
                            </Paper>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Security Section */}
                <Grid item xs={12} md={6}>
                    <Card elevation={0} sx={{ borderRadius: 4, border: '1px solid #e2e8f0', height: '100%' }}>
                        <CardContent sx={{ p: 4 }}>
                            <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <SecurityIcon sx={{ color: '#1565c0' }} /> Password & Security
                            </Typography>

                            {success && <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>{success}</Alert>}
                            {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

                            <form onSubmit={handlePasswordUpdate}>
                                <Stack spacing={2.5}>
                                    <TextField
                                        fullWidth label="Current Password" type="password" required
                                        value={passwordData.current}
                                        onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                                        InputProps={{ sx: { borderRadius: 2.5 } }}
                                    />
                                    <TextField
                                        fullWidth label="New Password" type="password" required
                                        value={passwordData.new}
                                        onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                                        InputProps={{ sx: { borderRadius: 2.5 } }}
                                    />
                                    <TextField
                                        fullWidth label="Confirm New Password" type="password" required
                                        value={passwordData.confirm}
                                        onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                                        InputProps={{ sx: { borderRadius: 2.5 } }}
                                    />
                                    <Button
                                        type="submit" variant="contained" size="large"
                                        disabled={loading}
                                        startIcon={loading ? <Box sx={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid white', borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }} /> : <SaveIcon />}
                                        sx={{
                                            borderRadius: 2.5, py: 1.5, fontWeight: 'bold', textTransform: 'none',
                                            background: 'linear-gradient(90deg, #1565c0 0%, #1e40af 100%)',
                                            boxShadow: '0 4px 12px rgba(21, 101, 192, 0.3)'
                                        }}
                                    >
                                        Update Password
                                    </Button>
                                </Stack>
                            </form>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </Box>
    );
};

const InfoItem = ({ icon, label, value }) => (
    <Stack direction="row" spacing={2} alignItems="center">
        {icon}
        <Box>
            <Typography variant="caption" color="text.secondary" fontWeight="bold">{label}</Typography>
            <Typography variant="body1" fontWeight="500">{value}</Typography>
        </Box>
    </Stack>
);

export default StudentProfile;
