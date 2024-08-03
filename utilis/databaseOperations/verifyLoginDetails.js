const bcrypt = require('bcrypt');
const {executeQuery} = require("./executeQuery");
const generateToken = require('../generateToken');


// Function to verify login details
module.exports.verifyLoginDetails = async (username, password,req, res) => {
    const query = 'SELECT username, passwordHash, email_id FROM user_details WHERE username COLLATE utf8mb4_0900_ai_ci  = ?;';
    const params = [username];
    try {
      const results = await executeQuery(query, params);
      if (results.length > 0) {
        const hash = results[0].passwordHash;
        const gmail = results[0].email_id;
        const result = await bcrypt.compare(password, hash);
        if (result) {
          const token = generateToken(gmail);
          res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            maxAge: 5 * 60 * 60 * 1000,
            path: '/' // Ensure this path is correct
          });
          return { success: true, message: "Login successful" };
        } else {
          return { success: false, message: "Invalid Credentials" };
        }
      } else {
        return { success: false, message: "Invalid Credentials" };
      }
    } catch (error) {
      console.log0('Error verifying login details:', error);
      return { success: false, message: 'Error verifying login details' };
    }
  };

  
