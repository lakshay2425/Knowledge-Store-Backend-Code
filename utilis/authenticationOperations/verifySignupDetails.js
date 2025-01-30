const { encryptPass } = require("../encryptPassword");
const generateToken = require('../generateToken');
const userModel = require("../../models/user");
const Admin = require("../../models/admin");

// Function to check whether the user already exists or not
const isUserAlreadyExist = async (gmail, res) => {
  try {
    const adminDetails = await Admin.findOne({ emailId: gmail });
    if (!adminDetails) {
      const userDetails = await userModel.findOne({ emailId: gmail })
      return userDetails;
    }
    return adminDetails; // Return true if user exists, false otherwise
  } catch (error) {
    throw new Error(`Unable to check user existence: ${error.message}`);

  }
};

// Function to insert user signup details
module.exports.insertSignupDetails = async (fullName, gmail, number, address, password, gender, username, req, res) => {
  try {
    const userExists = await isUserAlreadyExist(gmail, res).catch(err => {
      return res.status(500).json({ message: err.message, success: false });
    });

    if (!userExists) {
      const passwordHash = await encryptPass(password);
      const user = await userModel.create({ fullName, emailId: gmail, contactNumber: number, passwordHash, gender, username })
      const token = generateToken("user");
      res.cookie('token', token, {
        httpOnly: false,
        secure: false,
        maxAge: 5 * 60 * 60 * 1000,
        // sameSite: 'none' // Ensure the cookie is sent with cross-origin requests
      });
      return res.status(201).json({ success: true, message: "User Signup successful", data: user });
    } else {
      return res.status(409).json({ exists: true, message: "User  Account Already exists" });
    }
  } catch (error) {
    return { success: false, message: 'Error in creating user account. Please try again after some time', error: error.message };
  }
};

module.exports.isUserAlreadyExist = isUserAlreadyExist;