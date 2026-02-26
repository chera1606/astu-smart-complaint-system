import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Chip, TextField, MenuItem, IconButton,
    Tooltip, InputAdornment, Grid, Skeleton, Button,
    Dialog, DialogTitle, DialogContent, DialogActions, Divider, Stack,
    Avatar
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FilterListIcon from '@mui/icons-material/FilterList';
import DeleteIcon from '@mui/icons-material/Delete';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import PersonIcon from '@mui/icons-material/Person';
import ApartmentIcon from '@mui/icons-material/Apartment';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ListAltIcon from '@mui/icons-material/ListAlt';
import api from '../../utils/api';

const statusColor = (s) => ({
    resolved: 'success',
    pending: 'warning',
    'in-progress': 'primary',
    rejected: 'error'
}[s] || 'default');

const AllComplaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [departments, setDepartments] = useState([]);

    // Filters
    const [keyword, setKeyword] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [deptFilter, setDeptFilter] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('');

    // Detail Dialog
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [newStatus, setNewStatus] = useState('');

    const fetchData = useCallback(async () => {
        try {
            const [cRes, dRes] = await Promise.all([
                api.get('/complaints/all'),
                api.get('/categories')
            ]);
            setComplaints(cRes.data);
            setDepartments(dRes.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleOpenDetail = (complaint) => {
        setSelectedComplaint(complaint);
        setNewStatus(complaint.status);
    };

    const handleUpdateStatus = async () => {
        try {
            await api.put(`/complaints/${selectedComplaint._id}/status`, { status: newStatus });
            setComplaints(complaints.map(c => c._id === selectedComplaint._id ? { ...c, status: newStatus } : c));
            setSelectedComplaint(null);
        } catch (e) {
            alert('Failed to update status');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this complaint permanently?')) return;
        try {
            await api.delete(`/complaints/${id}`);
            setComplaints(complaints.filter(c => c._id !== id));
            if (selectedComplaint?._id === id) setSelectedComplaint(null);
        } catch (e) {
            alert('Deletion failed. Ensure the backend supports DELETE /complaints/:id');
        }
    };

    const filtered = complaints.filter(c => {
        const matchesKeyword = c.title.toLowerCase().includes(keyword.toLowerCase()) ||
            c.trackingId.toLowerCase().includes(keyword.toLowerCase()) ||
            c.studentId?.name?.toLowerCase().includes(keyword.toLowerCase());
        const matchesStatus = statusFilter ? c.status === statusFilter : true;
        const matchesDept = deptFilter ? (c.departmentId?._id || c.departmentId) === deptFilter : true;
        const matchesPriority = priorityFilter ? c.priority === priorityFilter : true;
        return matchesKeyword && matchesStatus && matchesDept && matchesPriority;
    });

    return (
        <Box>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" fontWeight="bold" color="#1a1a2e" letterSpacing="-1px">
                    All Complaints
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Review and oversee all student issues submitted to the system.
                </Typography>
            </Box>

            {/* Comprehensive Filters */}
            <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 3, border: '1px solid #e2e8f0' }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth size="small"
                            placeholder="Search Tracking ID, Title, or Student..."
                            value={keyword}
                            onChange={e => setKeyword(e.target.value)}
                            InputProps={{
                                startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" color="disabled" /></InputAdornment>,
                                sx: { borderRadius: 2 }
                            }}
                        />
                    </Grid>
                    <Grid item xs={6} md={2.6}>
                        <TextField
                            fullWidth select size="small" label="Status"
                            value={statusFilter}
                            onChange={e => setStatusFilter(e.target.value)}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        >
                            <MenuItem value="">All Statuses</MenuItem>
                            <MenuItem value="pending">Pending</MenuItem>
                            <MenuItem value="in-progress">In Progress</MenuItem>
                            <MenuItem value="resolved">Resolved</MenuItem>
                            <MenuItem value="rejected">Rejected</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={6} md={2.6}>
                        <TextField
                            fullWidth select size="small" label="Department"
                            value={deptFilter}
                            onChange={e => setDeptFilter(e.target.value)}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        >
                            <MenuItem value="">All Departments</MenuItem>
                            {departments.map(d => <MenuItem key={d._id} value={d._id}>{d.name}</MenuItem>)}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} md={2.8}>
                        <TextField
                            fullWidth select size="small" label="Priority"
                            value={priorityFilter}
                            onChange={e => setPriorityFilter(e.target.value)}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        >
                            <MenuItem value="">All Priorities</MenuItem>
                            <MenuItem value="Critical">Critical</MenuItem>
                            <MenuItem value="High">High</MenuItem>
                            <MenuItem value="Medium">Medium</MenuItem>
                            <MenuItem value="Low">Low</MenuItem>
                        </TextField>
                    </Grid>
                </Grid>
            </Paper>

            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#f8fafc' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 700, fontSize: 12, color: '#64748b' }}>TRACKING ID</TableCell>
                            <TableCell sx={{ fontWeight: 700, fontSize: 12, color: '#64748b' }}>TITLE</TableCell>
                            <TableCell sx={{ fontWeight: 700, fontSize: 12, color: '#64748b' }}>STUDENT</TableCell>
                            <TableCell sx={{ fontWeight: 700, fontSize: 12, color: '#64748b' }}>DEPARTMENT</TableCell>
                            <TableCell sx={{ fontWeight: 700, fontSize: 12, color: '#64748b' }}>PRIORITY</TableCell>
                            <TableCell sx={{ fontWeight: 700, fontSize: 12, color: '#64748b' }}>STATUS</TableCell>
                            <TableCell sx={{ fontWeight: 700, fontSize: 12, color: '#64748b' }}>ACTIONS</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            [...Array(6)].map((_, i) => (
                                <TableRow key={i}>
                                    {[...Array(7)].map((_, j) => <TableCell key={j}><Skeleton /></TableCell>)}
                                </TableRow>
                            ))
                        ) : filtered.length === 0 ? (
                            <TableRow><TableCell colSpan={7} align="center" sx={{ py: 6, color: 'text.secondary' }}>No complaints found.</TableCell></TableRow>
                        ) : (
                            filtered.map(c => (
                                <TableRow key={c._id} hover>
                                    <TableCell>
                                        <Chip
                                            label={c.trackingId}
                                            size="small"
                                            variant="outlined"
                                            sx={{ fontWeight: 700, fontFamily: 'monospace', borderRadius: 1.5 }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight={600} sx={{ maxWidth: 200, noWrap: true, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {c.title}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">{c.studentId?.name || 'Unknown'}</Typography>
                                        <Typography variant="caption" color="text.secondary">{new Date(c.createdAt).toLocaleDateString()}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" color="text.secondary">{c.departmentId?.name || 'Unassigned'}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={c.priority || 'Medium'}
                                            size="small"
                                            color={c.priority === 'Critical' ? 'error' : c.priority === 'High' ? 'warning' : 'default'}
                                            sx={{ fontWeight: 800, fontSize: 10, height: 20 }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={c.status.toUpperCase()}
                                            size="small"
                                            color={statusColor(c.status)}
                                            variant="soft" // Custom variant logic
                                            sx={{
                                                fontWeight: 800, fontSize: 10, height: 22,
                                                bgcolor: `${statusColor(c.status)}.soft`, // Assuming theme support
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Stack direction="row" spacing={0.5}>
                                            <Tooltip title="View Details">
                                                <IconButton size="small" color="primary" onClick={() => handleOpenDetail(c)}>
                                                    <VisibilityIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete Permanently">
                                                <IconButton size="small" color="error" onClick={() => handleDelete(c._id)}>
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Multi-feature Detail Dialog */}
            <Dialog
                open={!!selectedComplaint}
                onClose={() => setSelectedComplaint(null)}
                maxWidth="md" fullWidth
                PaperProps={{ sx: { borderRadius: 4, overflow: 'hidden' } }}
            >
                {selectedComplaint && (
                    <>
                        <DialogTitle sx={{
                            background: 'linear-gradient(135deg, #1a237e 0%, #311b92 100%)',
                            color: 'white', py: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                        }}>
                            <Box>
                                <Typography variant="h5" fontWeight="bold">{selectedComplaint.title}</Typography>
                                <Typography variant="caption" sx={{ opacity: 0.8 }}>tracking: {selectedComplaint.trackingId}</Typography>
                            </Box>
                            <Chip
                                label={selectedComplaint.status.toUpperCase()}
                                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 800, border: '1px solid white' }}
                            />
                        </DialogTitle>
                        <DialogContent sx={{ p: 4 }}>
                            <Grid container spacing={4}>
                                <Grid item xs={12} md={7}>
                                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <ListAltIcon fontSize="small" /> COMPLAINT DESCRIPTION
                                    </Typography>
                                    <Typography variant="body1" sx={{ mb: 3, p: 2, bgcolor: '#f8fafc', borderRadius: 2, whiteSpace: 'pre-wrap' }}>
                                        {selectedComplaint.description}
                                    </Typography>

                                    {/* Attachments */}
                                    {selectedComplaint.attachments?.length > 0 && (
                                        <Box sx={{ mb: 3 }}>
                                            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5, fontWeight: 700, fontSize: 12, letterSpacing: 0.5 }}>
                                                📎 ATTACHMENTS ({selectedComplaint.attachments.length})
                                            </Typography>
                                            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                                                {selectedComplaint.attachments.map((a, i) => {
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
                                                                width: 120, height: 90,
                                                                borderRadius: 2,
                                                                overflow: 'hidden',
                                                                border: '2px solid #e2e8f0',
                                                                transition: 'border-color 0.2s',
                                                                '&:hover': { borderColor: '#6366f1' }
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

                                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <ReportProblemIcon fontSize="small" /> REMARKS HISTORY
                                    </Typography>
                                    <Stack spacing={2} sx={{ mb: 2 }}>
                                        {selectedComplaint.remarks?.length > 0 ? (
                                            selectedComplaint.remarks.map((r, i) => (
                                                <Box key={i} sx={{ p: 2, borderLeft: '3px solid #6366f1', bgcolor: '#f8fafc' }}>
                                                    <Typography variant="body2">{r.comment}</Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {r.addedBy?.name} • {new Date(r.addedAt).toLocaleString()}
                                                    </Typography>
                                                </Box>
                                            ))
                                        ) : (
                                            <Typography variant="body2" color="text.secondary" fontStyle="italic">No remarks added yet.</Typography>
                                        )}
                                    </Stack>
                                </Grid>

                                <Grid item xs={12} md={5}>
                                    <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 3, border: '1px solid #e2e8f0' }}>
                                        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, fontSize: 16 }}>Meta Data</Typography>
                                        <Stack spacing={2}>
                                            <Box>
                                                <Typography variant="caption" color="disabled" display="block">SUBMITTED BY</Typography>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Avatar sx={{ width: 24, height: 24, fontSize: 10 }}>{selectedComplaint.studentId?.name?.charAt(0)}</Avatar>
                                                    <Typography variant="body2">{selectedComplaint.studentId?.name}</Typography>
                                                </Stack>
                                            </Box>
                                            <Box>
                                                <Typography variant="caption" color="disabled" display="block">DEPARTMENT</Typography>
                                                <Typography variant="body2" fontWeight={600}>{selectedComplaint.departmentId?.name || 'Unassigned'}</Typography>
                                            </Box>
                                            <Box>
                                                <Typography variant="caption" color="disabled" display="block">PRIORITY</Typography>
                                                <Chip label={selectedComplaint.priority} size="small" color={selectedComplaint.priority === 'Critical' ? 'error' : 'default'} />
                                            </Box>
                                            <Divider />
                                            <Box>
                                                <Typography variant="subtitle2" sx={{ mb: 1 }}>Change Status</Typography>
                                                <TextField
                                                    select fullWidth size="small"
                                                    value={newStatus}
                                                    onChange={e => setNewStatus(e.target.value)}
                                                    sx={{ bgcolor: 'white' }}
                                                >
                                                    <MenuItem value="pending">Pending</MenuItem>
                                                    <MenuItem value="in-progress">In Progress</MenuItem>
                                                    <MenuItem value="resolved">Resolved</MenuItem>
                                                    <MenuItem value="rejected">Rejected</MenuItem>
                                                </TextField>
                                                <Button
                                                    variant="contained" fullWidth sx={{ mt: 1, textTransform: 'none' }}
                                                    onClick={handleUpdateStatus}
                                                >
                                                    Update Status
                                                </Button>
                                            </Box>
                                        </Stack>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions sx={{ p: 3, bgcolor: '#f8f9fa' }}>
                            <Button onClick={() => handleDelete(selectedComplaint._id)} color="error" sx={{ textTransform: 'none' }}>Delete Complaint</Button>
                            <Box sx={{ flexGrow: 1 }} />
                            <Button onClick={() => setSelectedComplaint(null)} sx={{ textTransform: 'none', fontWeight: 600 }}>Close</Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </Box>
    );
};

export default AllComplaints;
