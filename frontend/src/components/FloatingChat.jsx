import React, { useState, useEffect, useRef } from 'react';
import {
    Box, Paper, IconButton, Typography, TextField, Avatar,
    List, ListItem, CircularProgress, Fab, Zoom, Fade, Badge
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import api from '../utils/api';

const FloatingChat = () => {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', text: 'Hi! Ask me anything about ASTU rules.' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [unread, setUnread] = useState(1);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (open) {
            scrollToBottom();
            setUnread(0);
        }
    }, [messages, open]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMsg = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setLoading(true);

        try {
            const res = await api.post('/query', { query: userMsg });
            setMessages(prev => [...prev, { role: 'assistant', text: res.data.data }]);
        } catch (err) {
            setMessages(prev => [...prev, { role: 'assistant', text: 'Sorry, I hit a snag. Try again?' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Floating Button */}
            <Box sx={{ position: 'fixed', bottom: 30, right: 30, zIndex: 2000 }}>
                <Badge badgeContent={unread} color="error" overlap="circular" invisible={unread === 0 || open}>
                    <Fab color="primary" onClick={() => setOpen(!open)} sx={{ boxShadow: 4 }}>
                        {open ? <CloseIcon /> : <ChatIcon />}
                    </Fab>
                </Badge>
            </Box>

            {/* Chat Window */}
            <Zoom in={open}>
                <Paper
                    elevation={10}
                    sx={{
                        position: 'fixed',
                        bottom: 100,
                        right: 30,
                        width: 350,
                        height: 500,
                        zIndex: 2000,
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 3,
                        overflow: 'hidden',
                        bgcolor: '#fff'
                    }}
                >
                    {/* Header */}
                    <Box sx={{ p: 2, bgcolor: '#1976d2', color: '#fff', display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ bgcolor: '#fff', color: '#1976d2', mr: 2 }}>
                            <SmartToyIcon />
                        </Avatar>
                        <Box>
                            <Typography variant="subtitle1" fontWeight="bold" lineHeight={1}>ASTU AI Help</Typography>
                            <Typography variant="caption" sx={{ opacity: 0.8 }}>Always online</Typography>
                        </Box>
                        <Box sx={{ flexGrow: 1 }} />
                        <IconButton size="small" color="inherit" onClick={() => setOpen(false)}>
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </Box>

                    {/* Messages */}
                    <Box sx={{ flexGrow: 1, p: 2, overflowY: 'auto', bgcolor: '#f8f9fa' }}>
                        <List>
                            {messages.map((msg, i) => (
                                <ListItem key={i} sx={{ px: 0, justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', mb: 1.5 }}>
                                    <Paper sx={{
                                        p: 1.5,
                                        maxWidth: '85%',
                                        bgcolor: msg.role === 'user' ? '#1976d2' : '#fff',
                                        color: msg.role === 'user' ? '#fff' : '#333',
                                        borderRadius: 2,
                                        borderBottomRightRadius: msg.role === 'user' ? 0 : 2,
                                        borderBottomLeftRadius: msg.role === 'assistant' ? 0 : 2,
                                        boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                                    }}>
                                        <Typography variant="body2">{msg.text}</Typography>
                                    </Paper>
                                </ListItem>
                            ))}
                            {loading && (
                                <Box sx={{ display: 'flex', gap: 1, ml: 1 }}>
                                    <CircularProgress size={12} />
                                    <Typography variant="caption" color="text.secondary">Thinking...</Typography>
                                </Box>
                            )}
                            <div ref={messagesEndRef} />
                        </List>
                    </Box>

                    {/* Input */}
                    <Box component="form" onSubmit={handleSend} sx={{ p: 2, borderTop: '1px solid #eee', bgcolor: '#fff' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <TextField
                                fullWidth
                                placeholder="Message AI..."
                                variant="outlined"
                                size="small"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                disabled={loading}
                                sx={{ bgcolor: '#f1f3f4' }}
                            />
                            <IconButton color="primary" type="submit" disabled={!input.trim() || loading} sx={{ bgcolor: input.trim() ? '#e3f2fd' : 'transparent' }}>
                                <SendIcon />
                            </IconButton>
                        </Box>
                    </Box>
                </Paper>
            </Zoom>
        </>
    );
};

export default FloatingChat;
