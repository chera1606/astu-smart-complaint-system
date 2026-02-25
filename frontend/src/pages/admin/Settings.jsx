import React from 'react';
import { Box, Typography, Paper, Switch, List, ListItem, ListItemText, ListItemSecondaryAction, Divider, Button, Alert } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import SecurityIcon from '@mui/icons-material/Security';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import StorageIcon from '@mui/icons-material/Storage';

const Settings = () => {
    return (
        <Box maxWidth={800} sx={{ mx: 'auto' }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="bold" color="#1a1a2e" letterSpacing="-1px">
                    System Settings
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Configure global application parameters and administrative preferences.
                </Typography>
            </Box>

            <Alert severity="info" sx={{ mb: 4, borderRadius: 2 }}>
                These settings affect all system users and core infrastructure.
            </Alert>

            <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <List sx={{ p: 0 }}>
                    <ListItem sx={{ py: 3, px: 4 }}>
                        <SecurityIcon sx={{ mr: 3, color: '#1a237e' }} />
                        <ListItemText
                            primary="Two-Factor Authentication"
                            secondary="Enforce 2FA for all administrative accounts for enhanced security."
                            primaryTypographyProps={{ fontWeight: 700 }}
                        />
                        <ListItemSecondaryAction>
                            <Switch edge="end" defaultChecked />
                        </ListItemSecondaryAction>
                    </ListItem>
                    <Divider />

                    <ListItem sx={{ py: 3, px: 4 }}>
                        <NotificationsActiveIcon sx={{ mr: 3, color: '#1a237e' }} />
                        <ListItemText
                            primary="Email Notifications"
                            secondary="Send automated email alerts to staff when new complaints are assigned."
                            primaryTypographyProps={{ fontWeight: 700 }}
                        />
                        <ListItemSecondaryAction>
                            <Switch edge="end" defaultChecked />
                        </ListItemSecondaryAction>
                    </ListItem>
                    <Divider />

                    <ListItem sx={{ py: 3, px: 4 }}>
                        <StorageIcon sx={{ mr: 3, color: '#1a237e' }} />
                        <ListItemText
                            primary="System Maintenance Mode"
                            secondary="Disable student submissions during scheduled maintenance windows."
                            primaryTypographyProps={{ fontWeight: 700 }}
                        />
                        <ListItemSecondaryAction>
                            <Switch edge="end" />
                        </ListItemSecondaryAction>
                    </ListItem>
                    <Divider />

                    <ListItem sx={{ py: 3, px: 4 }}>
                        <SettingsIcon sx={{ mr: 3, color: '#1a237e' }} />
                        <ListItemText
                            primary="AI Chatbot Sensitivity"
                            secondary="Adjust the temperature and strictness of the RAG responses."
                            primaryTypographyProps={{ fontWeight: 700 }}
                        />
                        <Button variant="outlined" size="small" sx={{ borderRadius: 1.5, textTransform: 'none' }}>Configure</Button>
                    </ListItem>
                </List>
            </Paper>

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="contained" size="large" sx={{ borderRadius: 2, px: 4, textTransform: 'none', fontWeight: 700 }}>
                    Save Preferences
                </Button>
            </Box>
        </Box>
    );
};

export default Settings;
