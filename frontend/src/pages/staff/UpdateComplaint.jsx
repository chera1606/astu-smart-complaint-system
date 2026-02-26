import React, { useState, useEffect, useContext } from 'react';
import {
    Box, Typography, Paper, Grid, Chip, Button, TextField, MenuItem,
    Select, FormControl, InputLabel, Divider, Alert, Skeleton,
    Avatar, Stack, CircularProgress, Snackbar
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CommentIcon from '@mui/icons-material/Comment';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { AuthContext } from '../../context/AuthContext';

const statusColor = (s) => ({ resolved: 'success', pending: 'warning', 'in-progress': 'info', rejected: 'error' }[s] || 'default');
const priorityColor = (p) => ({ Critical: 'error', High: 'warning', Medium: 'default', Low: 'success' }[p] || 'default');

const InfoRow = ({ icon, label, value }) => (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 1.5 }}>
        <Box sx={{ color: '#1565c0', mt: 0.2, minWidth: 20 }}>{icon}</Box>
        <Box>
            <Typography variant="caption" color="text.secondary" display="block">{label}</Typography>
            <Typography variant="body2" fontWeight={500}>{value || '—'}</Typography>
        </Box>
    </Box>
);

const UpdateComplaint = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [complaint, setComplaint] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState('');
    const [remark, setRemark] = useState('');
    const [snackbar, setSnackbar] = useState({ open: false, msg: '', severity: 'success' });

    useEffect(() => {
        api.get(`/complaints/${id}`)
            .then(r => {
                setComplaint(r.data);
                setStatus(r.data.status);
            })
            .catch(() => navigate('/staff/complaints'))
            .finally(() => setLoading(false));
    }, [id]);

    const handleUpdate = async () => {
        if (!status) return;
        setSaving(true);
        try {
            const payload = { status };
            if (remark.trim()) payload.remark = remark.trim();
            const res = await api.put(`/complaints/${id}/status`, payload);
            setComplaint(res.data);
            setStatus(res.data.status);
            setRemark('');
            setSnackbar({ open: true, msg: 'Complaint updated successfully!', severity: 'success' });
        } catch (e) {
            setSnackbar({ open: true, msg: e.response?.data?.message || 'Update failed', severity: 'error' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Box>
                <Skeleton variant="rounded" height={60} sx={{ mb: 2 }} />
                <Grid container spacing={3}>
                    <Grid item xs={12} md={7}><Skeleton variant="rounded" height={400} /></Grid>
                    <Grid item xs={12} md={5}><Skeleton variant="rounded" height={400} /></Grid>
                </Grid>
            </Box>
        );
    }

    if (!complaint) return null;

    return (
        <Box>
            {/* Page Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    variant="outlined"
                    onClick={() => navigate('/staff/complaints')}
                    sx={{ textTransform: 'none', borderRadius: 2 }}
                >
                    Back
                </Button>
                <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h5" fontWeight="bold" color="#1a1a2e">
                        Update Complaint
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Tracking ID: <strong>{complaint.trackingId}</strong>
                    </Typography>
                </Box>
                <Chip
                    label={complaint.status}
                    color={statusColor(complaint.status)}
                    sx={{ fontWeight: 700, px: 1 }}
                />
            </Box>

            <Grid container spacing={3}>
                {/* Left: Complaint Details */}
                <Grid item xs={12} md={7}>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e8edf2', mb: 3 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom color="#1a1a2e">
                            Complaint Details
                        </Typography>
                        <Divider sx={{ mb: 2 }} />

                        <Typography variant="h6" sx={{ mb: 2, color: '#1565c0' }}>{complaint.title}</Typography>

                        <Box sx={{ bgcolor: '#f8fafc', p: 2, borderRadius: 2, mb: 2 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontSize: 11, fontWeight: 600, textTransform: 'uppercase' }}>
                                Description
                            </Typography>
                            <Typography variant="body2" sx={{ lineHeight: 1.8 }}>{complaint.description}</Typography>
                        </Box>

                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <InfoRow icon={<PersonIcon fontSize="small" />} label="Student" value={`${complaint.studentId?.name} (${complaint.studentId?.email})`} />
                                <InfoRow icon={<LocationOnIcon fontSize="small" />} label="Location" value={complaint.location} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <InfoRow icon={<CalendarTodayIcon fontSize="small" />} label="Submitted" value={new Date(complaint.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} />
                                <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                                    <Chip label={complaint.category} size="small" variant="outlined" />
                                    <Chip label={complaint.priority} size="small" color={priorityColor(complaint.priority)} />
                                </Box>
                            </Grid>
                        </Grid>

                        {complaint.attachments?.length > 0 && (
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                    📎 Attachments ({complaint.attachments.length})
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mt: 1 }}>
                                    {complaint.attachments.map((a, i) => {
                                        const fileUrl = a.startsWith('http') ? a : `http://localhost:5000${a}`;
                                        const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(a);
                                        return isImage ? (
                                            <Box
                                                key={i}
                                                component="a"
                                                href={fileUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                sx={{
                                                    display: 'block',
                                                    width: 110, height: 85,
                                                    borderRadius: 2,
                                                    overflow: 'hidden',
                                                    border: '2px solid #e2e8f0',
                                                    transition: 'border-color 0.2s, transform 0.2s',
                                                    '&:hover': { borderColor: '#1565c0', transform: 'scale(1.03)' }
                                                }}
                                            >
                                                <Box
                                                    component="img"
                                                    src={fileUrl}
                                                    alt={`Attachment ${i + 1}`}
                                                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                />
                                            </Box>
                                        ) : (
                                            <Button
                                                key={i}
                                                size="small"
                                                variant="outlined"
                                                href={fileUrl}
                                                target="_blank"
                                                sx={{ borderRadius: 2, textTransform: 'none' }}
                                            >
                                                📄 File {i + 1}
                                            </Button>
                                        );
                                    })}
                                </Box>
                            </Box>
                        )}
                    </Paper>

                    {/* Remarks History */}
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e8edf2' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <CommentIcon sx={{ color: '#1565c0' }} />
                            <Typography variant="h6" fontWeight="bold" color="#1a1a2e">
                                Remarks History
                            </Typography>
                            <Chip label={complaint.remarks?.length || 0} size="small" color="primary" />
                        </Box>
                        <Divider sx={{ mb: 2 }} />

                        {complaint.remarks?.length === 0 ? (
                            <Box sx={{ textAlign: 'center', py: 4 }}>
                                <CommentIcon sx={{ fontSize: 40, color: '#ddd', mb: 1 }} />
                                <Typography variant="body2" color="text.secondary">No remarks added yet</Typography>
                            </Box>
                        ) : (
                            <Stack spacing={2}>
                                {[...complaint.remarks].reverse().map((r, i) => (
                                    <Box key={i} sx={{
                                        display: 'flex', gap: 2,
                                        p: 2, borderRadius: 2,
                                        bgcolor: '#f8fafc',
                                        border: '1px solid #e8edf2'
                                    }}>
                                        <Avatar sx={{ width: 36, height: 36, bgcolor: '#e3f2fd', color: '#1565c0', fontSize: 14 }}>
                                            {r.staffId?.name?.charAt(0) || 'S'}
                                        </Avatar>
                                        <Box sx={{ flexGrow: 1 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                <Typography variant="body2" fontWeight={600}>
                                                    {r.staffId?.name || 'Staff'}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {new Date(r.createdAt).toLocaleString()}
                                                </Typography>
                                            </Box>
                                            <Typography variant="body2" color="text.secondary">{r.message}</Typography>
                                        </Box>
                                    </Box>
                                ))}
                            </Stack>
                        )}
                    </Paper>
                </Grid>

                {/* Right: Update Panel */}
                <Grid item xs={12} md={5}>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e8edf2', position: 'sticky', top: 80 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom color="#1a1a2e">
                            Update Status
                        </Typography>
                        <Divider sx={{ mb: 3 }} />

                        <FormControl fullWidth sx={{ mb: 3 }}>
                            <InputLabel>Complaint Status</InputLabel>
                            <Select
                                value={status}
                                label="Complaint Status"
                                onChange={e => setStatus(e.target.value)}
                                sx={{ borderRadius: 2 }}
                            >
                                <MenuItem value="pending">
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#ff9800' }} />
                                        Open / Pending
                                    </Box>
                                </MenuItem>
                                <MenuItem value="in-progress">
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#2196f3' }} />
                                        In Progress
                                    </Box>
                                </MenuItem>
                                <MenuItem value="resolved">
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#4caf50' }} />
                                        Resolved
                                    </Box>
                                </MenuItem>
                                <MenuItem value="rejected">
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#f44336' }} />
                                        Rejected
                                    </Box>
                                </MenuItem>
                            </Select>
                        </FormControl>

                        <TextField
                            fullWidth
                            multiline
                            rows={5}
                            label="Add Remark (optional)"
                            placeholder="Describe the action taken or provide feedback to the student..."
                            value={remark}
                            onChange={e => setRemark(e.target.value)}
                            sx={{
                                mb: 3,
                                '& .MuiOutlinedInput-root': { borderRadius: 2 }
                            }}
                        />

                        <Button
                            fullWidth
                            variant="contained"
                            size="large"
                            disabled={saving || !status}
                            startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <CheckCircleIcon />}
                            onClick={handleUpdate}
                            sx={{
                                py: 1.5,
                                borderRadius: 2,
                                textTransform: 'none',
                                fontWeight: 700,
                                fontSize: 15,
                                bgcolor: '#1565c0',
                                '&:hover': { bgcolor: '#0d47a1' }
                            }}
                        >
                            {saving ? 'Updating...' : 'Update Complaint'}
                        </Button>

                        {complaint.status === 'resolved' && (
                            <Alert severity="success" sx={{ mt: 2, borderRadius: 2 }}>
                                This complaint has been resolved.
                            </Alert>
                        )}
                    </Paper>
                </Grid>
            </Grid>

            {/* Success/Error Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar(s => ({ ...s, open: false }))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert severity={snackbar.severity} sx={{ borderRadius: 2 }} onClose={() => setSnackbar(s => ({ ...s, open: false }))}>
                    {snackbar.msg}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default UpdateComplaint;
