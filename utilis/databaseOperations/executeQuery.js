const pool = require('../../config/mySQL');
const debuglog = require("debug")("development:databaseOperationsExecuteQuery");


// Function to execute insert queries
module.exports.executeQuery = async (query, params) => {
  try {
    const [rows] = await pool.execute(query, params);
    return rows;
  } catch (error) {
    debuglog('Error executing query:', error);
    throw error;
  }
};