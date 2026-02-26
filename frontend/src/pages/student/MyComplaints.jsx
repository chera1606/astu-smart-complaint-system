import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Chip, Dialog, DialogTitle, DialogContent,
    DialogActions, Button, IconButton, Stack, Divider, CardMedia,
    Tooltip, Stepper, Step, StepLabel, StepContent, Grid
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import InfoIcon from '@mui/icons-material/Info';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import HistoryIcon from '@mui/icons-material/History';
import CloseIcon from '@mui/icons-material/Close';
import api from '../../utils/api';

const statusConfig = {
    pending: { label: 'Pending', color: 'warning', bg: '#fff7ed', text: '#9a3412' },
    'in-progress': { label: 'In Progress', color: 'primary', bg: '#eff6ff', text: '#1e40af' },
    resolved: { label: 'Resolved', color: 'success', bg: '#f0fdf4', text: '#166534' },
    rejected: { label: 'Rejected', color: 'error', bg: '#fef2f2', text: '#991b1b' },
};

const priorityColor = (p) => ({ Critical: 'error', High: 'warning', Medium: 'info', Low: 'success' }[p] || 'default');

const MyComplaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [selected, setSelected] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);

    useEffect(() => { fetchComplaints(); }, []);

    const fetchComplaints = async () => {
        try {
            const res = await api.get('/complaints/student');
            setComplaints(res.data);
        } catch (e) { console.error(e); }
    };

    const handleViewDetails = (complaint) => {
        setSelected(complaint);
        setOpenDialog(true);
    };

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="bold" sx={{ letterSpacing: -1, mb: 1 }}>
                    My Complaints
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Track the status and history of all issues you've submitted.
                </Typography>
            </Box>

            <TableContainer component={Paper} elevation={0} sx={{
                borderRadius: 4, border: '1px solid #e2e8f0', overflow: 'hidden'
            }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#f8fafc' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', color: '#64748b' }}>TRACKING ID</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: '#64748b' }}>COMPLAINT TITLE</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: '#64748b' }}>CATEGORY</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: '#64748b' }}>PRIORITY</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: '#64748b' }}>STATUS</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: '#64748b' }}>SUBMITTED ON</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold', color: '#64748b' }}>ACTIONS</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {complaints.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                                    <Box sx={{ opacity: 0.5 }}>
                                        <InfoIcon sx={{ fontSize: 48, mb: 1 }} />
                                        <Typography variant="body1">No complaints found. Submit your first issue!</Typography>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ) : (
                            complaints.map(c => (
                                <TableRow key={c._id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight="bold" sx={{ color: '#1565c0' }}>
                                            #{c.trackingId || 'N/A'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight={600}>{c.title}</Typography>
                                        <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block', maxWidth: 200 }}>
                                            {c.description}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip label={c.category} size="small" variant="outlined" sx={{ fontWeight: 600, borderRadius: 1.5 }} />
                                    </TableCell>
                                    <TableCell>
                                        <Stack direction="row" spacing={0.5} alignItems="center">
                                            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: priorityColor(c.priority) + '.main' }} />
                                            <Typography variant="caption" fontWeight={700}>{c.priority}</Typography>
                                        </Stack>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={statusConfig[c.status]?.label || c.status}
                                            size="small"
                                            sx={{
                                                bgcolor: statusConfig[c.status]?.bg || '#f1f5f9',
                                                color: statusConfig[c.status]?.text || '#475569',
                                                fontWeight: 800,
                                                fontSize: '0.7rem',
                                                textTransform: 'uppercase',
                                                letterSpacing: 0.5,
                                                borderRadius: 1.5
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="caption" sx={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <CalendarTodayIcon sx={{ fontSize: 14 }} /> {new Date(c.createdAt).toLocaleDateString()}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Tooltip title="View Full Details">
                                            <IconButton
                                                size="small"
                                                onClick={() => handleViewDetails(c)}
                                                sx={{ color: '#1565c0', bgcolor: '#e3f2fd', '&:hover': { bgcolor: '#bbdefb' } }}
                                            >
                                                <VisibilityIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Details Dialog */}
            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                fullWidth
                maxWidth="md"
                PaperProps={{ sx: { borderRadius: 4 } }}
            >
                <DialogTitle sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                        <Typography variant="h6" fontWeight="bold">Complaint Details</Typography>
                        <Typography variant="caption" color="text.secondary">Tracking ID: #{selected?.trackingId}</Typography>
                    </Box>
                    <IconButton onClick={() => setOpenDialog(false)}><CloseIcon /></IconButton>
                </DialogTitle>
                <Divider />
                <DialogContent sx={{ p: 4 }}>
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={7}>
                            <Stack spacing={3}>
                                <Box>
                                    <Typography variant="caption" fontWeight="bold" color="text.secondary" sx={{ textTransform: 'uppercase' }}>Subject</Typography>
                                    <Typography variant="h5" fontWeight="bold" sx={{ mt: 0.5 }}>{selected?.title}</Typography>
                                </Box>

                                <Box sx={{ p: 2.5, bgcolor: '#f8fafc', borderRadius: 3, border: '1px solid #e2e8f0' }}>
                                    <Typography variant="caption" fontWeight="bold" color="text.secondary" sx={{ textTransform: 'uppercase' }}>Issue Description</Typography>
                                    <Typography variant="body2" sx={{ mt: 1, lineHeight: 1.6, color: '#334155' }}>
                                        {selected?.description}
                                    </Typography>
                                </Box>

                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <InfoBlock label="Category" value={selected?.category} icon={<InfoIcon fontSize="inherit" />} />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <InfoBlock label="Location" value={selected?.location} icon={<LocationOnIcon fontSize="inherit" />} />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <InfoBlock label="Priority" value={selected?.priority} color={priorityColor(selected?.priority) + '.main'} icon={<PriorityHighIcon fontSize="inherit" />} />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <InfoBlock label="Department" value={selected?.departmentId?.name || 'N/A'} icon={<HistoryIcon fontSize="inherit" />} />
                                    </Grid>
                                </Grid>

                                {selected?.attachments && selected.attachments.length > 0 && (
                                    <Box>
                                        <Typography variant="caption" fontWeight="bold" color="text.secondary" sx={{ textTransform: 'uppercase', mb: 1, display: 'block' }}>Attachment</Typography>
                                        <Paper elevation={0} sx={{ borderRadius: 3, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                                            <CardMedia
                                                component="img"
                                                height="300"
                                                image={`${api.defaults.baseURL.replace('/api', '')}/${selected.attachments[0]}`}
                                                alt="Complaint attachment"
                                            />
                                        </Paper>
                                    </Box>
                                )}
                            </Stack>
                        </Grid>

                        <Grid item xs={12} md={5}>
                            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <HistoryIcon sx={{ color: '#1565c0' }} /> Resolution Timeline
                            </Typography>

                            <Stepper orientation="vertical" sx={{
                                '& .MuiStepConnector-line': { minHeight: 40 }
                            }}>
                                <Step active>
                                    <StepLabel icon={<Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#1565c0' }} />}>
                                        <Typography variant="body2" fontWeight="bold">Complaint Submitted</Typography>
                                        <Typography variant="caption" color="text.secondary">{new Date(selected?.createdAt).toLocaleString()}</Typography>
                                    </StepLabel>
                                </Step>

                                {selected?.status !== 'pending' && (
                                    <Step active>
                                        <StepLabel icon={<Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#42a5f5' }} />}>
                                            <Typography variant="body2" fontWeight="bold">Marked as {selected?.status?.replace('-', ' ')}</Typography>
                                            <Typography variant="caption" color="text.secondary">By Department Staff</Typography>
                                        </StepLabel>
                                    </Step>
                                )}

                                {selected?.remarks?.length > 0 ? (
                                    selected.remarks.map((r, i) => (
                                        <Step key={i} active>
                                            <StepLabel icon={<Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#2e7d32' }} />}>
                                                <Typography variant="body2" fontWeight="bold">Staff Remark Added</Typography>
                                                <Typography variant="body2" sx={{ mt: 1, p: 2, bgcolor: '#f0fdf4', borderRadius: 2, border: '1px solid #dcfce7', color: '#166534' }}>
                                                    "{r.message}"
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                                                    {new Date(r.createdAt).toLocaleString()}
                                                </Typography>
                                            </StepLabel>
                                        </Step>
                                    ))
                                ) : (
                                    <Step>
                                        <StepLabel>
                                            <Typography variant="body2" color="text.secondary">Waiting for staff review...</Typography>
                                        </StepLabel>
                                    </Step>
                                )}
                            </Stepper>
                        </Grid>
                    </Grid>
                </DialogContent>
                <Divider />
                <DialogActions sx={{ p: 3 }}>
                    <Button
                        variant="contained"
                        onClick={() => setOpenDialog(false)}
                        sx={{ borderRadius: 2, px: 4, textTransform: 'none', fontWeight: 'bold', bgcolor: '#1565c0' }}
                    >
                        Close Details
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

const InfoBlock = ({ label, value, color, icon }) => (
    <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 3, border: '1px solid #e2e8f0', height: '100%' }}>
        <Typography variant="caption" fontWeight="bold" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, textTransform: 'uppercase' }}>
            {icon} {label}
        </Typography>
        <Typography variant="body2" fontWeight="bold" sx={{ mt: 0.5, color: color || 'inherit' }}>
            {value}
        </Typography>
    </Box>
);

export default MyComplaints;
