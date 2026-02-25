import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, Chip, Stack, LinearProgress, Divider } from '@mui/material';
import api from '../../utils/api';
import PieChartIcon from '@mui/icons-material/PieChart';
import BarChartIcon from '@mui/icons-material/BarChart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AssignmentIcon from '@mui/icons-material/Assignment';

const Analytics = () => {
    const [analytics, setAnalytics] = useState(null);

    useEffect(() => {
        api.get('/complaints/analytics').then(r => setAnalytics(r.data)).catch(console.error);
    }, []);

    if (!analytics) return (
        <Box sx={{ p: 4, textAlign: 'center' }}>
            <LinearProgress sx={{ borderRadius: 5, height: 6 }} />
            <Typography sx={{ mt: 2 }}>Loading statistical data...</Typography>
        </Box>
    );

    const mainKpis = [
        { label: 'Total Intake', value: analytics.totalComplaints, color: '#1a237e', icon: <AssignmentIcon /> },
        { label: 'Resolution Rate', value: `${analytics.resolutionRate}%`, color: '#2e7d32', icon: <TrendingUpIcon /> },
        { label: 'Unresolved', value: analytics.pendingComplaints + (analytics.inProgressComplaints || 0), color: '#c62828', icon: <PieChartIcon /> },
    ];

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="bold" color="#1a1a2e" letterSpacing="-1px">
                    System Analytics
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Real-time performance metrics and distribution charts.
                </Typography>
            </Box>

            {/* Top KPIs */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {mainKpis.map((kpi, i) => (
                    <Grid item xs={12} md={4} key={i}>
                        <Paper elevation={0} sx={{
                            p: 3, borderRadius: 3, border: '1px solid #e2e8f0',
                            display: 'flex', alignItems: 'center', gap: 2,
                            bgcolor: 'white'
                        }}>
                            <Box sx={{
                                p: 1.5, borderRadius: 2, bgcolor: `${kpi.color}10`, color: kpi.color,
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                {kpi.icon}
                            </Box>
                            <Box>
                                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>{kpi.label}</Typography>
                                <Typography variant="h4" fontWeight="bold" color={kpi.color}>{kpi.value}</Typography>
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={3}>
                {/* Distribution by Category */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0', height: '100%' }}>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
                            <BarChartIcon color="primary" />
                            <Typography variant="h6" fontWeight="bold">Category Distribution</Typography>
                        </Stack>
                        <Divider sx={{ mb: 3 }} />
                        <Box>
                            {analytics.byCategory?.map((c, i) => {
                                const percent = (c.count / analytics.totalComplaints) * 100;
                                return (
                                    <Box key={i} sx={{ mb: 3 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography variant="body2" fontWeight={600}>{c._id}</Typography>
                                            <Typography variant="body2" color="text.secondary">{c.count} ({percent.toFixed(1)}%)</Typography>
                                        </Box>
                                        <LinearProgress
                                            variant="determinate"
                                            value={percent}
                                            sx={{ height: 8, borderRadius: 4, bgcolor: '#f1f5f9', '& .MuiLinearProgress-bar': { borderRadius: 4, bgcolor: '#6366f1' } }}
                                        />
                                    </Box>
                                );
                            })}
                        </Box>
                    </Paper>
                </Grid>

                {/* Distribution by Department */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0', height: '100%' }}>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
                            <TrendingUpIcon color="success" />
                            <Typography variant="h6" fontWeight="bold">Departmental Performance</Typography>
                        </Stack>
                        <Divider sx={{ mb: 3 }} />
                        <Box>
                            {analytics.byDepartment?.length > 0 ? (
                                analytics.byDepartment.map((d, i) => {
                                    const percent = (d.count / analytics.totalComplaints) * 100;
                                    return (
                                        <Box key={i} sx={{ mb: 3 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                <Typography variant="body2" fontWeight={600}>{d.departmentName || 'Unknown'}</Typography>
                                                <Stack direction="row" spacing={1}>
                                                    <Chip label={`${d.count} issues`} size="small" sx={{ fontSize: 10, height: 18 }} />
                                                </Stack>
                                            </Box>
                                            <LinearProgress
                                                variant="determinate"
                                                value={percent}
                                                sx={{ height: 8, borderRadius: 4, bgcolor: '#f1f5f9', '& .MuiLinearProgress-bar': { borderRadius: 4, bgcolor: '#10b981' } }}
                                            />
                                        </Box>
                                    );
                                })
                            ) : (
                                <Typography color="text.secondary" align="center" sx={{ py: 4 }}>Insufficient data for departmental analysis.</Typography>
                            )}
                        </Box>
                    </Paper>
                </Grid>

                {/* Resolution Overview Card */}
                <Grid item xs={12}>
                    <Paper elevation={0} sx={{
                        p: 4, borderRadius: 3, border: '1px solid #e2e8f0',
                        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                        display: 'flex', flexDirection: 'column', alignItems: 'center'
                    }}>
                        <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>Global Resolution Goal</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>We aim for a 95% resolution rate across all university departments.</Typography>

                        <Box sx={{ position: 'relative', display: 'inline-flex', mb: 2 }}>
                            <Box sx={{
                                width: 200, height: 200, borderRadius: '50%',
                                background: `conic-gradient(#10b981 0% ${analytics.resolutionRate}%, #e2e8f0 ${analytics.resolutionRate}% 100%)`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: 'inset 0 0 10px rgba(0,0,0,0.05)'
                            }}>
                                <Box sx={{
                                    width: 160, height: 160, borderRadius: '50%', bgcolor: 'white',
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <Typography variant="h3" fontWeight="bold" color="#10b981">{analytics.resolutionRate}%</Typography>
                                    <Typography variant="caption" sx={{ fontWeight: 700, opacity: 0.6 }}>COMPLETE</Typography>
                                </Box>
                            </Box>
                        </Box>

                        <Grid container spacing={4} sx={{ mt: 2, maxWidth: 600 }}>
                            <Grid item xs={4} textAlign="center">
                                <Typography variant="h5" fontWeight="bold">{analytics.resolvedComplaints}</Typography>
                                <Typography variant="caption" color="text.secondary">RESOLVED</Typography>
                            </Grid>
                            <Grid item xs={4} textAlign="center">
                                <Typography variant="h5" fontWeight="bold">{analytics.pendingComplaints}</Typography>
                                <Typography variant="caption" color="text.secondary">PENDING</Typography>
                            </Grid>
                            <Grid item xs={4} textAlign="center">
                                <Typography variant="h5" fontWeight="bold">{analytics.inProgressComplaints || 0}</Typography>
                                <Typography variant="caption" color="text.secondary">IN PROGRESS</Typography>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Analytics;
