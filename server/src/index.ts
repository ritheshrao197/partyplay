import express from 'express';
import { createServer } from 'node:http';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config.js';
import { connectRedis } from './database/redis.js';
import pool from './database/index.js';
import authRoutes from './routes/auth.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { setupSocket } from './socket/index.js';

const app = express();
const httpServer = createServer(app);

// Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: config.clientUrl, credentials: true }));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Setup Socket.IO
const io = setupSocket(httpServer);

// Start server
async function start() {
  try {
    // Test DB connection
    const dbResult = await pool.query('SELECT 1');
    console.log('[DB] PostgreSQL connected');

    // Connect Redis
    await connectRedis();

    // Start HTTP + WebSocket server
    httpServer.listen(config.port, () => {
      console.log(`[Server] Loki server running on port ${config.port}`);
      console.log(`[Server] Environment: ${config.nodeEnv}`);
    });
  } catch (err) {
    console.error('[Server] Failed to start:', err);
    process.exit(1);
  }
}

start();

export { io };
