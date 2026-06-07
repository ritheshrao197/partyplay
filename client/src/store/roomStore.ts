import { create } from 'zustand';

export type GameType = 'imposter' | 'wordrush' | 'neverhaveiever' | 'wronganswers';
export type RoomStatus = 'waiting' | 'playing' | 'finished';

export interface PlayerState {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  score: number;
  isReady: boolean;
  isHost: boolean;
  isConnected: boolean;
}

export interface RoomState {
  id: string;
  roomCode: string;
  hostId: string;
  gameType: GameType;
  status: RoomStatus;
  maxPlayers: number;
  isPublic: boolean;
  settings: Record<string, unknown>;
  players: PlayerState[];
}

interface RoomStoreState {
  room: RoomState | null;
  error: string | null;
  setRoom: (room: RoomState | null) => void;
  setError: (error: string | null) => void;
  clearRoom: () => void;
}

export const useRoomStore = create<RoomStoreState>()((set) => ({
  room: null,
  error: null,
  setRoom: (room) => set({ room, error: null }),
  setError: (error) => set({ error }),
  clearRoom: () => set({ room: null, error: null }),
}));
