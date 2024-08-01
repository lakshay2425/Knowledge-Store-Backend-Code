const mysql = require('mysql2');
// require('dotenv').dotenv.config();;
const config = require("config")

const pool = mysql.createPool({
  host: config.get("DB_HOST"),
  user: config.get("DB_USER"),
  password: config.get("DB_PASSWORD"),
  database: config.get("DB_NAME"),
  waitForConnections: true,
  connectionLimit: 50, // Set a reasonable connection limit
  queueLimit: 0
});

module.exports = pool.promise(); // Export a promise-based interface
