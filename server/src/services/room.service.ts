import * as roomModel from '../models/room.js';
import * as playerModel from '../models/player.js';
import type { RoomState, CreateRoomData, GameType } from '../types/index.js';
import type { TypedIO } from '../socket/index.js';
import { gameManager } from '../game-engine/GameManager.js';

const MAX_PLAYERS: Record<GameType, number> = {
  imposter: 12,
  wordrush: 20,
  neverhaveiever: 20,
  wronganswers: 12,
};

const MIN_PLAYERS: Record<GameType, number> = {
  imposter: 4,
  wordrush: 2,
  neverhaveiever: 2,
  wronganswers: 2,
};

class RoomService {
  async createRoom(hostId: string, hostUsername: string, data: CreateRoomData): Promise<RoomState> {
    const maxPlayers = data.maxPlayers || MAX_PLAYERS[data.gameType];

    const room = await roomModel.createRoom(hostId, data.gameType, maxPlayers, data.isPublic, data.settings);

    // Add host as first player
    await playerModel.addPlayer(room.id, hostId);

    return this.getRoomState(room.roomCode) as Promise<RoomState>;
  }

  async joinRoom(roomCode: string, userId: string, _username: string): Promise<RoomState> {
    const code = roomCode.toUpperCase();
    const room = await roomModel.getRoomByCode(code);

    if (!room) throw new Error('Room not found');
    if (room.status !== 'waiting') throw new Error('Game already in progress');

    const count = await playerModel.getPlayerCount(room.id);
    if (count >= room.maxPlayers) throw new Error('Room is full');

    await playerModel.addPlayer(room.id, userId);
    return this.getRoomState(code) as Promise<RoomState>;
  }

  async leaveRoom(roomCode: string, userId: string): Promise<{ disbanded: boolean }> {
    const room = await roomModel.getRoomByCode(roomCode);
    if (!room) return { disbanded: false };

    await playerModel.removePlayer(room.id, userId);

    const remainingPlayers = await playerModel.getPlayerCount(room.id);

    // If no players left, disband room
    if (remainingPlayers === 0) {
      await roomModel.deleteRoom(room.id);
      return { disbanded: true };
    }

    // If host left, assign new host
    if (room.hostId === userId) {
      const players = await playerModel.getPlayersByRoom(room.id);
      if (players.length > 0) {
        await roomModel.updateRoomHost(room.id, players[0].userId);
      }
    }

    return { disbanded: false };
  }

  async toggleReady(roomCode: string, userId: string, ready: boolean): Promise<void> {
    const room = await roomModel.getRoomByCode(roomCode);
    if (!room) throw new Error('Room not found');

    await playerModel.togglePlayerReady(room.id, userId, ready);
  }

  async getRoomState(roomCode: string): Promise<RoomState | null> {
    const room = await roomModel.getRoomByCode(roomCode);
    if (!room) return null;

    const players = await playerModel.getPlayerStates(room.id, room.hostId);

    return {
      id: room.id,
      roomCode: room.roomCode,
      hostId: room.hostId,
      gameType: room.gameType,
      status: room.status,
      maxPlayers: room.maxPlayers,
      isPublic: room.isPublic,
      settings: room.settings,
      players,
    };
  }

  async startGame(roomCode: string, userId: string, io: TypedIO): Promise<void> {
    const room = await roomModel.getRoomByCode(roomCode);
    if (!room) throw new Error('Room not found');
    if (room.hostId !== userId) throw new Error('Only the host can start the game');

    const players = await playerModel.getPlayersByRoom(room.id);
    const minPlayers = MIN_PLAYERS[room.gameType];

    if (players.length < minPlayers) {
      throw new Error(`Need at least ${minPlayers} players to start`);
    }

    // Check all non-host players are ready
    const allReady = await playerModel.areAllPlayersReady(room.id);
    if (!allReady) throw new Error('Not all players are ready');

    await roomModel.updateRoomStatus(room.id, 'playing');
    await playerModel.resetPlayerScores(room.id);

    const updatedRoom = await this.getRoomState(roomCode);
    if (updatedRoom) {
      io.to(roomCode).emit('room:state', updatedRoom);
    }

    // Start the game engine
    gameManager.startGame(roomCode, room.id, room.gameType, io);
  }

  async listPublicRooms(): Promise<RoomState[]> {
    const rooms = await roomModel.listPublicRooms();
    const states: RoomState[] = [];

    for (const room of rooms) {
      const state = await this.getRoomState(room.roomCode);
      if (state) states.push(state);
    }

    return states;
  }
}

export const roomService = new RoomService();
