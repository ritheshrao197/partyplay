import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../store/authStore';
import { useRoomStore } from '../store/roomStore';
import { useGameStore } from '../store/gameStore';
import { useChatStore } from '../store/chatStore';

let socket: Socket | null = null;
let connecting = false;

export function getSocket(): Socket | null {
  return socket;
}

export function connectSocket(): Socket {
  const token = useAuthStore.getState().token;
  if (!token) throw new Error('No auth token');

  if (socket?.connected) return socket;
  if (connecting && socket) return socket;

  connecting = true;

  const backendUrl = import.meta.env.VITE_API_URL || window.location.origin;

  socket = io(backendUrl, {
    auth: { token },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
  });

  // Register global event listeners
  socket.on('connect', () => {
    connecting = false;
    console.log('[Socket] Connected');
  });

  socket.on('disconnect', (reason) => {
    console.log('[Socket] Disconnected:', reason);
  });

  socket.on('room:state', (state) => {
    useRoomStore.getState().setRoom(state as any);
  });

  socket.on('room:created', (room) => {
    useRoomStore.getState().setRoom(room as any);
  });

  socket.on('room:joined', (room) => {
    useRoomStore.getState().setRoom(room as any);
  });

  socket.on('room:error', (message) => {
    useRoomStore.getState().setError(message);
  });

  socket.on('room:disbanded', () => {
    useRoomStore.getState().clearRoom();
    useGameStore.getState().reset();
  });

  socket.on('game:phase', (data) => {
    useGameStore.getState().setPhase(data.phase, data.duration, data.data);
  });

  socket.on('game:state', (data) => {
    useGameStore.getState().setGameState(data);
  });

  socket.on('game:timer', (data) => {
    useGameStore.getState().setTimer(data.seconds, data.phase);
  });

  socket.on('game:scores', (scores) => {
    useGameStore.getState().setScores(scores as any);
  });

  socket.on('game:ended', (data) => {
    useGameStore.getState().setGameEnd(data as any);
  });

  socket.on('game:error', (message) => {
    useGameStore.getState().setError(message);
  });

  socket.on('chat:message', (msg) => {
    useChatStore.getState().addMessage(msg as any);
  });

  socket.on('chat:typing', (data) => {
    useChatStore.getState().setTyping(data.userId, data.username, data.isTyping);
  });

  return socket;
}

export function disconnectSocket(): void {
  connecting = false;
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
}

// API helper
export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = useAuthStore.getState().token;
  const baseUrl = import.meta.env.VITE_API_URL || '';
  const res = await fetch(`${baseUrl}/api${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || 'Request failed');
  }

  return res.json();
}
