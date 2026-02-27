import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { ThemeContext } from '../context/ThemeContext';
import { Container, Box, Typography, TextField, Button, Alert, Paper, IconButton, Tooltip } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { mode, toggleTheme } = React.useContext(ThemeContext);
    const theme = useTheme();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        setError(null);

        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }

        setLoading(true);
        try {
            await api.put(`/auth/reset-password/${token}`, { password });
            setMessage('Password successfully reset! Redirecting to login...');
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid or expired token. Please request a new link.');
        } finally {
            setLoading(false);
        }
    };

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
                        Reset Password
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
                        ASTU Smart Complaint System
                    </Typography>

                    <Paper elevation={6} sx={{ p: 4, width: '100%', borderRadius: 3 }}>
                        {message && <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>{message}</Alert>}
                        {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}
                        
                        <Box component="form" onSubmit={handleSubmit}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="New Password"
                                type="password"
                                id="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="confirmPassword"
                                label="Confirm New Password"
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                sx={{ mb: 3 }}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                size="large"
                                disabled={loading || message}
                                sx={{
                                    py: 1.8,
                                    borderRadius: 2,
                                    fontWeight: 800,
                                    fontSize: '1rem',
                                    textTransform: 'none',
                                }}
                            >
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </Button>
                        </Box>

                        <Box sx={{ mt: 4, pt: 3, textAlign: 'center', borderTop: `1px solid ${theme.palette.divider}` }}>
                            <Link to="/login" style={{ textDecoration: 'none', fontWeight: 700, color: theme.palette.primary.main }}>
                                Back to Login
                            </Link>
                        </Box>
                    </Paper>
                </Box>
            </Container>
        </Box>
    );
};

export default ResetPassword;
