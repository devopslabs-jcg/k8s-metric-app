import { useEffect } from 'react';
import { io } from 'socket.io-client';
import useKubeStore from '../store/kubeStore';

const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
    transports: ['websocket', 'polling']
});

export const useKubeSocket = () => {
    const { handleEvent } = useKubeStore();

    useEffect(() => {
        if (!socket.connected) {
            socket.connect();
        }

        const eventTypes = ['pod_added', 'pod_modified', 'pod_deleted'];
        eventTypes.forEach(type => {
            socket.on(type, (data) => {
                handleEvent(type, data);
            });
        });

        socket.on('connect_error', (err) => {
            console.error("Socket connection error:", err);
        });

        return () => {
            eventTypes.forEach(type => socket.off(type));
            socket.off('connect_error');
        };
    }, [handleEvent]);
};
