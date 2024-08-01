const {encryptPass} = require("../encryptPassword");
const {executeQuery} = require("./executeQuery");
const generateToken = require('../generateToken');


// Function to check whether the user already exists or not
const isUserAlreadyExist = async (gmail) => {
    const query = 'SELECT * FROM user_details WHERE email_id = ?;';
    const params = [gmail];
    const result = await executeQuery(query, params);
    return result.length > 0; // Return true if user exists, false otherwise
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
        console.log(params);
        await executeQuery(query, params);
        const token = generateToken(gmail);
        console.log(token);
        res.cookie('token', token, {
          httpOnly: true,
          secure: false,
          maxAge: 5 * 60 * 60 * 1000,
          path: '/' // Ensure this path is correct
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