import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Chip, Button, TextField, InputAdornment,
    MenuItem, Select, FormControl, InputLabel, Skeleton, Avatar,
    Stack, Tooltip, IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import AssignmentIcon from '@mui/icons-material/Assignment';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const statusColor = (s) => ({ resolved: 'success', pending: 'warning', 'in-progress': 'info', rejected: 'error' }[s] || 'default');
const priorityColor = (p) => ({ Critical: 'error', High: 'warning', Medium: 'default', Low: 'success' }[p] || 'default');

const AssignedComplaints = () => {
    const navigate = useNavigate();
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [keyword, setKeyword] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('');

    const fetchComplaints = useCallback(async () => {
        setLoading(true);
        try {
            const params = {};
            if (keyword) params.keyword = keyword;
            if (statusFilter) params.status = statusFilter;
            const res = await api.get('/complaints/department', { params });
            setComplaints(res.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [keyword, statusFilter]);

    useEffect(() => {
        const t = setTimeout(fetchComplaints, 300);
        return () => clearTimeout(t);
    }, [fetchComplaints]);

    const filtered = priorityFilter
        ? complaints.filter(c => c.priority === priorityFilter)
        : complaints;

    const priorities = ['Low', 'Medium', 'High', 'Critical'];

    return (
        <Box>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                <Box>
                    <Typography variant="h5" fontWeight="bold" color="#1a1a2e">
                        Assigned Complaints
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {filtered.length} complaint{filtered.length !== 1 ? 's' : ''} in your department
                    </Typography>
                </Box>
                <Tooltip title="Refresh">
                    <IconButton onClick={fetchComplaints} sx={{ bgcolor: 'white', border: '1px solid #e0e0e0' }}>
                        <RefreshIcon />
                    </IconButton>
                </Tooltip>
            </Box>

            {/* Filters Bar */}
            <Paper elevation={0} sx={{ p: 2.5, mb: 3, borderRadius: 3, border: '1px solid #e8edf2' }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                    <TextField
                        size="small"
                        placeholder="Search by title or category..."
                        value={keyword}
                        onChange={e => setKeyword(e.target.value)}
                        sx={{ flexGrow: 1 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: '#aaa' }} />
                                </InputAdornment>
                            ),
                            sx: { borderRadius: 2 }
                        }}
                    />

                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel>Status</InputLabel>
                        <Select
                            value={statusFilter}
                            label="Status"
                            onChange={e => setStatusFilter(e.target.value)}
                            sx={{ borderRadius: 2 }}
                        >
                            <MenuItem value="">All Status</MenuItem>
                            <MenuItem value="pending">Pending</MenuItem>
                            <MenuItem value="in-progress">In Progress</MenuItem>
                            <MenuItem value="resolved">Resolved</MenuItem>
                            <MenuItem value="rejected">Rejected</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel>Priority</InputLabel>
                        <Select
                            value={priorityFilter}
                            label="Priority"
                            onChange={e => setPriorityFilter(e.target.value)}
                            sx={{ borderRadius: 2 }}
                        >
                            <MenuItem value="">All Priority</MenuItem>
                            {priorities.map(p => (
                                <MenuItem key={p} value={p}>{p}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {(keyword || statusFilter || priorityFilter) && (
                        <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            sx={{ borderRadius: 2, textTransform: 'none', whiteSpace: 'nowrap' }}
                            onClick={() => { setKeyword(''); setStatusFilter(''); setPriorityFilter(''); }}
                        >
                            Clear Filters
                        </Button>
                    )}
                </Stack>
            </Paper>

            {/* Table */}
            <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid #e8edf2', overflow: 'hidden' }}>
                <TableContainer>
                    <Table>
                        <TableHead sx={{ bgcolor: '#f8fafc' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700, color: '#555', fontSize: 12 }}>TRACKING ID</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: '#555', fontSize: 12 }}>TITLE</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: '#555', fontSize: 12 }}>STUDENT</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: '#555', fontSize: 12 }}>CATEGORY</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: '#555', fontSize: 12 }}>PRIORITY</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: '#555', fontSize: 12 }}>STATUS</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: '#555', fontSize: 12 }}>DATE</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: '#555', fontSize: 12 }}>ACTIONS</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                [...Array(5)].map((_, i) => (
                                    <TableRow key={i}>
                                        {[...Array(8)].map((_, j) => (
                                            <TableCell key={j}><Skeleton height={32} /></TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : filtered.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                                        <Box>
                                            <AssignmentIcon sx={{ fontSize: 56, color: '#ddd', mb: 1 }} />
                                            <Typography variant="h6" color="text.secondary" gutterBottom>
                                                No complaints found
                                            </Typography>
                                            <Typography variant="body2" color="text.disabled">
                                                {keyword || statusFilter || priorityFilter
                                                    ? 'Try adjusting your filters'
                                                    : 'No complaints assigned to your department yet'}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filtered.map(c => (
                                    <TableRow key={c._id} hover sx={{ '&:last-child td': { border: 0 } }}>
                                        <TableCell>
                                            <Chip label={c.trackingId || 'N/A'} size="small" color="info" variant="outlined" sx={{ fontWeight: 600 }} />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight={500} noWrap sx={{ maxWidth: 180 }}>
                                                {c.title}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Avatar sx={{ width: 28, height: 28, fontSize: 12, bgcolor: '#e3f2fd', color: '#1565c0' }}>
                                                    {c.studentId?.name?.charAt(0)}
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="body2" fontWeight={500}>{c.studentId?.name || 'Unknown'}</Typography>
                                                    <Typography variant="caption" color="text.secondary">{c.studentId?.email}</Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" noWrap sx={{ maxWidth: 120 }}>{c.category}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip label={c.priority || 'Medium'} size="small" color={priorityColor(c.priority)} />
                                        </TableCell>
                                        <TableCell>
                                            <Chip label={c.status} size="small" color={statusColor(c.status)} />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="caption" color="text.secondary">
                                                {new Date(c.createdAt).toLocaleDateString()}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Stack direction="row" spacing={1}>
                                                <Tooltip title="View & Update">
                                                    <Button
                                                        size="small"
                                                        variant="contained"
                                                        startIcon={<EditIcon />}
                                                        onClick={() => navigate(`/staff/complaints/${c._id}`)}
                                                        sx={{
                                                            textTransform: 'none',
                                                            borderRadius: 2,
                                                            bgcolor: '#1565c0',
                                                            fontSize: 12,
                                                            '&:hover': { bgcolor: '#0d47a1' }
                                                        }}
                                                    >
                                                        Update
                                                    </Button>
                                                </Tooltip>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
};

export default AssignedComplaints;
