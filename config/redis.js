// redisClient.js
import { createClient } from "redis";
import { config } from "./config.js";

export const redisClient = createClient({
  url: config.get("REDIS_URL"),
  socket: {
    reconnectStrategy: (retries) => {
      // Reconnect up to 3 seconds with an exponential backoff strategy
      return Math.min(retries * 100, 3000);
    },
    connectTimeout: 5000, // Max time (in ms) before the connection times out
  },
});


redisClient.on("error", (err) => {
  console.error("❌ Redis Client Error:", err.message);
});

redisClient.on("connect", () => {
  console.log("✅ Connected to Redis");
});

export const connectRedis = async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect(); // Try to connect
    }
  } catch (err) {
    console.error("❌ Error while connecting to Redis:", err.message);
  }
};

// module.exports = { redisClient, connectRedis };
