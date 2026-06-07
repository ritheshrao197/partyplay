import { query } from '../database/index.js';
import type { Match, GameType } from '../types/index.js';
import { v4 as uuid } from 'uuid';

function mapMatchRow(r: Record<string, unknown>): Match {
  return {
    id: r.id as string,
    roomId: r.room_id as string,
    winnerId: (r.winner_id ?? null) as string | null,
    gameMode: r.game_mode as GameType,
    rounds: r.rounds as number,
    startTime: r.start_time as Date,
    endTime: (r.end_time ?? null) as Date | null,
  };
}

export async function createMatch(roomId: string, gameMode: GameType): Promise<Match> {
  const id = uuid();
  const { rows } = await query(
    `INSERT INTO matches (id, room_id, game_mode) VALUES ($1, $2, $3) RETURNING *`,
    [id, roomId, gameMode]
  );
  return mapMatchRow(rows[0]);
}

export async function endMatch(matchId: string, winnerId: string | null, rounds: number): Promise<void> {
  await query(
    `UPDATE matches SET winner_id = $1, rounds = $2, end_time = NOW() WHERE id = $3`,
    [winnerId, rounds, matchId]
  );
}

export async function getMatchById(id: string): Promise<Match | null> {
  const { rows } = await query('SELECT * FROM matches WHERE id = $1', [id]);
  return rows[0] ? mapMatchRow(rows[0]) : null;
}

export async function getUserMatchHistory(userId: string, limit = 10): Promise<Match[]> {
  const { rows } = await query(
    `SELECT m.* FROM matches m
     JOIN players p ON m.room_id = p.room_id
     WHERE p.user_id = $1 AND m.end_time IS NOT NULL
     ORDER BY m.end_time DESC LIMIT $2`,
    [userId, limit]
  );
  return rows.map(mapMatchRow);
}
