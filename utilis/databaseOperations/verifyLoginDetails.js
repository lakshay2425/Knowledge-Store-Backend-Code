const bcrypt = require('bcrypt');
const generateToken = require('../generateToken');
const Admin = require("../../models/admin")
const User = require("../../models/user");


// Function to verify login details
module.exports.verifyLoginDetails = async (username, password, req, res) => {
  try {
    async function verify(results, res, role) {
      if (!results || !role) {
        return res.status(404).json({
          message: "All field are required to login"
        })
      }
      //console.log(role, ",Details from verifyLoginDetails function");
      const hash = results.passwordHash;
      const result = await bcrypt.compare(password, hash);
      //console.log(result, "After comparing password");
      if (result) {
        const token = generateToken(role);
        res.cookie('token', token, {
          httpOnly: false,
          secure: false,
          maxAge: 5 * 60 * 60 * 1000,
        });
        return { success: true, message: "Login successful", token , userData : results};
      } else {
        return { success: false, message: "Invalid Credentials" };
      }
    }

    //console.log(username, password, "checking params");
    const isAdmin = await Admin.findOne({ username: username });
    //console.log(isAdmin, "Checking user is admin or not");
    if (!isAdmin) {
      const userDetails = await User.findOne({ username });
      if (!userDetails) {
        res.status(404).json({
          message: "User doesn't exist"
        })
        //console.log("User don't exist");
        return;
      }
      //console.log("User Details", userDetails);
      const role = "user";
      //console.log(role, "ROle");
      const response = await verify(userDetails, res, role);
      return response;
    }
    else {
      const role = "admin";
      //console.log(role, "Role");
      const response = await verify(isAdmin, res, role);
      return response;
    }
  } catch (error) {
    //console.log('Error:', error.message);
    return { success: false, error: error.message };
  }
};


