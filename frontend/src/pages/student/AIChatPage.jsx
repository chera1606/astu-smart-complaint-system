import React, { useState, useEffect, useRef } from 'react';
import {
    Box, Paper, Typography, TextField, IconButton, List, ListItem,
    Avatar, CircularProgress, Divider, Fade, Tooltip
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import api from '../../utils/api';

const AIChatPage = () => {
    const [messages, setMessages] = useState([
        { role: 'assistant', text: 'Hello! I am the ASTU Smart Assistant. How can I help you today regarding university rules or complaint procedures?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

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
            setMessages(prev => [...prev, { role: 'assistant', text: 'Sorry, I encountered an error. Please try again later.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ height: 'calc(100vh - 150px)', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>ASTU AI Assistant</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Powered by RAG & Gemini. I provide grounded answers based on university documents.
            </Typography>

            <Paper elevation={3} sx={{ flexGrow: 1, mb: 2, p: 2, display: 'flex', flexDirection: 'column', bgcolor: '#fcfcfc', borderRadius: 2, overflow: 'hidden' }}>
                <List sx={{ flexGrow: 1, overflowY: 'auto', p: 1 }}>
                    {messages.map((msg, i) => (
                        <ListItem key={i} sx={{ px: 0, justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', mb: 2 }}>
                            <Box sx={{ display: 'flex', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', alignItems: 'flex-start', maxWidth: '80%' }}>
                                <Avatar sx={{ bgcolor: msg.role === 'user' ? '#1976d2' : '#2e7d32', width: 32, height: 32, mt: 0.5 }}>
                                    {msg.role === 'user' ? <PersonIcon fontSize="small" /> : <SmartToyIcon fontSize="small" />}
                                </Avatar>
                                <Paper sx={{
                                    p: 1.5, ml: msg.role === 'user' ? 0 : 1.5, mr: msg.role === 'user' ? 1.5 : 0,
                                    bgcolor: msg.role === 'user' ? '#e3f2fd' : 'white',
                                    borderRadius: 2, borderBottomLeftRadius: msg.role === 'assistant' ? 0 : 2,
                                    borderBottomRightRadius: msg.role === 'user' ? 0 : 2,
                                    boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                                }}>
                                    <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>{msg.text}</Typography>
                                </Paper>
                            </Box>
                        </ListItem>
                    ))}
                    {loading && (
                        <ListItem sx={{ px: 0 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', ml: 6 }}>
                                <CircularProgress size={16} sx={{ mr: 1 }} />
                                <Typography variant="caption" color="text.secondary italic">AI is thinking...</Typography>
                            </Box>
                        </ListItem>
                    )}
                    <div ref={messagesEndRef} />
                </List>

                <Divider sx={{ my: 1 }} />

                <Box component="form" onSubmit={handleSend} sx={{ display: 'flex', p: 1 }}>
                    <TextField
                        fullWidth
                        placeholder="Ask me anything about ASTU rules..."
                        size="small"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={loading}
                        sx={{ mr: 1 }}
                    />
                    <IconButton color="primary" type="submit" disabled={loading || !input.trim()}>
                        <SendIcon />
                    </IconButton>
                </Box>
            </Paper>
        </Box>
    );
};

export default AIChatPage;
