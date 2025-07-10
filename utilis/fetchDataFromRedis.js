const {redisClient} = require("../config/redis");

async function getCachedData(key) {
  const cached = await redisClient.get(key);
  if (cached) {
    return JSON.parse(cached) 
  }else{
    return null
  }
}

async function setData(key, data){
  try {
    const stringifyData = JSON.stringify(data);
    await redisClient.setEx(key, 3600, stringifyData);
  } catch (err) {
    console.error("❌ Redis setData error:", err.message);
  }
}

module.exports.setCacheData = setData;
module.exports.getCachedData = getCachedData;