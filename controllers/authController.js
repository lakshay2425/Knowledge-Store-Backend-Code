const { verifyLoginDetails } = require('../utilis/authenticationOperations/verifyLoginDetails');
const { insertSignupDetails } = require("../utilis/authenticationOperations/verifySignupDetails");


module.exports.loginDetails = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({
        message: "All fields are required",
        success : false
      })
    }
    const response = await verifyLoginDetails(username, password, req, res);
  } catch (err) {
    return res.status(401).json({
      message : "Unauthorized",
      success : false
    });
  }
};

module.exports.insertSignupDetails = async (req, res) => {
  try {
    const { fullName, gmail, username, number, address, password, gender } = req.body;
    if (!fullName || !gmail || !username || !number || !password) {
      return res.status(400).json({
        message: "All fields are necessary to create a account",
        success: false
      })
    }
    const response = await insertSignupDetails(fullName, gmail, number, address, password, gender, username, req, res); // Function to insert contact details in the database
  } catch (err) {
    res.status(500).send(`Server Error ${err.message}`);
  }
};


//Function to logout the user
module.exports.logoutUser = async (req, res) => {
  try {
    // Set the 'token' cookie to expire immediately
    res.cookie('token', "", {
      httpOnly: false, // Set according to your needs
      secure: false,  // Set to true if using HTTPS in production
      expires: new Date(0), // Expire the cookie immediately
    });

    // Send a single response with a success message
    res.status(200).json({
      message: "User logged out successfully",
      success: true
    });
  } catch (err) {
    res.status(500).json({ message: `Server Error: ${err.message}`, success: false });
  }
};
