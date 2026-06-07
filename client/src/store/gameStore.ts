import { create } from 'zustand';

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

interface GameState {
  phase: string;
  round: number;
  totalRounds: number;
  timer: number;
  timerPhase: string;
  phaseData: Record<string, unknown>;
  scores: ScoreEntry[];
  gameEndData: GameEndData | null;
  error: string | null;

  setPhase: (phase: string, duration?: number, data?: Record<string, unknown>) => void;
  setGameState: (state: { phase: string; round: number; totalRounds: number; data: Record<string, unknown> }) => void;
  setTimer: (seconds: number, phase: string) => void;
  setScores: (scores: ScoreEntry[]) => void;
  setGameEnd: (data: GameEndData) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  phase: '',
  round: 0,
  totalRounds: 0,
  timer: 0,
  timerPhase: '',
  phaseData: {},
  scores: [],
  gameEndData: null,
  error: null,
};

export const useGameStore = create<GameState>()((set) => ({
  ...initialState,

  setPhase: (phase, duration, data) =>
    set({
      phase,
      timer: duration || 0,
      timerPhase: phase,
      phaseData: data || {},
    }),

  setGameState: (state) =>
    set({
      phase: state.phase,
      round: state.round,
      totalRounds: state.totalRounds,
      phaseData: state.data,
    }),

  setTimer: (seconds, phase) => set({ timer: seconds, timerPhase: phase }),

  setScores: (scores) => set({ scores }),

  setGameEnd: (data) => set({ gameEndData: data, phase: 'ended' }),

  setError: (error) => set({ error }),

  reset: () => set(initialState),
}));
