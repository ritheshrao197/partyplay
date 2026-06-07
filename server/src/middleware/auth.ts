import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import type { JwtPayload } from '../types/index.js';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authorization header required' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, config.jwt.secret) as JwtPayload;
    req.user = payload;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

export function generateToken(payload: JwtPayload): string {
  return jwt.sign(payload, config.jwt.secret, { expiresIn: 7 * 24 * 60 * 60 }); // 7 days in seconds
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, config.jwt.secret) as JwtPayload;
  } catch {
    return null;
  }
}
