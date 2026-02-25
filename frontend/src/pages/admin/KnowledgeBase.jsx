import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Paper, Button, TextField, List, ListItem, ListItemText,
    IconButton, Divider, CircularProgress, Alert, LinearProgress
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DeleteIcon from '@mui/icons-material/Delete';
import DescriptionIcon from '@mui/icons-material/Description';
import api from '../../utils/api';

const KnowledgeBase = () => {
    const [file, setFile] = useState(null);
    const [sourceName, setSourceName] = useState('');
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [items, setItems] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        if (!sourceName && e.target.files[0]) {
            setSourceName(e.target.files[0].name.split('.')[0]);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return setError('Please select a file first.');

        setError(''); setSuccess(''); setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('sourceName', sourceName);

        try {
            const res = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setSuccess(`Success! Indexed ${res.data.count} chunks.`);
            setFile(null); setSourceName('');
            // fetchItems(); // In a real app we'd fetch the list of indexed docs
        } catch (err) {
            setError(err.response?.data?.error || 'Upload failed.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <Box maxWidth={800}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>Knowledge Base Management</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Upload University documents, rules, and guidelines to train the AI Support Chatbot.
                Supported formats: PDF, TXT.
            </Typography>

            <Paper elevation={2} sx={{ p: 4, mb: 4, borderRadius: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Upload New Document</Typography>
                <form onSubmit={handleUpload}>
                    <Box sx={{ border: '2px dashed #ccc', p: 3, textAlign: 'center', borderRadius: 2, mb: 3 }}>
                        <input
                            accept=".pdf,.txt"
                            style={{ display: 'none' }}
                            id="file-upload"
                            type="file"
                            onChange={handleFileChange}
                        />
                        <label htmlFor="file-upload">
                            <Button variant="outlined" component="span" startIcon={<UploadFileIcon />}>
                                Choose File
                            </Button>
                        </label>
                        {file && (
                            <Typography variant="body2" sx={{ mt: 1, color: 'primary.main', fontWeight: 'bold' }}>
                                Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
                            </Typography>
                        )}
                    </Box>

                    <TextField
                        fullWidth
                        label="Source Name (e.g. Student Handbook 2024)"
                        variant="outlined"
                        value={sourceName}
                        onChange={(e) => setSourceName(e.target.value)}
                        sx={{ mb: 3 }}
                    />

                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

                    {uploading && (
                        <Box sx={{ width: '100%', mb: 2 }}>
                            <LinearProgress />
                            <Typography variant="caption" sx={{ mt: 0.5, display: 'block', textAlign: 'center' }}>
                                Extracting text and generating embeddings...
                            </Typography>
                        </Box>
                    )}

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        disabled={!file || uploading}
                        sx={{ py: 1.5 }}
                    >
                        {uploading ? 'Processing...' : 'Upload & Index Document'}
                    </Button>
                </form>
            </Paper>

            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Vector Search Index Details</Typography>
            <Alert severity="info" sx={{ borderRadius: 2 }}>
                The RAG system uses <b>gemini-embedding-001</b> and <b>MongoDB Atlas Vector Search</b>.
                Ensure a "vector_index" is configured on the "knowledgebases" collection.
            </Alert>
        </Box>
    );
};

export default KnowledgeBase;
