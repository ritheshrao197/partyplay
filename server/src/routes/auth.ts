import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { createGuestUser, findOrCreateGoogleUser, getUserById, updateUser, toPublicUser } from '../models/user.js';
import { authMiddleware, generateToken } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { AppError } from '../middleware/errorHandler.js';
import { query } from '../database/index.js';

const router = Router();

// POST /api/auth/guest
router.post('/guest', async (_req: Request, res: Response) => {
  const user = await createGuestUser();
  const token = generateToken({ userId: user.id, username: user.username });
  res.json({ token, user: toPublicUser(user) });
});

// POST /api/auth/google
const googleSchema = z.object({
  googleId: z.string(),
  email: z.string().email(),
  name: z.string().optional(),
  picture: z.string().optional(),
});

router.post('/google', validate(googleSchema), async (req: Request, res: Response) => {
  const { googleId, email, name, picture } = req.body;
  const user = await findOrCreateGoogleUser(googleId, email, name, picture);
  const token = generateToken({ userId: user.id, username: user.username });
  res.json({ token, user: toPublicUser(user) });
});

// GET /api/auth/profile
router.get('/profile', authMiddleware, async (req: Request, res: Response) => {
  const user = await getUserById(req.user!.userId);
  if (!user) throw new AppError(404, 'User not found');
  res.json(toPublicUser(user));
});

// PUT /api/auth/profile
const updateSchema = z.object({
  username: z.string().min(3).max(30).optional(),
  avatar: z.string().optional(),
});

router.put('/profile', authMiddleware, validate(updateSchema), async (req: Request, res: Response) => {
  const user = await updateUser(req.user!.userId, req.body);
  if (!user) throw new AppError(404, 'User not found');
  res.json(toPublicUser(user));
});

// GET /api/auth/friends
router.get('/friends', authMiddleware, async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { rows } = await query(
    `SELECT u.id, u.username, u.avatar, u.level, f.status
     FROM friends f
     JOIN users u ON (CASE WHEN f.user_id = $1 THEN f.friend_id ELSE f.user_id END) = u.id
     WHERE f.user_id = $1 OR f.friend_id = $1
     ORDER BY f.created_at DESC`,
    [userId]
  );
  res.json(rows);
});

// POST /api/auth/friends/add
const addFriendSchema = z.object({ friendId: z.string().uuid() });

router.post('/friends/add', authMiddleware, validate(addFriendSchema), async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { friendId } = req.body;

  if (userId === friendId) throw new AppError(400, 'Cannot add yourself');

  await query(
    `INSERT INTO friends (user_id, friend_id, status) VALUES ($1, $2, 'pending')
     ON CONFLICT (user_id, friend_id) DO NOTHING`,
    [userId, friendId]
  );
  res.json({ message: 'Friend request sent' });
});

// PUT /api/auth/friends/:id/accept
router.put('/friends/:id/accept', authMiddleware, async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const friendId = req.params.id;

  const { rowCount } = await query(
    `UPDATE friends SET status = 'accepted' WHERE user_id = $1 AND friend_id = $2 AND status = 'pending'`,
    [friendId, userId]
  );

  if (!rowCount) throw new AppError(404, 'Friend request not found');
  res.json({ message: 'Friend request accepted' });
});

export default router;
