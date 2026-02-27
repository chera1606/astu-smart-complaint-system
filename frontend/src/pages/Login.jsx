import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { Container, Box, Typography, TextField, Button, Alert, Paper, Tabs, Tab, IconButton, Tooltip } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const Login = ({ forcedRole }) => {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [localError, setLocalError] = useState(null);
    const { login, logout, error: authError } = useContext(AuthContext);
    const { mode, toggleTheme } = useContext(ThemeContext);
    const theme = useTheme();
    const navigate = useNavigate();

    const getRoleInfo = () => {
        switch (forcedRole) {
            case 'staff': return { label: 'Staff ID', example: 'STF/0001/18', title: 'Staff Login' };
            case 'admin': return { label: 'Admin ID', example: 'ADM/0001/18', title: 'Administrator Login' };
            default: return { label: 'Student ID', example: 'UGR/1001/18', title: 'Student Login' };
        }
    };

    const roleInfo = getRoleInfo();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError(null);
        try {
            const trimmedUserId = userId.trim();
            const user = await login(trimmedUserId, password);

            if (user.role !== forcedRole) {
                logout();
                setLocalError(`Unauthorized for this portal. This is the ${forcedRole} login gateway. Please use your ${forcedRole} ID.`);
                return;
            }

            if (user.role === 'admin') navigate('/admin');
            else if (user.role === 'staff') navigate('/staff');
            else navigate('/student');
        } catch (err) {
            console.error("Login failed", err);
        }
    };

    const displayError = localError || authError;

    return (
        <Box sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: mode === 'light' 
                ? 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
                : 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            position: 'relative'
        }}>
            {/* Theme Toggle Button */}
            <Box sx={{ position: 'absolute', top: 20, right: 20 }}>
                <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
                    <IconButton onClick={toggleTheme} sx={{ color: 'text.secondary' }}>
                        {mode === 'light' ? <Brightness4 /> : <Brightness7 />}
                    </IconButton>
                </Tooltip>
            </Box>

            <Container component="main" maxWidth="xs">
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography variant="h4" fontWeight={900} color="primary" gutterBottom sx={{ mb: 1, letterSpacing: -1 }}>
                        {roleInfo.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
                        ASTU Smart Complaint System
                    </Typography>

                    <Paper elevation={6} sx={{ p: 4, width: '100%', borderRadius: 3 }}>
                        {displayError && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{displayError}</Alert>}
                        <Box component="form" onSubmit={handleSubmit}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="userId"
                                label={roleInfo.label}
                                placeholder={`e.g. ${roleInfo.example}`}
                                helperText={`Enter your ${roleInfo.label.toLowerCase()} to continue`}
                                name="userId"
                                autoComplete="username"
                                autoFocus
                                value={userId}
                                onChange={e => setUserId(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                sx={{ mb: 1 }}
                            />
                            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
                                <Link to="/forgot-password" style={{ 
                                    textDecoration: 'none', 
                                    fontSize: '0.85rem', 
                                    fontWeight: 700,
                                    color: theme.palette.primary.main
                                }}>
                                    Forgot Password?
                                </Link>
                            </Box>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                size="large"
                                sx={{
                                    py: 1.8,
                                    borderRadius: 2,
                                    fontWeight: 800,
                                    fontSize: '1rem',
                                    textTransform: 'none',
                                    boxShadow: '0 8px 16px rgba(37, 99, 235, 0.2)'
                                }}
                            >
                                Sign In
                            </Button>
                        </Box>

                        <Box sx={{ mt: 4, pt: 3, textAlign: 'center', borderTop: `1px solid ${theme.palette.divider}` }}>
                            <Typography variant="body2" color="text.secondary">
                                Secure Access • <Box component="span" sx={{ color: 'primary.main', fontWeight: 700 }}>ASTU ICT</Box>
                            </Typography>
                        </Box>
                    </Paper>
                    <Button
                        variant="text"
                        component={Link}
                        to="/"
                        sx={{ mt: 3, color: 'text.secondary', fontWeight: 700, textTransform: 'none' }}
                    >
                        ← Back to Home
                    </Button>
                </Box>
            </Container>
        </Box>
    );
};

export default Login;
