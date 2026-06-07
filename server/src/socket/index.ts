import { Server as HttpServer } from 'node:http';
import { Server } from 'socket.io';
import { config } from '../config.js';
import { verifyToken } from '../middleware/auth.js';
import type { ServerToClientEvents, ClientToServerEvents } from '../types/index.js';
import { registerHandlers } from './handlers.js';

export type TypedIO = Server<ClientToServerEvents, ServerToClientEvents>;

let io: TypedIO;

export function setupSocket(httpServer: HttpServer): TypedIO {
  io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
    cors: {
      origin: config.clientUrl,
      credentials: true,
    },
    pingInterval: 10000,
    pingTimeout: 5000,
  });

  // Auth middleware for socket connections
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error('Authentication required'));
    }

    const payload = verifyToken(token);
    if (!payload) {
      return next(new Error('Invalid token'));
    }

    (socket.data as Record<string, unknown>).userId = payload.userId;
    (socket.data as Record<string, unknown>).username = payload.username;
    next();
  });

  io.on('connection', (socket) => {
    const userId = socket.data.userId as string;
    const username = socket.data.username as string;
    console.log(`[Socket] Connected: ${username} (${userId})`);

    registerHandlers(socket, io);

    socket.on('disconnect', () => {
      console.log(`[Socket] Disconnected: ${username} (${userId})`);
    });
  });

  return io;
}

export function getIO(): TypedIO {
  if (!io) throw new Error('Socket.IO not initialized');
  return io;
}
