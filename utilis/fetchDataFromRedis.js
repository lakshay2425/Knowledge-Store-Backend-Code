import { redisClient } from "../config/redis.js";

async function getCachedData(key) {
  const cached = await redisClient.get(key);
  if (cached) {
    console.log(key, "Cached data");
    return JSON.parse(cached)
  } else {
    return null
  }
}

async function setData(key, data) {
  try {
    console.log(key, "Setting data in Redis");
    const stringifyData = JSON.stringify(data);
    await redisClient.setEx(key, 3600, stringifyData);
  } catch (err) {
    console.error("❌ Redis setData error:", err.message);
  }
}

export const setCacheData = setData;
export const getCachedData = getCachedData;