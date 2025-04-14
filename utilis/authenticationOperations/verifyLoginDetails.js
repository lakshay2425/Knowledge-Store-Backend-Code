const bcrypt = require('bcrypt');
const generateToken = require('../generateToken');
const Admin = require("../../models/admin")
const User = require("../../models/user");
const { sendEmail } = require('../mailFunction');


// Function to verify login details
module.exports.verifyLoginDetails = async (username, password, req, res) => {
  try {
    async function verify(results, res, role) {
      if (!results || !role) {
        return res.status(404).json({
          message: "All field are required to login"
        })
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
        const response = await sendEmail(results.emailId, {ipAddress : req.ip, timestamp: new Date().toLocaleString()}, 2, "There is a new login with your credentials")
        return res.status(200).json(
          { 
            success: true,
             message: "Login successful",
              role , 
              userData : results,
              mailStatus: response
            });
      } else {
        return res.status(401).json({ success: false, message: "Invalid Credentials" });
      }
    }

    const isAdmin = await Admin.findOne({ username: username });
    if (!isAdmin) {
      const userDetails = await User.findOne({ username });
      if (!userDetails) {
        return res.status(404).json({
          success : false,
          message: "User doesn't exist"
        });
      }
      const role = "user";
      await verify(userDetails, res, role);
    }
    else {
      const role = "admin";
      await verify(isAdmin, res, role);
    }
  } catch (error) {
    console.log(error.message);
    return res.status(404).json({ success: false, message: error.message });
  }
};


