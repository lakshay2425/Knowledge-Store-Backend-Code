// import { createClient } from 'redis';
const config = require("config");
const redis = require("redis");

const client = redis.createClient({
    password: config.get("REDIS_PASSWORD"),
    socket: {
        host: config.get("REDIS_HOST"),
        port: config.get("REDIS_PORT")
    }
});

client.connect();

client.on("connect", ()=> {
    console.log("Connected to Redis");
})

module.exports = client;