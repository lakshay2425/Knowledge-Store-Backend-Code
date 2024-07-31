// const mysql = require('mysql2');
// const dotenv = require('dotenv');

// dotenv.config();

// const dbConfig = {
//   host: config.get()DB_HOST,
//   user: config.get()DB_USER,
//   password: config.get()DB_PASSWORD,
//   database: config.get()DB_NAME
// };

// const connectToDb =  () => {
//   const connection =  mysql.createConnection(dbConfig);
//   connection.connect((err) => {
//     if (err) {
//       console.error('Error connecting to the database:', err);
//       setTimeout(connectToDb, 5000); // Retry connection after 5 seconds
//     } else {
//       console.log('Connected to the MySQL database.');
//     }
//   });

//   connection.on('error', (err) => {
//     console.error('Database connection error:', err);
//     if (err.code === 'PROTOCOL_CONNECTION_LOST') {
//       connectToDb(); // Reconnect if connection is lost
//     } else {
//       //process.exit(1);
//       throw err;
//     }
//   });

//   return connection;
// };



// module.exports = connectToDb;


// db.js (Database Configuration and Connection)
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
