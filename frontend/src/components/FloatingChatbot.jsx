import React, { useState, useRef, useEffect } from 'react';
import {
    Box, Fab, Paper, Typography, TextField, IconButton,
    Stack, Avatar, Zoom, CircularProgress, Tooltip,
    Divider, Chip
} from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import MessageIcon from '@mui/icons-material/Message';
import api from '../utils/api';

const FloatingChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([
        { role: 'assistant', text: 'Hi! I am your ASTU Assistant. How can I help you today?' }
    ]);
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [chat]);

    const handleSend = async () => {
        if (!message.trim() || loading) return;

        const userMsg = message.trim();
        setChat(prev => [...prev, { role: 'user', text: userMsg }]);
        setMessage('');
        setLoading(true);

        try {
            const res = await api.post('/query', { query: userMsg });
            setChat(prev => [...prev, { role: 'assistant', text: res.data.data }]);
        } catch (error) {
            setChat(prev => [...prev, { role: 'assistant', text: 'Sorry, I am having trouble connecting. Please try again later.' }]);
        } finally {
            setLoading(false);
        }
    };

    const suggestedQuestions = [
        "How to submit a complaint?",
        "Dormitory issues",
        "Grade tracking"
    ];

    return (
        <Box sx={{ position: 'fixed', bottom: 30, right: 30, zIndex: 2000 }}>
            {/* Chat Window */}
            <Zoom in={isOpen}>
                <Paper elevation={12} sx={{
                    position: 'absolute', bottom: 80, right: 0,
                    width: { xs: 'calc(100vw - 60px)', sm: 380 },
                    height: 500,
                    display: 'flex', flexDirection: 'column',
                    borderRadius: 4, overflow: 'hidden',
                    boxShadow: '0 12px 48px rgba(0,0,0,0.15)',
                    border: '1px solid #e2e8f0'
                }}>
                    {/* Header */}
                    <Box sx={{
                        p: 2,
                        bgcolor: '#1565c0',
                        color: 'white',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 32, height: 32 }}>
                                <SmartToyIcon fontSize="small" />
                            </Avatar>
                            <Box>
                                <Typography variant="subtitle1" fontWeight="bold" lineHeight={1.2}>ASTU Assistant</Typography>
                                <Typography variant="caption" sx={{ opacity: 0.8 }}>AI-Powered Support</Typography>
                            </Box>
                        </Stack>
                        <IconButton size="small" color="inherit" onClick={() => setIsOpen(false)}>
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </Box>

                    {/* Messages */}
                    <Box ref={scrollRef} sx={{ flexGrow: 1, p: 2, overflowY: 'auto', bgcolor: '#f8fafc' }}>
                        <Stack spacing={2}>
                            {chat.map((msg, i) => (
                                <Box key={i} sx={{
                                    alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                    maxWidth: '85%'
                                }}>
                                    <Paper sx={{
                                        p: 1.5,
                                        borderRadius: msg.role === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                                        bgcolor: msg.role === 'user' ? '#1565c0' : 'white',
                                        color: msg.role === 'user' ? 'white' : '#1e293b',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                        border: msg.role === 'user' ? 'none' : '1px solid #e2e8f0'
                                    }}>
                                        <Typography variant="body2">{msg.text}</Typography>
                                    </Paper>
                                </Box>
                            ))}
                            {loading && (
                                <Box sx={{ alignSelf: 'flex-start', ml: 1 }}>
                                    <CircularProgress size={20} thickness={6} sx={{ color: '#94a3b8' }} />
                                </Box>
                            )}
                        </Stack>
                    </Box>

                    {/* Suggestions */}
                    {!chat.some(m => m.role === 'user') && (
                        <Box sx={{ px: 2, pb: 2, bgcolor: '#f8fafc' }}>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>Try asking:</Typography>
                            <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                                {suggestedQuestions.map((q, i) => (
                                    <Chip
                                        key={i} label={q} size="small"
                                        onClick={() => { setMessage(q); }}
                                        sx={{ cursor: 'pointer', bgcolor: 'white', border: '1px solid #e2e8f0' }}
                                    />
                                ))}
                            </Stack>
                        </Box>
                    )}

                    <Divider />

                    {/* Input */}
                    <Box sx={{ p: 1.5, display: 'flex', gap: 1, alignItems: 'center', bgcolor: 'white' }}>
                        <TextField
                            fullWidth size="small" placeholder="Type a message..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            autoComplete="off"
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 10 } }}
                        />
                        <IconButton
                            color="primary"
                            disabled={!message.trim() || loading}
                            onClick={handleSend}
                            sx={{
                                bgcolor: message.trim() ? '#1565c0' : 'transparent',
                                color: message.trim() ? 'white' : 'inherit',
                                '&:hover': { bgcolor: '#0d47a1' }
                            }}
                        >
                            <SendIcon fontSize="small" />
                        </IconButton>
                    </Box>
                </Paper>
            </Zoom>

            {/* Toggle Button */}
            <Tooltip title={isOpen ? "Close Assistant" : "Need help?"}>
                <Fab
                    color="primary"
                    onClick={() => setIsOpen(!isOpen)}
                    sx={{
                        width: 60, height: 60,
                        background: 'linear-gradient(135deg, #1565c0 0%, #1e40af 100%)',
                        boxShadow: '0 8px 32px rgba(21, 101, 192, 0.4)'
                    }}
                >
                    {isOpen ? <CloseIcon /> : <SmartToyIcon sx={{ fontSize: 30 }} />}
                </Fab>
            </Tooltip>
        </Box>
    );
};

export default FloatingChatbot;
