import { query } from '../database/index.js';
import type { User, UserPublic } from '../types/index.js';
import { v4 as uuid } from 'uuid';

function mapUserRow(r: Record<string, unknown>): User {
  return {
    id: r.id as string,
    username: r.username as string,
    email: (r.email ?? null) as string | null,
    avatar: r.avatar as string,
    provider: r.provider as 'guest' | 'google',
    level: r.level as number,
    xp: r.xp as number,
    createdAt: r.created_at as Date,
  };
}

const ADJECTIVES = ['Swift', 'Clever', 'Brave', 'Lucky', 'Wild', 'Cool', 'Epic', 'Happy', 'Mighty', 'Sneaky', 'Funky', 'Bold', 'Zany', 'Witty', 'Rad'];
const NOUNS = ['Fox', 'Wolf', 'Hawk', 'Bear', 'Lynx', 'Tiger', 'Panda', 'Eagle', 'Shark', 'Otter', 'Falcon', 'Dragon', 'Phoenix', 'Raven', 'Cobra'];

function generateUsername(): string {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const num = Math.floor(Math.random() * 999);
  return `${adj}${noun}${num}`;
}

export async function createGuestUser(customUsername?: string): Promise<User> {
  const id = uuid();
  const username = customUsername && customUsername.trim().length > 0 ? customUsername.trim() : generateUsername();
  const avatar = `avatar_${Math.floor(Math.random() * 12) + 1}`;

  const { rows } = await query(
    `INSERT INTO users (id, username, avatar, provider) VALUES ($1, $2, $3, 'guest') RETURNING *`,
    [id, username, avatar]
  );
  return mapUserRow(rows[0]);
}

export async function findOrCreateGoogleUser(googleId: string, email: string, name: string, picture: string): Promise<User> {
  // Check if user exists by email
  const existing = await query('SELECT * FROM users WHERE email = $1', [email]);
  if (existing.rows.length > 0) return mapUserRow(existing.rows[0]);

  const id = uuid();
  const { rows } = await query(
    `INSERT INTO users (id, username, email, avatar, provider) VALUES ($1, $2, $3, $4, 'google') RETURNING *`,
    [id, name || generateUsername(), email, picture || `avatar_${Math.floor(Math.random() * 12) + 1}`]
  );
  return mapUserRow(rows[0]);
}

export async function getUserById(id: string): Promise<User | null> {
  const { rows } = await query('SELECT * FROM users WHERE id = $1', [id]);
  return rows[0] ? mapUserRow(rows[0]) : null;
}

export async function getUserPublic(id: string): Promise<UserPublic | null> {
  const { rows } = await query(
    'SELECT id, username, avatar, level FROM users WHERE id = $1',
    [id]
  );
  return rows[0] || null;
}

export async function updateUser(id: string, data: Partial<Pick<User, 'username' | 'avatar'>>): Promise<User | null> {
  const updates: string[] = [];
  const values: unknown[] = [];
  let paramIdx = 1;

  if (data.username) {
    updates.push(`username = $${paramIdx++}`);
    values.push(data.username);
  }
  if (data.avatar) {
    updates.push(`avatar = $${paramIdx++}`);
    values.push(data.avatar);
  }

  if (updates.length === 0) return getUserById(id);

  values.push(id);
  const { rows } = await query(
    `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramIdx} RETURNING *`,
    values
  );
  return rows[0] ? mapUserRow(rows[0]) : null;
}

export async function addXp(userId: string, amount: number): Promise<void> {
  await query(
    `UPDATE users SET xp = xp + $1, level = FLOOR((xp + $1) / 100) + 1 WHERE id = $2`,
    [amount, userId]
  );
}

export function toPublicUser(user: User): UserPublic {
  return { id: user.id, username: user.username, avatar: user.avatar, level: user.level };
}
