import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';

export default function Header() {
    return (
        <AppBar position="static">
            <Toolbar>
                <MonitorHeartIcon sx={{ mr: 2 }} />
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    KubeWatch
                </Typography>
            </Toolbar>
        </AppBar>
    );
}
