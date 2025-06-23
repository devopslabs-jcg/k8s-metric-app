import React from 'react';
import { Box } from '@mui/material';
import Header from '../components/Header';

export default function MainLayout({ children }) {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <Header />
            <Box component="main" sx={{ flexGrow: 1, overflow: 'auto' }}>
                {children}
            </Box>
        </Box>
    );
}
