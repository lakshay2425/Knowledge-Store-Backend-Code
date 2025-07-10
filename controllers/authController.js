const { verifyLoginDetails } = require('../utilis/authenticationOperations/verifyLoginDetails');
const {returnError} = require("../utilis/returnError");

module.exports.loginDetails = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return returnError(400, "Required fields are missing",next);
    }
    await verifyLoginDetails(username, password, req, res, next);
  } catch (error) {
    console.log("Internal Error in verifying user details", error.message);
    returnError(500, "Internal Error in verifying user details",next);
  }
};


//Function to logout the user
module.exports.logoutUser = async (req, res, next) => {
  try {
    res.clearCookie('token', {
      httpOnly: true, 
      secure: false,  
      sameSite: true
    });

    res.status(200).json({
      message: "User logged out successfully",
      success: true
    });
  } catch (error) {
    console.log("Internal Error in the process of login out the user", error.message);
    returnError(500, "Internal Error in in the process of login out the user",next);
  }
};
