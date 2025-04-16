const {redisClient} = require("../config/redis");

async function getCachedData(key) {
  const cached = await redisClient.get(key);
  if (cached) {
    // console.log("Data returned from redis");
    return JSON.parse(cached) 
  }else{
    // console.log("❌ No data found in Redis");
    return null
  }
}

async function setData(key, data){
  try {
    const stringifyData = JSON.stringify(data);
    await redisClient.setEx(key, 3600, stringifyData);
    // console.log("Data stored in redis from setData func");
  } catch (err) {
    console.error("❌ Redis setData error:", err.message);
  }
}

module.exports.setCacheData = setData;
module.exports.getCachedData = getCachedData;