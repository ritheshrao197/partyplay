import { Socket } from 'socket.io';
import type { TypedIO } from './index.js';
import type { ClientToServerEvents, ServerToClientEvents } from '../types/index.js';
import { roomService } from '../services/room.service.js';
import { chatService } from '../services/chat.js';
import { presenceService } from '../services/presence.js';
import { gameManager } from '../game-engine/GameManager.js';

type SocketType = Socket<ClientToServerEvents, ServerToClientEvents>;

export function registerHandlers(socket: SocketType, io: TypedIO): void {
  const userId = socket.data.userId as string;
  const username = socket.data.username as string;

  // Set user online
  presenceService.setOnline(userId, socket.id);

  // ── Room Events ──

  socket.on('room:create', async (data) => {
    try {
      const room = await roomService.createRoom(userId, username, data);
      socket.join(room.roomCode);
      socket.data.roomCode = room.roomCode;
      socket.emit('room:created', room);
    } catch (err) {
      socket.emit('room:error', (err as Error).message);
    }
  });

  socket.on('room:join', async (data) => {
    try {
      const room = await roomService.joinRoom(data.roomCode, userId, username);
      socket.join(room.roomCode);
      socket.data.roomCode = room.roomCode;
      socket.emit('room:joined', room);
      io.to(room.roomCode).emit('room:state', room);
    } catch (err) {
      socket.emit('room:error', (err as Error).message);
    }
  });

  socket.on('room:leave', async () => {
    const roomCode = socket.data.roomCode as string;
    if (!roomCode) return;

    try {
      const result = await roomService.leaveRoom(roomCode, userId);
      socket.leave(roomCode);
      socket.data.roomCode = undefined;

      if (result.disbanded) {
        io.to(roomCode).emit('room:disbanded');
      } else {
        io.to(roomCode).emit('room:left', { userId, roomCode });
        const updatedRoom = await roomService.getRoomState(roomCode);
        if (updatedRoom) io.to(roomCode).emit('room:state', updatedRoom);
      }
    } catch (err) {
      socket.emit('room:error', (err as Error).message);
    }
  });

  socket.on('room:ready', async (data) => {
    const roomCode = socket.data.roomCode as string;
    if (!roomCode) return;

    try {
      await roomService.toggleReady(roomCode, userId, data.ready);
      io.to(roomCode).emit('room:player-ready', { userId, isReady: data.ready });
      const updatedRoom = await roomService.getRoomState(roomCode);
      if (updatedRoom) io.to(roomCode).emit('room:state', updatedRoom);
    } catch (err) {
      socket.emit('room:error', (err as Error).message);
    }
  });

  socket.on('room:start', async () => {
    const roomCode = socket.data.roomCode as string;
    if (!roomCode) return;

    try {
      await roomService.startGame(roomCode, userId, io);
    } catch (err) {
      socket.emit('room:error', (err as Error).message);
    }
  });

  socket.on('room:list', async () => {
    try {
      const rooms = await roomService.listPublicRooms();
      socket.emit('room:state', rooms as any);
    } catch (err) {
      socket.emit('room:error', (err as Error).message);
    }
  });

  // ── Game Events ──

  socket.on('game:action', async (data) => {
    const roomCode = socket.data.roomCode as string;
    if (!roomCode) return;

    try {
      await gameManager.handleAction(roomCode, userId, data, io);
    } catch (err) {
      socket.emit('game:error', (err as Error).message);
    }
  });

  // ── Chat Events ──

  socket.on('chat:message', async (data) => {
    const roomCode = socket.data.roomCode as string;
    if (!roomCode) return;

    const msg = chatService.createMessage(roomCode, userId, username, data.content);
    io.to(roomCode).emit('chat:message', msg);
  });

  socket.on('chat:typing', (data) => {
    const roomCode = socket.data.roomCode as string;
    if (!roomCode) return;

    socket.to(roomCode).emit('chat:typing', { userId, username, isTyping: data.isTyping });
  });

  // ── Disconnect ──

  socket.on('disconnect', async () => {
    presenceService.setOffline(userId);
    const roomCode = socket.data.roomCode as string;
    if (roomCode) {
      // Don't immediately remove - give grace period for reconnection
      setTimeout(async () => {
        const isReconnected = presenceService.isOnline(userId);
        if (!isReconnected) {
          try {
            const result = await roomService.leaveRoom(roomCode, userId);
            if (result.disbanded) {
              io.to(roomCode).emit('room:disbanded');
            } else {
              const updatedRoom = await roomService.getRoomState(roomCode);
              if (updatedRoom) io.to(roomCode).emit('room:state', updatedRoom);
            }
          } catch {
            // Room may already be disbanded
          }
        }
      }, 30000); // 30s grace period
    }
  });
}
