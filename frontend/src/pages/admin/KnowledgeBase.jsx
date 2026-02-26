import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Paper, TextField, Button, Grid,
    Card, CardContent, IconButton, Stack, Chip, Divider,
    List, ListItem, ListItemText, ListItemSecondaryAction,
    Alert, Skeleton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import SearchIcon from '@mui/icons-material/Search';
import api from '../../utils/api';

const KnowledgeBase = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const fetchDocs = async () => {
        try {
            const res = await api.get('/upload/list');
            setDocuments(res.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocs();
    }, []);

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return;
        setUploading(true);
        setError('');
        setSuccess('');

        const formData = new FormData();
        formData.append('file', file);

        try {
            await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setSuccess('Document uploaded and embedded into AI knowledge base.');
            setFile(null);
            fetchDocs();
        } catch (err) {
            const msg = err.response?.data?.error || err.response?.data?.message || 'Upload failed';
            setError(msg);
            console.error("Upload Error:", err.response?.data);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Remove this document from AI knowledge?')) return;
        try {
            await api.delete(`/upload/${id}`);
            setSuccess('Document removed.');
            fetchDocs();
        } catch (e) {
            setError('Failed to delete document.');
        }
    };

    const filteredDocs = documents.filter(doc =>
        doc.fileName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="bold" color="#1a1a2e" letterSpacing="-1px">
                    Knowledge Base (RAG)
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Upload documents to train the AI chatbot on university policies and guidelines.
                </Typography>
            </Box>

            <Grid container spacing={4}>
                {/* Upload Section */}
                <Grid item xs={12} md={5}>
                    <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid #e2e8f0', bgcolor: 'white' }}>
                        <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>Train AI</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            Supported formats: PDF. Documents are automatically chunked and embedded for the RAG system.
                        </Typography>

                        {success && <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>{success}</Alert>}
                        {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

                        <form onSubmit={handleUpload}>
                            <Box sx={{
                                p: 4, border: '2px dashed #cbd5e1', borderRadius: 3,
                                textAlign: 'center', mb: 3, bgcolor: '#f8fafc',
                                cursor: 'pointer', '&:hover': { bgcolor: '#f1f5f9', borderColor: '#94a3b8' }
                            }} onClick={() => document.getElementById('fileInput').click()}>
                                <input
                                    type="file" id="fileInput" hidden
                                    onChange={(e) => setFile(e.target.files[0])}
                                    accept=".pdf"
                                />
                                <CloudUploadIcon sx={{ fontSize: 48, color: '#94a3b8', mb: 1 }} />
                                <Typography variant="body2" color="text.secondary">
                                    {file ? file.name : 'Click to select or drag PDF file here'}
                                </Typography>
                            </Box>
                            <Button
                                type="submit" variant="contained" fullWidth disabled={!file || uploading}
                                sx={{ borderRadius: 2, py: 1.5, textTransform: 'none', fontWeight: 600 }}
                            >
                                {uploading ? 'Processing & Embedding...' : 'Upload & Synchronize'}
                            </Button>
                        </form>
                    </Paper>
                </Grid>

                {/* Documents List */}
                <Grid item xs={12} md={7}>
                    <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid #e2e8f0', bgcolor: 'white' }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                            <Typography variant="h6" fontWeight="bold">Active Documents</Typography>
                            <TextField
                                size="small" placeholder="Find document..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                InputProps={{
                                    startAdornment: <SearchIcon fontSize="small" color="disabled" sx={{ mr: 1 }} />,
                                    sx: { borderRadius: 2, width: 200 }
                                }}
                            />
                        </Stack>

                        {loading ? (
                            <Stack spacing={2}>{[...Array(3)].map((_, i) => <Skeleton key={i} height={60} />)}</Stack>
                        ) : filteredDocs.length === 0 ? (
                            <Box sx={{ py: 6, textAlign: 'center' }}>
                                <AutoStoriesIcon sx={{ fontSize: 60, color: '#e2e8f0', mb: 2 }} />
                                <Typography color="text.secondary">No documents in the knowledge base.</Typography>
                            </Box>
                        ) : (
                            <List sx={{ p: 0 }}>
                                {filteredDocs.map((doc, i) => (
                                    <React.Fragment key={doc._id}>
                                        <ListItem sx={{ px: 0, py: 2 }}>
                                            <ListItemIcon sx={{ minWidth: 45 }}>
                                                <AutoStoriesIcon color="primary" />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={doc.fileName}
                                                primaryTypographyProps={{ fontWeight: 600, fontSize: 14 }}
                                                secondary={`Chunks: ${doc.chunks?.length || 0} • Uploaded ${new Date(doc.createdAt).toLocaleDateString()}`}
                                                secondaryTypographyProps={{ fontSize: 12 }}
                                            />
                                            <ListItemSecondaryAction>
                                                <IconButton edge="end" color="error" onClick={() => handleDelete(doc._id)}>
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                        {i < filteredDocs.length - 1 && <Divider />}
                                    </React.Fragment>
                                ))}
                            </List>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

// Helper for ListItemIcon since it was missing from imports
const ListItemIcon = ({ children, sx }) => <Box sx={{ display: 'flex', alignItems: 'center', ...sx }}>{children}</Box>;

export default KnowledgeBase;
