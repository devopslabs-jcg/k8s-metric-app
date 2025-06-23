// src/components/PodTable.jsx

import React, { useEffect } from 'react'; // <-- useEffect를 임포트합니다.
import { DataGrid } from '@mui/x-data-grid';
import { Chip, Tooltip, Box, CircularProgress } from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import useKubeStore from '../store/kubeStore'; // <-- 스토어를 임포트합니다.
import './PodTable.css'; // <-- CSS 파일을 임포트합니다.

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
    // 스토어에서 깜빡임 제거 액션을 가져옵니다.
    const { clearBlinkEffect } = useKubeStore();

    // Pods 상태가 변경될 때마다 실행됩니다.
    useEffect(() => {
        // isNew 플래그가 true인 Pod들을 찾습니다.
        const newPods = pods.filter(pod => pod.isNew);
        
        // 각 Pod에 대해 15번 깜빡이도록 10초 후에 플래그를 제거합니다.
        newPods.forEach(pod => {
            const timerId = setTimeout(() => {
                // isNew 플래그를 제거하는 스토어 액션을 호출합니다.
                clearBlinkEffect(pod.id);
            }, 10000); // 10초 = 0.5초 * 20번 (약 15번 깜빡임)
            
            // 컴포넌트가 언마운트되거나 의존성이 변경될 때 타이머를 정리합니다.
            return () => clearTimeout(timerId);
        });
    }, [pods, clearBlinkEffect]); // pods 배열이 변경될 때마다 실행

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

    if (loading) {
        return (
            <Box sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ height: '100%', width: '100%' }}>
            <DataGrid
                rows={pods} // <-- 'pods' 배열을 그대로 사용합니다.
                columns={columns}
                loading={loading}
                density="compact"
                // isNew 플래그에 따라 행에 CSS 클래스를 적용합니다.
                getRowClassName={(params) => params.row.isNew ? 'new-pod-row' : ''} // <-- 이 속성을 추가합니다.
                initialState={{
                    sorting: { sortModel: [{ field: 'creation_timestamp', sort: 'desc' }] },
                    pagination: { paginationModel: { pageSize: 15 } }
                }}
                pageSizeOptions={[15, 30, 50]}
            />
        </Box>
    );
}
