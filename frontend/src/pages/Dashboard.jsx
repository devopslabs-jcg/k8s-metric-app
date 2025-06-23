import React, { useEffect, useState } from 'react';
import useKubeStore from '../store/kubeStore';
import apiClient from '../api/apiClient';
import { useKubeSocket } from '../hooks/useKubeSocket';
import { Typography, Container, Paper, Alert } from '@mui/material';
import PodTable from '../components/PodTable';

export default function Dashboard() {
    const { pods, initialize } = useKubeStore();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 커스텀 훅으로 WebSocket 로직 관리
    useKubeSocket();

    useEffect(() => {
        apiClient.get('/initial-pods')
            .then(res => initialize(res.data))
            .catch(err => setError("Failed to fetch initial data. Is the backend running?"))
            .finally(() => setLoading(false));
    }, [initialize]);

    if (error) {
        return <Alert severity="error" sx={{ m: 4 }}>{error}</Alert>;
    }

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 'calc(100vh - 128px)' }}>
                <Typography variant="h6" component="h2" gutterBottom>Live Pod Status</Typography>
                <PodTable pods={pods} loading={loading} />
            </Paper>
        </Container>
    );
}
