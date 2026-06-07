import { createClient, RedisClientType } from 'redis';
import { config } from '../config.js';

let redisClient: RedisClientType;

export async function connectRedis(): Promise<RedisClientType> {
  redisClient = createClient({ url: config.redis.url }) as RedisClientType;

  redisClient.on('error', (err) => {
    console.error('Redis client error:', err);
  });

  redisClient.on('connect', () => {
    console.log('[Redis] Connected');
  });

  await redisClient.connect();
  return redisClient;
}

export function getRedis(): RedisClientType {
  if (!redisClient) {
    throw new Error('Redis client not initialized. Call connectRedis() first.');
  }
  return redisClient;
}

export default { connectRedis, getRedis };
