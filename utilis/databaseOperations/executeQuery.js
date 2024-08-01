const pool = require('../../config/mySQL');


// Function to execute insert queries
module.exports.executeQuery = async (query, params) => {
  try {
    const [rows] = await pool.execute(query, params);
    return rows;
  } catch (error) {
    console.log('Error executing query:', error);
    throw error;
  }
};