import { useCallback } from 'react';
import { useSocket } from './useSocket';
import { useRoomStore, type GameType } from '../store/roomStore';

export function useRoom() {
  const { emit } = useSocket();
  const room = useRoomStore((s) => s.room);
  const error = useRoomStore((s) => s.error);

  const createRoom = useCallback(
    (gameType: GameType, isPublic: boolean, maxPlayers?: number) => {
      emit('room:create', { gameType, isPublic, maxPlayers });
    },
    [emit],
  );

  const joinRoom = useCallback(
    (roomCode: string) => {
      emit('room:join', { roomCode: roomCode.toUpperCase() });
    },
    [emit],
  );

  const leaveRoom = useCallback(() => {
    emit('room:leave');
  }, [emit]);

  const toggleReady = useCallback(
    (ready: boolean) => {
      emit('room:ready', { ready });
    },
    [emit],
  );

  const startGame = useCallback(() => {
    emit('room:start');
  }, [emit]);

  return { room, error, createRoom, joinRoom, leaveRoom, toggleReady, startGame };
}
