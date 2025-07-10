const { encryptPass } = require("../encryptPassword");
const generateToken = require('../generateToken');
const userModel = require("../../models/user");
const Admin = require("../../models/admin");
const protectSignupForm = require("../protectSignupForm.js");
const createHttpError = require("http-errors");

// Function to check whether the user already exists or not
const isUserAlreadyExist = async (gmail) => {
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
module.exports.insertSignupDetails = async (req, res, next) => {
  const { fullName, gmail, number, address, password, gender, city, username } = req.body;
  try {
    if (!fullName || !gmail || !username || !number || !password || !address || !gender || !city) {
      return next(createHttpError(400, "Some of the required field are missing"));
    }
    try {        
        const decision = protectSignupForm(req, {email: gmail});
        if(decision.isDenied()){
            return next(createHttpError(403, "Forbidden"));
        }        
    } catch (error) {
        console.error("Failed in protecting singup form using Arcjet ", error.message);
        return next(createHttpError(500, "Failed to integrate arcjet form protectection feature"));
    }
    const userExists = await isUserAlreadyExist(gmail, res).catch(err => {
      return res.status(500).json({ message: err.message, success: false });
    });

    if (!userExists) {
      const passwordHash = await encryptPass(password);
      const user = await userModel.create({ fullName, emailId: gmail, contactNumber: number, passwordHash, gender, username , address, city})
      const token = generateToken(username);
      res.cookie('token', token, {
        httpOnly: true,
        secure: false,
        sameSite : true,
        maxAge: 2 * 60 * 60 * 1000,
      });
      return res.status(201).json({ success: true, message: `User Signup successful`, data: user, role: "user"});
    } else {
      return res.status(200).json({ exists: true, message: "User  Account Already exists" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error in creating user account. Please try again after some time', error: error.message });
  }
};

module.exports.isUserAlreadyExist = isUserAlreadyExist;