const bcrypt = require('bcrypt');
const generateToken = require('../generateToken');
const Admin = require("../../models/admin")
const User = require("../../models/user");
const {returnError} = require("../returnError");

// Function to verify login details
module.exports.verifyLoginDetails = async (username, password, req, res, next) => {
  try {
    const isAdmin = await Admin.findOne({ username: username });
    if (!isAdmin) {
      const userDetails = await User.findOne({ username });
      if (!userDetails) {
        return returnError(404, "User doesn't exist", next);
      }
      const role = "user";
      await verify(userDetails, res, role, username, password, next);
    }
    else {
      const role = "admin";
      await verify(isAdmin, res, role, username, password, next);
    }
  } catch (error) {
    console.log("Internal Error in verifying user details", error.message);
    returnError(500, "Internal Error in verifying user details",next);
  }
};

    async function verify(results, res, role, username, password,next) {
      if (!results || !role) {
        return returnError(400, "Required fields are missing",next)
      }
      const hash = results.passwordHash;
      const result = await bcrypt.compare(password, hash);
      if (result) {
        const token = generateToken(username);
        res.cookie('token', token, {
          httpOnly: true,
          secure: false,
          sameSite : true,
          maxAge: 2 * 60 * 60 * 1000,
        });
        return res.status(200).json(
          { 
            success: true,
             message: "Login successful",
              role , 
              userData : results,
            });
      } else {
        return returnError(401, "Invalid Credentials", next);
      }
    }


