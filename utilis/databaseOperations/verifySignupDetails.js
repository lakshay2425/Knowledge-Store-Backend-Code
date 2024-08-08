const {encryptPass} = require("../encryptPassword");
const {executeQuery} = require("./executeQuery");
const generateToken = require('../generateToken');


// Function to check whether the user already exists or not
const isUserAlreadyExist = async (gmail,req,res) => {
    try {
      const query = 'SELECT * FROM user_details WHERE email_id  COLLATE utf8mb4_0900_ai_ci  = ?;';
      const params = [gmail];
      const result = await executeQuery(query, params);
      return result.length > 0; // Return true if user exists, false otherwise
    } catch (error) {
      res.status(500).send(`Error: Unable to check user exist or not, ${error.message}`);  
    }
  };
    
  // Function to insert user signup details
  module.exports.insertSignupDetails = async (fullName, gmail, number, address, password, gender, username, req, res) => {
    try {
      const userExists = await isUserAlreadyExist(gmail);
      console.log(userExists);
      if (!userExists) {
        const passwordHash = await encryptPass(password);
        const query = 'INSERT INTO user_details (full_name, email_id, contact_number, address, passwordHash, gender, username) VALUES (?,?,?,?,?,?,?);';
        const params = [fullName, gmail, number, address, passwordHash, gender, username];
        await executeQuery(query, params);
        const token = generateToken(gmail);
        console.log(token);
        res.cookie('token', token, {
          httpOnly: false,
          secure: false,
          maxAge: 5 * 60 * 60 * 1000,
          sameSite: 'none' // Ensure the cookie is sent with cross-origin requests
        });
        res.cookie('role', "user", {
          httpOnly: false,
          secure: false,
          maxAge: 5 * 60 * 60 * 1000,
          sameSite: 'none' // Ensure the cookie is sent with cross-origin requests
        });
        return { success: true, message: "Signup successful" };
      } else {
        return { success: false, message: "User Account Already exists" };
      }
    } catch (error) {
      console.log('Error inserting signup details:', error);
      return { success: false, message: 'Error inserting signup details' };
    }
  };
  
  module.exports.isUserAlreadyExist = isUserAlreadyExist;