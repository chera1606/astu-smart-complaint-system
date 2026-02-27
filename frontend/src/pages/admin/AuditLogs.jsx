import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Chip, TextField, InputAdornment, Skeleton, Avatar
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SecurityIcon from '@mui/icons-material/Security';
import api from '../../utils/api';

const actionColor = (action) => ({
    login_success: 'success',
    login_failure: 'error',
    unauthorized_access_attempt: 'warning',
    create_complaint: 'primary',
    update_complaint_status: 'info',
    add_remark: 'default',
    delete_complaint: 'error',
    logout: 'default'
}[action] || 'default');

const formatActionName = (action) => {
    return action.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

const AuditLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [keyword, setKeyword] = useState('');

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const res = await api.get('/audit-logs');
                setLogs(res.data);
            } catch (e) {
                console.error("Failed to fetch audit logs", e);
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    const filteredLogs = logs.filter(log => {
        const matchesKeyword = 
            log.action.toLowerCase().includes(keyword.toLowerCase()) ||
            log.ipAddress.includes(keyword) ||
            log.userId?.email?.toLowerCase().includes(keyword.toLowerCase()) ||
            log.userId?.name?.toLowerCase().includes(keyword.toLowerCase());
        return matchesKeyword;
    });

    return (
        <Box>
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'error.main', width: 56, height: 56 }}>
                    <SecurityIcon fontSize="large" />
                </Avatar>
                <Box>
                    <Typography variant="h4" fontWeight="bold" letterSpacing="-1px">
                        Security Audit Logs
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Monitor system access, actions, and security events.
                    </Typography>
                </Box>
            </Box>

            <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                <TextField
                    fullWidth size="small"
                    placeholder="Search by action, user, email, or IP address..."
                    value={keyword}
                    onChange={e => setKeyword(e.target.value)}
                    InputProps={{
                        startAdornment: <InputAdornment position="start"><SearchIcon color="disabled" /></InputAdornment>,
                        sx: { borderRadius: 2 }
                    }}
                />
            </Paper>

            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
                <Table>
                    <TableHead sx={{ bgcolor: 'background.default' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 700, fontSize: 12, color: 'text.secondary' }}>TIMESTAMP</TableCell>
                            <TableCell sx={{ fontWeight: 700, fontSize: 12, color: 'text.secondary' }}>ACTION</TableCell>
                            <TableCell sx={{ fontWeight: 700, fontSize: 12, color: 'text.secondary' }}>USER</TableCell>
                            <TableCell sx={{ fontWeight: 700, fontSize: 12, color: 'text.secondary' }}>IP ADDRESS</TableCell>
                            <TableCell sx={{ fontWeight: 700, fontSize: 12, color: 'text.secondary' }}>DETAILS</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            [...Array(6)].map((_, i) => (
                                <TableRow key={i}>
                                    {[...Array(5)].map((_, j) => <TableCell key={j}><Skeleton /></TableCell>)}
                                </TableRow>
                            ))
                        ) : filteredLogs.length === 0 ? (
                            <TableRow><TableCell colSpan={5} align="center" sx={{ py: 6, color: 'text.secondary' }}>No audit logs found.</TableCell></TableRow>
                        ) : (
                            filteredLogs.map(log => (
                                <TableRow key={log._id} hover>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight={600}>
                                            {new Date(log.createdAt).toLocaleDateString()}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {new Date(log.createdAt).toLocaleTimeString()}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={formatActionName(log.action)}
                                            size="small"
                                            color={actionColor(log.action)}
                                            variant="outlined"
                                            sx={{ fontWeight: 700 }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {log.userId ? (
                                            <Box>
                                                <Typography variant="body2" fontWeight={500}>{log.userId.name}</Typography>
                                                <Typography variant="caption" color="text.secondary">{log.userId.email}</Typography>
                                            </Box>
                                        ) : (
                                            <Typography variant="body2" color="text.secondary" fontStyle="italic">System / Unauthenticated</Typography>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" fontFamily="monospace" bgcolor="action.hover" display="inline-block" px={1} borderRadius={1}>
                                            {log.ipAddress}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="caption" color="text.secondary" sx={{ maxWidth: 200, display: 'inline-block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {JSON.stringify(log.metadata || {})}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default AuditLogs;
