const bcrypt = require('bcrypt');
const {executeQuery} = require("./executeQuery");
const generateToken = require('../generateToken');


// Function to verify login details
module.exports.verifyLoginDetails = async (username, password,req, res) => {
  try {
    async function verify(results, res, role){
      const hash = results[0].passwordHash;
      const gmail = results[0].email_id;
      const result = await bcrypt.compare(password, hash);
      if (result) {
        const token = generateToken(gmail);
        res.cookie('token', token, {
          httpOnly: false,
          secure: false,
          maxAge: 5 * 60 * 60 * 1000,
        });
        res.cookie('role', role, {
          httpOnly: false,
          secure: false,
          maxAge: 5 * 60 * 60 * 1000,
        });
        return { success: true, message: "Login successful" };
        }else {
            return { success: false, message: "Invalid Credentials" };
        }
    }    
      const adminQuery = 'SELECT username FROM admin_details WHERE username COLLATE utf8mb4_0900_ai_ci  = ?;';
      const adminParams = [username];
      const results = await executeQuery(adminQuery, adminParams);
      if (results.length > 0) {
        const query = 'SELECT username, passwordHash, email_id FROM admin_details WHERE username COLLATE utf8mb4_0900_ai_ci  = ?;';
        const params = [username];
        const results = await executeQuery(query, params);
        const role = "admin";
        const response = await verify(results,res, role);
        return response;
      } else {
        const query = 'SELECT username, passwordHash, email_id FROM user_details WHERE username COLLATE utf8mb4_0900_ai_ci  = ?;';
        const params = [username];
        const results = await executeQuery(query, params);

        const role = "user";
        const response = await verify(results,res,role);
        return response;
      }
    } catch (error) {
      console.log('Error verifying login details:', error);
      return { success: false, message: 'Error verifying login details' };
    }
  };

  
