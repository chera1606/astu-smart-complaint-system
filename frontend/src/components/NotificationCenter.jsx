import React, { useState, useEffect } from 'react';
import {
    Box, IconButton, Badge, Menu, MenuItem, Typography,
    Divider, List, ListItem, ListItemText, ListItemAvatar,
    Avatar, Button, Fade, Tooltip
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CircleIcon from '@mui/icons-material/Circle';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import UpdateIcon from '@mui/icons-material/Update';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const NotificationCenter = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const navigate = useNavigate();

    const open = Boolean(anchorEl);

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/notifications');
            setNotifications(res.data);
            setUnreadCount(res.data.filter(n => !n.read).length);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 60000); // Check every minute
        return () => clearInterval(interval);
    }, []);

    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const handleMarkAsRead = async (id, link) => {
        try {
            await api.put(`/notifications/${id}/read`);
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
            if (link) {
                navigate(link);
                handleClose();
            }
        } catch (error) {
            console.error('Failed to mark as read:', error);
        }
    };

    const handleClearAll = async () => {
        try {
            await api.delete('/notifications');
            setNotifications([]);
            setUnreadCount(0);
            handleClose();
        } catch (error) {
            console.error('Failed to clear notifications:', error);
        }
    };

    return (
        <Box>
            <Tooltip title="Notifications">
                <IconButton color="inherit" onClick={handleClick}>
                    <Badge badgeContent={unreadCount} color="error">
                        <NotificationsIcon />
                    </Badge>
                </IconButton>
            </Tooltip>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                TransitionComponent={Fade}
                PaperProps={{
                    sx: {
                        width: 360,
                        maxHeight: 480,
                        borderRadius: 3,
                        mt: 1.5,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                        border: '1px solid #e2e8f0'
                    }
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" fontWeight="bold">Notifications</Typography>
                    {notifications.length > 0 && (
                        <Button size="small" onClick={handleClearAll} sx={{ textTransform: 'none' }}>Clear All</Button>
                    )}
                </Box>
                <Divider />

                <List sx={{ p: 0 }}>
                    {notifications.length === 0 ? (
                        <Box sx={{ p: 4, textAlign: 'center' }}>
                            <InfoOutlinedIcon sx={{ fontSize: 40, color: '#cbd5e1', mb: 1 }} />
                            <Typography variant="body2" color="text.secondary">No new notifications</Typography>
                        </Box>
                    ) : (
                        notifications.map((n) => (
                            <MenuItem
                                key={n._id}
                                onClick={() => handleMarkAsRead(n._id, n.link)}
                                sx={{
                                    py: 1.5, px: 2,
                                    bgcolor: n.read ? 'transparent' : '#f0f7ff',
                                    borderBottom: '1px solid #f1f5f9',
                                    whiteSpace: 'normal'
                                }}
                            >
                                <ListItemAvatar sx={{ minWidth: 48 }}>
                                    <Avatar sx={{ bgcolor: n.type === 'complaint_status' ? '#3b82f6' : '#10b981', width: 32, height: 32 }}>
                                        {n.type === 'complaint_status' ? <UpdateIcon fontSize="small" /> : <InfoOutlinedIcon fontSize="small" />}
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={
                                        <Typography variant="subtitle2" fontWeight={n.read ? 600 : 800} sx={{ color: '#1e293b' }}>
                                            {n.title}
                                        </Typography>
                                    }
                                    secondary={
                                        <Box>
                                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                                {n.message}
                                            </Typography>
                                            <Typography variant="caption" color="#94a3b8">
                                                {new Date(n.createdAt).toLocaleString()}
                                            </Typography>
                                        </Box>
                                    }
                                />
                                {!n.read && <CircleIcon sx={{ fontSize: 10, color: '#3b82f6', ml: 1 }} />}
                            </MenuItem>
                        ))
                    )}
                </List>
            </Menu>
        </Box>
    );
};

export default NotificationCenter;
