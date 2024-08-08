// const mysql = require('mysql2');
// const config = require('config');

// let pool;

// function getPool() {
//   if (!pool) {
//     try {
//       pool = mysql.createPool({
//         host: config.get('DB_HOST'),
//         user: config.get('DB_USER'),
//         password: config.get('DB_PASSWORD'),
//         database: config.get('DB_NAME'),
//         waitForConnections: true,
//         connectionLimit: 50, // Set a reasonable connection limit
//         queueLimit: 0
//       });

//       console.log('Database connection pool created successfully.');
//     } catch (error) {
//       console.error('Error creating database connection pool:', error);
//       // Handle the error appropriately
//     }
//   }
//   return pool.promise();
// }

// module.exports = getPool;

const mysql = require('mysql2');
// require('dotenv').dotenv.config();;
const config = require("config");

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