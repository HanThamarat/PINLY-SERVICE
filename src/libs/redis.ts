import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

export const redis = createClient({
    url: `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});

redis.on('error', (err) => {
  console.error('Redis Client Error', err);
});

export const redisInitialize = async () => {
  if (!redis.isOpen) {
    await redis.connect();
    console.log("🚀 Redis Connected.");
  }

  return redis;
};