import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Chip, TextField, Button, Alert, IconButton,
    Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, Stack
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ApartmentIcon from '@mui/icons-material/Apartment';
import GroupsIcon from '@mui/icons-material/Groups';
import api from '../../utils/api';

const ManageDepartments = () => {
    const [departments, setDepartments] = useState([]);
    const [users, setUsers] = useState([]);
    const [name, setName] = useState('');
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [editDept, setEditDept] = useState(null);
    const [editName, setEditName] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [dRes, uRes] = await Promise.all([
                api.get('/categories'),
                api.get('/users')
            ]);
            setDepartments(dRes.data);
            setUsers(uRes.data);
        } catch (e) {
            console.error(e);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setSuccess('');
        setError('');
        try {
            const res = await api.post('/categories', { name });
            setSuccess(`Department "${res.data.name}" created successfully.`);
            setName('');
            fetchData();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create department');
        }
    };

    const handleRename = async () => {
        if (!editName.trim()) return;
        try {
            await api.put(`/categories/${editDept._id}`, { name: editName });
            setSuccess(`Department renamed to "${editName}"`);
            setEditDept(null);
            fetchData();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to rename department');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this department? All complaints linked to it might lose their department reference.')) return;
        try {
            await api.delete(`/categories/${id}`);
            setSuccess('Department deleted successfully');
            fetchData();
        } catch (e) {
            setError('Failed to delete department. It might have linked staff.');
        }
    };

    const getStaffCount = (deptId) => {
        return users.filter(u => (u.departmentId?._id || u.departmentId) === deptId).length;
    };

    return (
        <Box maxWidth={1000} sx={{ mx: 'auto' }}>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" fontWeight="bold" color="#1a1a2e" letterSpacing="-1px">
                    Manage Departments
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Configure the departments/categories for complaint routing.
                </Typography>
            </Box>

            <Paper elevation={0} sx={{ p: 4, mb: 4, borderRadius: 3, border: '1px solid #e2e8f0' }}>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2, color: '#4a5568', textTransform: 'uppercase', fontSize: 11 }}>
                    Add New Department
                </Typography>
                {success && <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setSuccess('')}>{success}</Alert>}
                {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setError('')}>{error}</Alert>}

                <form onSubmit={handleCreate}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="e.g., Registrar Office, ICT Directorate, Pro-ctor..."
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                            InputProps={{ sx: { borderRadius: 2 } }}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{ px: 4, borderRadius: 2, textTransform: 'none', fontWeight: 600, whiteSpace: 'nowrap' }}
                        >
                            Create Department
                        </Button>
                    </Stack>
                </form>
            </Paper>

            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#f8fafc' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 700, fontSize: 12, color: '#64748b' }}>ICON</TableCell>
                            <TableCell sx={{ fontWeight: 700, fontSize: 12, color: '#64748b' }}>DEPARTMENT NAME</TableCell>
                            <TableCell sx={{ fontWeight: 700, fontSize: 12, color: '#64748b' }}>INTERNAL ID</TableCell>
                            <TableCell sx={{ fontWeight: 700, fontSize: 12, color: '#64748b' }}>TOTAL STAFF</TableCell>
                            <TableCell sx={{ fontWeight: 700, fontSize: 12, color: '#64748b' }}>ACTIONS</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {departments.map(d => (
                            <TableRow key={d._id} hover>
                                <TableCell>
                                    <ApartmentIcon sx={{ color: '#94a3b8' }} />
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>{d.name}</TableCell>
                                <TableCell>
                                    <Chip label={d.categoryId || 'N/A'} size="small" variant="outlined" sx={{ borderRadius: 1.5, fontWeight: 700 }} />
                                </TableCell>
                                <TableCell>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <GroupsIcon fontSize="small" color="disabled" />
                                        <Typography variant="body2">{getStaffCount(d._id)}</Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell>
                                    <Stack direction="row" spacing={0.5}>
                                        <Tooltip title="Rename">
                                            <IconButton size="small" onClick={() => { setEditDept(d); setEditName(d.name); }} sx={{ color: '#6366f1' }}>
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete">
                                            <IconButton size="small" onClick={() => handleDelete(d._id)} sx={{ color: '#ef4444' }}>
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Rename Dialog */}
            <Dialog open={!!editDept} onClose={() => setEditDept(null)} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: 3 } }}>
                <DialogTitle sx={{ fontWeight: 700 }}>Rename Department</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 1 }}>
                        <TextField
                            fullWidth
                            label="New Name"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            InputProps={{ sx: { borderRadius: 2 } }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setEditDept(null)} sx={{ textTransform: 'none', fontWeight: 600 }}>Cancel</Button>
                    <Button variant="contained" onClick={handleRename} sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}>Save Changes</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ManageDepartments;
