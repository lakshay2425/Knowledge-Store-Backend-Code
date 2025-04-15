const { verifyLoginDetails } = require('../utilis/authenticationOperations/verifyLoginDetails');


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


//Function to logout the user
module.exports.logoutUser = async (req, res) => {
  try {
    // Set the 'token' cookie to expire immediately
    res.clearCookie('token', {
      httpOnly: true, // Set according to your needs
      secure: false,  // Set to true if using HTTPS in production
      sameSite: true
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
