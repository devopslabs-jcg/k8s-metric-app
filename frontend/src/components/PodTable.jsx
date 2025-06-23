import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Chip, Tooltip, Box } from '@mui/material';
import { formatDistanceToNow } from 'date-fns';

const StatusChip = ({ status }) => {
    const colorMap = {
        'Running': 'success',
        'Succeeded': 'primary',
        'Pending': 'warning',
        'Failed': 'error',
    };
    return <Chip label={status} color={colorMap[status] || 'default'} size="small" variant="outlined" />;
};

export default function PodTable({ pods, loading }) {
    const columns = [
        { field: 'status', headerName: 'Status', width: 120, renderCell: (params) => <StatusChip status={params.value} /> },
        { field: 'name', headerName: 'Name', flex: 2 },
        { field: 'namespace', headerName: 'Namespace', flex: 1 },
        { field: 'node', headerName: 'Node', flex: 1 },
        { field: 'ip', headerName: 'Pod IP', width: 150 },
        {
            field: 'creation_timestamp',
            headerName: 'Age',
            width: 150,
            renderCell: (params) => (
                <Tooltip title={params.value}>
                    <span>{formatDistanceToNow(new Date(params.value), { addSuffix: true })}</span>
                </Tooltip>
            ),
        },
    ];

    return (
        <Box sx={{ height: '100%', width: '100%' }}>
            <DataGrid
                rows={pods.map(pod => ({ id: pod.uid, ...pod }))}
                columns={columns}
                loading={loading}
                density="compact"
                initialState={{
                    sorting: { sortModel: [{ field: 'creation_timestamp', sort: 'desc' }] },
                    pagination: { paginationModel: { pageSize: 15 } }
                }}
                pageSizeOptions={[15, 30, 50]}
            />
        </Box>
    );
}
