import { query } from '../database/index.js';
import type { Player, PlayerState } from '../types/index.js';
import { v4 as uuid } from 'uuid';

function mapPlayerRow(r: Record<string, unknown>): Player {
  return {
    id: r.id as string,
    roomId: r.room_id as string,
    userId: r.user_id as string,
    score: r.score as number,
    isReady: r.is_ready as boolean,
    joinedAt: r.joined_at as Date,
  };
}

export async function addPlayer(roomId: string, userId: string): Promise<Player> {
  const id = uuid();
  const { rows } = await query(
    `INSERT INTO players (id, room_id, user_id) VALUES ($1, $2, $3)
     ON CONFLICT (room_id, user_id) DO UPDATE SET is_ready = false, score = 0
     RETURNING *`,
    [id, roomId, userId]
  );
  return mapPlayerRow(rows[0]);
}

export async function removePlayer(roomId: string, userId: string): Promise<void> {
  await query('DELETE FROM players WHERE room_id = $1 AND user_id = $2', [roomId, userId]);
}

export async function getPlayersByRoom(roomId: string): Promise<Player[]> {
  const { rows } = await query(
    'SELECT * FROM players WHERE room_id = $1 ORDER BY joined_at ASC',
    [roomId]
  );
  return rows.map(mapPlayerRow);
}

export async function getPlayerStates(roomId: string, hostId: string): Promise<PlayerState[]> {
  const { rows } = await query(
    `SELECT p.id, p.user_id, u.username, u.avatar, p.score, p.is_ready, p.joined_at
     FROM players p
     JOIN users u ON p.user_id = u.id
     WHERE p.room_id = $1
     ORDER BY p.joined_at ASC`,
    [roomId]
  );

  return rows.map((p: Record<string, unknown>) => ({
    id: p.id as string,
    userId: p.user_id as string,
    username: p.username as string,
    avatar: p.avatar as string,
    score: p.score as number,
    isReady: p.is_ready as boolean,
    isHost: (p.user_id as string) === hostId,
    isConnected: true,
  }));
}

export async function togglePlayerReady(roomId: string, userId: string, ready: boolean): Promise<void> {
  const res = await query(
    'UPDATE players SET is_ready = $1 WHERE room_id = $2 AND user_id = $3',
    [ready, roomId, userId]
  );
  console.log('[DB] togglePlayerReady:', { roomId, userId, ready, rowCount: res.rowCount });
}

export async function updatePlayerScore(roomId: string, userId: string, score: number): Promise<void> {
  await query(
    'UPDATE players SET score = score + $1 WHERE room_id = $2 AND user_id = $3',
    [score, roomId, userId]
  );
}

export async function resetPlayerScores(roomId: string): Promise<void> {
  await query('UPDATE players SET score = 0 WHERE room_id = $1', [roomId]);
}

export async function getPlayerCount(roomId: string): Promise<number> {
  const { rows } = await query(
    'SELECT COUNT(*)::int as count FROM players WHERE room_id = $1',
    [roomId]
  );
  return rows[0]?.count ?? 0;
}

export async function areAllPlayersReady(roomId: string): Promise<boolean> {
  const { rows } = await query(
    `SELECT COUNT(*) FILTER (WHERE is_ready = false AND user_id != (SELECT host_id FROM rooms WHERE id = $1))::int as not_ready
     FROM players WHERE room_id = $1`,
    [roomId]
  );
  return (rows[0]?.not_ready ?? 1) === 0;
}
