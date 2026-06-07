import { useCallback } from 'react';
import { useSocket } from './useSocket';
import { useGameStore } from '../store/gameStore';

export function useGame() {
  const { emit } = useSocket();
  const phase = useGameStore((s) => s.phase);
  const round = useGameStore((s) => s.round);
  const totalRounds = useGameStore((s) => s.totalRounds);
  const timer = useGameStore((s) => s.timer);
  const phaseData = useGameStore((s) => s.phaseData);
  const scores = useGameStore((s) => s.scores);
  const gameEndData = useGameStore((s) => s.gameEndData);
  const error = useGameStore((s) => s.error);

  const sendAction = useCallback(
    (type: string, payload?: Record<string, unknown>) => {
      emit('game:action', { type, payload });
    },
    [emit],
  );

  const reset = useGameStore((s) => s.reset);

  return { phase, round, totalRounds, timer, phaseData, scores, gameEndData, error, sendAction, reset };
}
