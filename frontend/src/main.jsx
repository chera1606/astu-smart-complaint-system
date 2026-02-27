import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { CustomThemeProvider } from './context/ThemeContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { CssBaseline } from '@mui/material'

ReactDOM.createRoot(document.getElementById('root')).render(
    <AuthProvider>
        <CustomThemeProvider>
            <CssBaseline />
            <App />
        </CustomThemeProvider>
    </AuthProvider>
)
