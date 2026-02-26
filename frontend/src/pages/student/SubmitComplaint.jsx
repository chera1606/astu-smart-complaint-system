import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Paper, TextField, Button, MenuItem,
    Alert, Grid, Stack, IconButton, InputAdornment,
    CircularProgress, Card, CardMedia
} from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SendIcon from '@mui/icons-material/Send';
import api from '../../utils/api';

const SubmitComplaint = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        departmentId: '',
        priority: 'Medium',
        location: ''
    });
    const [departments, setDepartments] = useState([]);
    const [attachment, setAttachment] = useState(null);
    const [preview, setPreview] = useState(null);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        api.get('/categories').then(r => setDepartments(r.data)).catch(console.error);
    }, []);

    const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAttachment(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const removeFile = () => {
        setAttachment(null);
        setPreview(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccess('');
        setError('');
        setLoading(true);

        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        if (attachment) data.append('attachment', attachment);

        try {
            const res = await api.post('/complaints', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setSuccess(`Complaint submitted successfully! Tracking ID: ${res.data.trackingId}`);
            setFormData({ title: '', description: '', category: '', departmentId: '', priority: 'Medium', location: '' });
            removeFile();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            setError(err.response?.data?.message || 'Submission failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box maxWidth={900} sx={{ mx: 'auto' }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="bold" sx={{ letterSpacing: -1, mb: 1 }}>
                    File a New Complaint
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Provide detail about the issue you're facing. Our staff will review it shortly.
                </Typography>
            </Box>

            <Grid container spacing={4}>
                <Grid item xs={12} md={7}>
                    <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid #e2e8f0' }}>
                        {success && <Alert severity="success" variant="filled" sx={{ mb: 3, borderRadius: 2 }}>{success}</Alert>}
                        {error && <Alert severity="error" variant="filled" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

                        <form onSubmit={handleSubmit}>
                            <Stack spacing={3}>
                                <TextField
                                    fullWidth required label="Complaint Title" name="title"
                                    placeholder="e.g., Internet not working in Block 5"
                                    value={formData.title} onChange={handleChange}
                                    InputProps={{ sx: { borderRadius: 2.5 } }}
                                />
                                <TextField
                                    fullWidth required label="Detailed Description" name="description"
                                    multiline rows={5} placeholder="Describe the issue in detail..."
                                    value={formData.description} onChange={handleChange}
                                    InputProps={{ sx: { borderRadius: 2.5 } }}
                                />

                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth required select label="Category" name="category"
                                            value={formData.category} onChange={handleChange}
                                            InputProps={{ sx: { borderRadius: 2.5 } }}
                                        >
                                            {['Hardware', 'Software', 'Network', 'Facilities', 'Sanitation', 'Other'].map(c => (
                                                <MenuItem key={c} value={c}>{c}</MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth required select label="Department" name="departmentId"
                                            value={formData.departmentId} onChange={handleChange}
                                            InputProps={{ sx: { borderRadius: 2.5 } }}
                                        >
                                            {departments.map(d => (
                                                <MenuItem key={d._id} value={d._id}>{d.name}</MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>
                                </Grid>

                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth required label="Location / Building" name="location"
                                            placeholder="e.g., Block 4, Room 12"
                                            value={formData.location} onChange={handleChange}
                                            InputProps={{ sx: { borderRadius: 2.5 } }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth required select label="Priority Level" name="priority"
                                            value={formData.priority} onChange={handleChange}
                                            InputProps={{ sx: { borderRadius: 2.5 } }}
                                        >
                                            {['Low', 'Medium', 'High', 'Critical'].map(p => (
                                                <MenuItem key={p} value={p}>{p}</MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>
                                </Grid>

                                <Button
                                    type="submit" variant="contained" size="large"
                                    disabled={loading}
                                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                                    sx={{
                                        mt: 2, py: 1.8, borderRadius: 2.5, fontWeight: 'bold',
                                        textTransform: 'none', fontSize: '1.1rem',
                                        background: 'linear-gradient(90deg, #1565c0 0%, #1976d2 100%)',
                                        boxShadow: '0 4px 12px rgba(21, 101, 192, 0.3)'
                                    }}
                                >
                                    {loading ? 'Submitting...' : 'Submit Complaint'}
                                </Button>
                            </Stack>
                        </form>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={5}>
                    <Stack spacing={3}>
                        <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid #e2e8f0', textAlign: 'center' }}>
                            <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>Attach a Photo</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                Adding an image helps our staff understand the issue better.
                            </Typography>

                            {!preview ? (
                                <Box sx={{
                                    border: '2px dashed #cbd5e1', borderRadius: 4, p: 4,
                                    transition: 'all 0.2s', '&:hover': { borderColor: '#1565c0', bgcolor: '#f1f5f9' }
                                }}>
                                    <input
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        id="attachment-file"
                                        type="file"
                                        onChange={handleFileChange}
                                    />
                                    <label htmlFor="attachment-file">
                                        <IconButton component="span" sx={{ mb: 1, color: '#1565c0', bgcolor: '#e3f2fd', p: 2 }}>
                                            <CloudUploadIcon fontSize="large" />
                                        </IconButton>
                                        <Typography variant="body2" fontWeight="bold" sx={{ cursor: 'pointer' }}>
                                            Click to upload image
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            PNG, JPG or JPEG (max 5MB)
                                        </Typography>
                                    </label>
                                </Box>
                            ) : (
                                <Card sx={{ position: 'relative', borderRadius: 4, overflow: 'hidden' }}>
                                    <CardMedia
                                        component="img"
                                        height="240"
                                        image={preview}
                                        alt="Upload preview"
                                    />
                                    <IconButton
                                        onClick={removeFile}
                                        sx={{
                                            position: 'absolute', top: 10, right: 10,
                                            bgcolor: 'rgba(0,0,0,0.5)', color: 'white',
                                            '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' }
                                        }}
                                    >
                                        <CloseIcon />
                                    </IconButton>
                                </Card>
                            )}
                        </Paper>

                        <Paper elevation={0} sx={{ p: 3, borderRadius: 4, bgcolor: '#fff7ed', border: '1px solid #ffedd5' }}>
                            <Typography variant="subtitle2" fontWeight="bold" color="#9a3412" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                ⚠️ Important Note
                            </Typography>
                            <Typography variant="caption" color="#9a3412">
                                Please ensure you only submit genuine complaints. False reporting or misuse of the system may lead to disciplinary action.
                                Your student account information is recorded with every submission.
                            </Typography>
                        </Paper>
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );
};

export default SubmitComplaint;

