import { useEffect, useCallback } from 'react';
import { connectSocket, getSocket } from '../socket';
import { useAuthStore } from '../store/authStore';

export function useSocket() {
  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    if (token) {
      connectSocket();
    }
  }, [token]);

  const emit = useCallback((event: string, data?: unknown) => {
    const socket = getSocket();
    if (socket?.connected) {
      socket.emit(event, data);
    }
  }, []);

  const isConnected = getSocket()?.connected ?? false;

  return { emit, isConnected, socket: getSocket() };
}
