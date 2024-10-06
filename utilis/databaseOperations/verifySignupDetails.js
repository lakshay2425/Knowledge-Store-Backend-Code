const {encryptPass} = require("../encryptPassword");
const generateToken = require('../generateToken');
const userModel = require("../../models/user");
const Admin = require("../../models/admin");

// Function to check whether the user already exists or not
const isUserAlreadyExist = async (gmail,res) => {
    try {
      const adminDetails = await Admin.findOne({emailId : gmail});
      //console.log(adminDetails, "Checking whether user exist or not");
      if(!adminDetails){
        const userDetails = await userModel.findOne({emailId : gmail})
        return userDetails;
      }
      return adminDetails; // Return true if user exists, false otherwise
    } catch (error) {
      res.status(500).json(` Error: Unable to check user exist or not, ${error.message}`);  
    }
  };
    
  // Function to insert user signup details
  module.exports.insertSignupDetails = async (fullName, gmail, number, address, password, gender, username, req, res) => {
    try {
      console.log(fullName, gmail, number, address, password, gender, username, "User Details From verifySignupDetails.jsx ")
      const userExists = await isUserAlreadyExist(gmail);
      console.log(userExists, "From verifySignupDetails.jsx checking user exist or not");
      if (!userExists) {
        const passwordHash = await encryptPass(password);
        const user = await userModel.create({fullName, emailId : gmail, contactNumber : number, passwordHash, gender, username})
        console.log(user, "After creating user document in db");
        const token = generateToken(gmail);
        console.log(token, "From Creating user from verifySignupDetails.jsx");
        res.cookie('token', token, {
          httpOnly: false,
          secure: false,
          maxAge: 5 * 60 * 60 * 1000,
          // sameSite: 'none' // Ensure the cookie is sent with cross-origin requests
        });
        res.cookie('role', "user", {
          httpOnly: false,
          secure: false,
          maxAge: 5 * 60 * 60 * 1000,
          //sameSite: 'none' // Ensure the cookie is sent with cross-origin requests
        });
        return { success: true, message: "Signup successful", user };
      } else {
        return {    exists : true, message: "User Account Already exists" };
      }
    } catch (error) {
      console.log('Error inserting signup details:', error);
      return { success: false, message: 'Error inserting signup details', error : error.message };
    }
  };
  
  module.exports.isUserAlreadyExist = isUserAlreadyExist;