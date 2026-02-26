import React, { useState, useEffect } from 'react';
import {
    Box, Typography, TextField, Button, MenuItem, Paper,
    Alert, Grid, Divider, InputAdornment, IconButton, Card, CardContent
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import BadgeIcon from '@mui/icons-material/Badge';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import ApartmentIcon from '@mui/icons-material/Apartment';
import HomeIcon from '@mui/icons-material/Home';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import api from '../../utils/api';

const RegisterUser = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'student',
        departmentId: '',
        ugrNumber: '',
        dormBlock: ''
    });
    const [departments, setDepartments] = useState([]);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        api.get('/categories').then(r => setDepartments(r.data)).catch(console.error);
    }, []);

    const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccess('');
        setError('');
        setLoading(true);

        // Prep payload based on role
        const payload = { ...formData };
        if (formData.role === 'admin') {
            delete payload.departmentId;
            delete payload.ugrNumber;
            delete payload.dormBlock;
        } else if (formData.role === 'staff') {
            delete payload.ugrNumber;
            delete payload.dormBlock;
        }

        try {
            const res = await api.post('/auth/register', payload);
            setSuccess(`User "${res.data.name}" created successfully! ${res.data.role === 'student' ? 'UGR: ' + res.data.ugrNumber : 'User ID: ' + res.data.userId}`);
            setFormData({ name: '', email: '', password: '', role: 'student', departmentId: '', ugrNumber: '', dormBlock: '' });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create user');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box maxWidth={900} sx={{ mx: 'auto' }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="bold" color="#1a1a2e" letterSpacing="-1px">
                    Register New User
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Create system accounts for students, staff, or other administrators.
                </Typography>
            </Box>

            <Grid container spacing={4}>
                <Grid item xs={12} md={8}>
                    <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid #e2e8f0' }}>
                        {success && <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>{success}</Alert>}
                        {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

                        <form onSubmit={handleSubmit}>
                            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700, color: '#4a5568', textTransform: 'uppercase', fontSize: 11 }}>
                                Basic Account Information
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        required
                                        label="Full Name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start"><PersonAddIcon sx={{ color: '#94a3b8' }} /></InputAdornment>,
                                            sx: { borderRadius: 2 }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        required
                                        label="Email Address"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start"><EmailIcon sx={{ color: '#94a3b8' }} /></InputAdornment>,
                                            sx: { borderRadius: 2 }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        required
                                        label="Password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.password}
                                        onChange={handleChange}
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start"><LockIcon sx={{ color: '#94a3b8' }} /></InputAdornment>,
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                            sx: { borderRadius: 2 }
                                        }}
                                    />
                                </Grid>
                            </Grid>

                            <Divider sx={{ my: 4 }} />

                            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700, color: '#4a5568', textTransform: 'uppercase', fontSize: 11 }}>
                                Role & Specific Details
                            </Typography>

                            <TextField
                                fullWidth
                                required
                                select
                                label="System Role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            >
                                <MenuItem value="student">Student</MenuItem>
                                <MenuItem value="staff">Department Staff</MenuItem>
                                <MenuItem value="admin">System Administrator</MenuItem>
                            </TextField>

                            {formData.role === 'student' && (
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="University Registration Number (UGR)"
                                            name="ugrNumber"
                                            placeholder="Leave blank to generate automatically"
                                            value={formData.ugrNumber}
                                            onChange={handleChange}
                                            helperText="Optional: If left blank, it will be generated as UGR/####/18"
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start"><BadgeIcon sx={{ color: '#94a3b8' }} /></InputAdornment>,
                                                sx: { borderRadius: 2 }
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            select
                                            label="Department"
                                            name="departmentId"
                                            value={formData.departmentId}
                                            onChange={handleChange}
                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                        >
                                            <MenuItem value="">Unassigned</MenuItem>
                                            {departments.map(d => <MenuItem key={d._id} value={d._id}>{d.name}</MenuItem>)}
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Dorm Block"
                                            name="dormBlock"
                                            placeholder="e.g., Block 42"
                                            value={formData.dormBlock}
                                            onChange={handleChange}
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start"><HomeIcon sx={{ color: '#94a3b8' }} /></InputAdornment>,
                                                sx: { borderRadius: 2 }
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            )}

                            {formData.role === 'staff' && (
                                <TextField
                                    fullWidth
                                    required
                                    select
                                    label="Assigned Department"
                                    name="departmentId"
                                    value={formData.departmentId}
                                    onChange={handleChange}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"><ApartmentIcon sx={{ color: '#94a3b8' }} /></InputAdornment>,
                                    }}
                                >
                                    <MenuItem value="" disabled>Select Department</MenuItem>
                                    {departments.map(d => <MenuItem key={d._id} value={d._id}>{d.name}</MenuItem>)}
                                </TextField>
                            )}

                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                fullWidth
                                disabled={loading}
                                sx={{ mt: 5, py: 1.8, borderRadius: 2, fontWeight: 700, textTransform: 'none', fontSize: 16 }}
                            >
                                {loading ? 'Creating Account...' : 'Create User Account'}
                            </Button>
                        </form>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card elevation={0} sx={{ bgcolor: '#eff6ff', borderRadius: 3, border: '1px solid #dbeafe' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" fontWeight="bold" color="#1e40af" gutterBottom>Registration Rules</Typography>
                            <Divider sx={{ mb: 2, borderColor: '#dbeafe' }} />

                            <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle2" fontWeight={700} color="#3b82f6">UGR Requirement</Typography>
                                <Typography variant="body2" color="text.secondary">For students, the UGR number is the official identifier. If you leave it blank, the system will automatically assign one (e.g., UGR/1001/18).</Typography>
                            </Box>

                            <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle2" fontWeight={700} color="#3b82f6">Departments</Typography>
                                <Typography variant="body2" color="text.secondary">Assigning a department to staff allows them to view and resolve complaints directed to that area.</Typography>
                            </Box>

                            <Box>
                                <Typography variant="subtitle2" fontWeight={700} color="#3b82f6">Dormitories</Typography>
                                <Typography variant="body2" color="text.secondary">Inputting dorm block helps in locating the student for physical issue verifications.</Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default RegisterUser;
