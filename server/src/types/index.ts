// ── User ──
export interface User {
  id: string;
  username: string;
  email: string | null;
  avatar: string;
  provider: 'guest' | 'google';
  level: number;
  xp: number;
  createdAt: Date;
}

export interface UserPublic {
  id: string;
  username: string;
  avatar: string;
  level: number;
}

// ── Room ──
export type GameType = 'imposter' | 'wordrush' | 'neverhaveiever' | 'wronganswers';
export type RoomStatus = 'waiting' | 'playing' | 'finished';

export interface Room {
  id: string;
  roomCode: string;
  hostId: string;
  gameType: GameType;
  status: RoomStatus;
  maxPlayers: number;
  isPublic: boolean;
  settings: Record<string, unknown>;
  createdAt: Date;
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

// ── Player ──
export interface Player {
  id: string;
  roomId: string;
  userId: string;
  score: number;
  isReady: boolean;
  joinedAt: Date;
}

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

// ── Match ──
export interface Match {
  id: string;
  roomId: string;
  winnerId: string | null;
  gameMode: GameType;
  rounds: number;
  startTime: Date;
  endTime: Date | null;
}

// ── Question ──
export interface Question {
  id: string;
  category: string;
  content: string;
  gameType: GameType;
  difficulty: 'easy' | 'medium' | 'hard';
  metadata: Record<string, unknown>;
}

// ── Friend ──
export type FriendStatus = 'pending' | 'accepted' | 'rejected';

export interface Friend {
  userId: string;
  friendId: string;
  status: FriendStatus;
  createdAt: Date;
}

// ── Chat ──
export interface ChatMessage {
  id: string;
  roomId: string;
  userId: string;
  username: string;
  avatar: string;
  content: string;
  timestamp: number;
}

// ── Socket Events ──
export interface ServerToClientEvents {
  'room:state': (state: RoomState) => void;
  'room:error': (message: string) => void;
  'room:created': (room: RoomState) => void;
  'room:joined': (room: RoomState) => void;
  'room:left': (data: { userId: string; roomCode: string }) => void;
  'room:player-ready': (data: { userId: string; isReady: boolean }) => void;
  'room:disbanded': () => void;

  'game:phase': (data: GamePhaseData) => void;
  'game:state': (data: GameStateData) => void;
  'game:timer': (data: { seconds: number; phase: string }) => void;
  'game:scores': (scores: ScoreEntry[]) => void;
  'game:ended': (data: GameEndData) => void;
  'game:error': (message: string) => void;

  'chat:message': (msg: ChatMessage) => void;
  'chat:typing': (data: { userId: string; username: string; isTyping: boolean }) => void;

  'presence:update': (data: { userId: string; online: boolean }) => void;
}

export interface ClientToServerEvents {
  'room:create': (data: CreateRoomData) => void;
  'room:join': (data: { roomCode: string }) => void;
  'room:leave': () => void;
  'room:ready': (data: { ready: boolean }) => void;
  'room:start': () => void;
  'room:list': () => void;

  'game:action': (data: GameActionData) => void;

  'chat:message': (data: { content: string }) => void;
  'chat:typing': (data: { isTyping: boolean }) => void;
}

// ── Socket data payloads ──
export interface CreateRoomData {
  gameType: GameType;
  isPublic: boolean;
  maxPlayers?: number;
  settings?: Record<string, unknown>;
}

export interface GameActionData {
  type: string;
  payload?: Record<string, unknown>;
}

export interface GamePhaseData {
  phase: string;
  duration?: number;
  data?: Record<string, unknown>;
}

export interface GameStateData {
  phase: string;
  round: number;
  totalRounds: number;
  data: Record<string, unknown>;
}

export interface ScoreEntry {
  userId: string;
  username: string;
  avatar: string;
  score: number;
  delta?: number;
}

export interface GameEndData {
  winnerId: string;
  winnerUsername: string;
  scores: ScoreEntry[];
}

// ── Auth ──
export interface JwtPayload {
  userId: string;
  username: string;
}

export interface AuthResponse {
  token: string;
  user: UserPublic;
}
