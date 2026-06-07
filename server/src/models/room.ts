import { query } from '../database/index.js';
import type { Room, GameType, RoomStatus } from '../types/index.js';
import { v4 as uuid } from 'uuid';

function mapRoomRow(r: Record<string, unknown>): Room {
  return {
    id: r.id as string,
    roomCode: r.room_code as string,
    hostId: r.host_id as string,
    gameType: r.game_type as GameType,
    status: r.status as RoomStatus,
    maxPlayers: r.max_players as number,
    isPublic: r.is_public as boolean,
    settings: (r.settings ?? {}) as Record<string, unknown>,
    createdAt: r.created_at as Date,
  };
}

function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export async function createRoom(
  hostId: string,
  gameType: GameType,
  maxPlayers: number,
  isPublic: boolean,
  settings: Record<string, unknown> = {}
): Promise<Room> {
  const id = uuid();
  const roomCode = generateRoomCode();

  const { rows } = await query(
    `INSERT INTO rooms (id, room_code, host_id, game_type, max_players, is_public, settings)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [id, roomCode, hostId, gameType, maxPlayers, isPublic, JSON.stringify(settings)]
  );
  return mapRoomRow(rows[0]);
}

export async function getRoomByCode(code: string): Promise<Room | null> {
  const { rows } = await query('SELECT * FROM rooms WHERE room_code = $1', [code.toUpperCase()]);
  return rows[0] ? mapRoomRow(rows[0]) : null;
}

export async function getRoomById(id: string): Promise<Room | null> {
  const { rows } = await query('SELECT * FROM rooms WHERE id = $1', [id]);
  return rows[0] ? mapRoomRow(rows[0]) : null;
}

export async function updateRoomStatus(roomId: string, status: RoomStatus): Promise<void> {
  await query('UPDATE rooms SET status = $1 WHERE id = $2', [status, roomId]);
}

export async function updateRoomHost(roomId: string, newHostId: string): Promise<void> {
  await query('UPDATE rooms SET host_id = $1 WHERE id = $2', [newHostId, roomId]);
}

export async function deleteRoom(roomId: string): Promise<void> {
  await query('DELETE FROM rooms WHERE id = $1', [roomId]);
}

export async function listPublicRooms(gameType?: GameType): Promise<Room[]> {
  let sql = `SELECT r.*, COUNT(p.id) as player_count FROM rooms r LEFT JOIN players p ON r.id = p.room_id WHERE r.status = 'waiting' AND r.is_public = true`;
  const params: unknown[] = [];

  if (gameType) {
    params.push(gameType);
    sql += ` AND r.game_type = $${params.length}`;
  }

  sql += ` GROUP BY r.id ORDER BY r.created_at DESC LIMIT 50`;
  const { rows } = await query(sql, params);
  return rows.map(mapRoomRow);
}
