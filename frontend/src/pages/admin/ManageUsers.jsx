import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Chip, IconButton, Tooltip, TextField,
    InputAdornment, MenuItem, Avatar, Button, Dialog, DialogTitle,
    DialogContent, DialogActions, Grid, Alert, Skeleton, Stack
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import FilterListIcon from '@mui/icons-material/FilterList';
import api from '../../utils/api';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [keyword, setKeyword] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [editUser, setEditUser] = useState(null);
    const [editData, setEditData] = useState({});
    const [departments, setDepartments] = useState([]);
    const [updateError, setUpdateError] = useState('');

    const fetchData = useCallback(async () => {
        try {
            const [uRes, dRes] = await Promise.all([
                api.get('/users'),
                api.get('/categories')
            ]);
            setUsers(uRes.data);
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

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
        try {
            await api.delete(`/users/${id}`);
            setUsers(users.filter(u => u._id !== id));
        } catch (e) {
            alert('Failed to delete user');
        }
    };

    const handleOpenEdit = (user) => {
        setEditUser(user);
        setEditData({
            name: user.name,
            email: user.email,
            role: user.role,
            departmentId: user.departmentId?._id || user.departmentId || '',
            studentDepartment: user.studentDepartment || '',
            ugrNumber: user.ugrNumber || '',
            dormBlock: user.dormBlock || ''
        });
        setUpdateError('');
    };

    const handleUpdate = async () => {
        try {
            const res = await api.put(`/users/${editUser._id}`, editData);
            setUsers(users.map(u => u._id === editUser._id ? { ...u, ...res.data } : u));
            setEditUser(null);
            fetchData(); // Reload to get populated fields correctly
        } catch (e) {
            setUpdateError(e.response?.data?.message || 'Update failed');
        }
    };

    const filtered = users.filter(u => {
        const matchesKeyword = u.name.toLowerCase().includes(keyword.toLowerCase()) ||
            u.email.toLowerCase().includes(keyword.toLowerCase()) ||
            (u.ugrNumber && u.ugrNumber.toLowerCase().includes(keyword.toLowerCase()));
        const matchesRole = roleFilter ? u.role === roleFilter : true;
        return matchesKeyword && matchesRole;
    });

    return (
        <Box>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" fontWeight="bold" color="#1a1a2e" letterSpacing="-1px">
                    Manage Users
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    View, edit, or remove user accounts from the system.
                </Typography>
            </Box>

            {/* Filters */}
            <Paper elevation={0} sx={{ p: 2, mb: 3, borderRadius: 3, border: '1px solid #e2e8f0' }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={8}>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Search by name, email, or UGR..."
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            InputProps={{
                                startAdornment: <InputAdornment position="start"><SearchIcon color="disabled" /></InputAdornment>,
                                sx: { borderRadius: 2 }
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            select
                            size="small"
                            label="Filter by Role"
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            InputProps={{
                                startAdornment: <InputAdornment position="start"><FilterListIcon color="disabled" /></InputAdornment>,
                                sx: { borderRadius: 2 }
                            }}
                        >
                            <MenuItem value="">All Roles</MenuItem>
                            <MenuItem value="student">Student</MenuItem>
                            <MenuItem value="staff">Staff</MenuItem>
                            <MenuItem value="admin">Admin</MenuItem>
                        </TextField>
                    </Grid>
                </Grid>
            </Paper>

            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#f8fafc' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 700, fontSize: 12, color: '#64748b' }}>USER</TableCell>
                            <TableCell sx={{ fontWeight: 700, fontSize: 12, color: '#64748b' }}>ROLE</TableCell>
                            <TableCell sx={{ fontWeight: 700, fontSize: 12, color: '#64748b' }}>IDENTIFIER (UGR/ID)</TableCell>
                            <TableCell sx={{ fontWeight: 700, fontSize: 12, color: '#64748b' }}>DEPARTMENT</TableCell>
                            <TableCell sx={{ fontWeight: 700, fontSize: 12, color: '#64748b' }}>ACTIONS</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            [...Array(5)].map((_, i) => (
                                <TableRow key={i}>
                                    {[...Array(5)].map((_, j) => <TableCell key={j}><Skeleton /></TableCell>)}
                                </TableRow>
                            ))
                        ) : filtered.length === 0 ? (
                            <TableRow><TableCell colSpan={5} align="center" sx={{ py: 6, color: 'text.secondary' }}>No users found matching your search.</TableCell></TableRow>
                        ) : (
                            filtered.map(u => (
                                <TableRow key={u._id} hover>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <Avatar sx={{ width: 36, height: 36, bgcolor: u.role === 'admin' ? '#ef4444' : u.role === 'staff' ? '#f59e0b' : '#3b82f6' }}>
                                                {u.name.charAt(0)}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="body2" fontWeight={600}>{u.name}</Typography>
                                                <Typography variant="caption" color="text.secondary">{u.email}</Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={u.role.toUpperCase()}
                                            size="small"
                                            sx={{
                                                fontWeight: 800,
                                                fontSize: 10,
                                                bgcolor: u.role === 'admin' ? '#fef2f2' : u.role === 'staff' ? '#fffbeb' : '#eff6ff',
                                                color: u.role === 'admin' ? '#991b1b' : u.role === 'staff' ? '#92400e' : '#1e40af',
                                                border: '1px solid',
                                                borderColor: 'currentColor'
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                                            {u.role === 'student' ? (u.ugrNumber || 'No UGR') : u.userId}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" color="text.secondary">
                                            {u.studentDepartment || u.departmentId?.name || '—'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Stack direction="row" spacing={0.5}>
                                            <Tooltip title="Edit User">
                                                <IconButton size="small" sx={{ color: '#6366f1' }} onClick={() => handleOpenEdit(u)}>
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete User">
                                                <IconButton
                                                    size="small"
                                                    sx={{ color: '#ef4444' }}
                                                    onClick={() => handleDelete(u._id)}
                                                    disabled={u._id === (api.defaults.headers.common['X-User-ID'] || '')} // Prevent self-delete logic if added
                                                >
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

            {/* Edit Dialog */}
            <Dialog open={!!editUser} onClose={() => setEditUser(null)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
                <DialogTitle sx={{ fontWeight: 700 }}>Edit User Profile</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 1 }}>
                        {updateError && <Alert severity="error" sx={{ mb: 2 }}>{updateError}</Alert>}
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth label="Full Name" name="name"
                                    value={editData.name}
                                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth label="Email" name="email"
                                    value={editData.email}
                                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth select label="Role"
                                    value={editData.role}
                                    onChange={(e) => setEditData({ ...editData, role: e.target.value })}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                >
                                    <MenuItem value="student">Student</MenuItem>
                                    <MenuItem value="staff">Staff</MenuItem>
                                    <MenuItem value="admin">Admin</MenuItem>
                                </TextField>
                            </Grid>

                            {editData.role === 'student' && (
                                <>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth label="UGR Number"
                                            value={editData.ugrNumber}
                                            onChange={(e) => setEditData({ ...editData, ugrNumber: e.target.value })}
                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth label="Dorm Block"
                                            value={editData.dormBlock}
                                            onChange={(e) => setEditData({ ...editData, dormBlock: e.target.value })}
                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth label="Department"
                                            value={editData.studentDepartment}
                                            onChange={(e) => setEditData({ ...editData, studentDepartment: e.target.value })}
                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                        />
                                    </Grid>
                                </>
                            )}

                            {editData.role === 'staff' && (
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth select label="Department"
                                        value={editData.departmentId}
                                        onChange={(e) => setEditData({ ...editData, departmentId: e.target.value })}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                    >
                                        <MenuItem value="">Unassigned</MenuItem>
                                        {departments.map(d => <MenuItem key={d._id} value={d._id}>{d.name}</MenuItem>)}
                                    </TextField>
                                </Grid>
                            )}
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setEditUser(null)} sx={{ textTransform: 'none', fontWeight: 600 }}>Cancel</Button>
                    <Button variant="contained" onClick={handleUpdate} sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}>Save Changes</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ManageUsers;
