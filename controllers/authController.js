const {verifyLoginDetails} = require('../utilis/databaseOperations/verifyLoginDetails');
const {insertSignupDetails} = require("../utilis/databaseOperations/verifySignupDetails");


module.exports.loginDetails = async (req, res) => {
    try {
      const { username, password } = req.body;
      //console.log(req.body);
      if(!username || !password){
        return res.status(400).json({
          message : "All fields are required"
        })
      }
      const response = await verifyLoginDetails(username, password, req, res);
      console.log(response);
      res.json(response);
    } catch (err) {
      res.status(401).send('Unauthorized');
    }
  };

module.exports.insertSignupDetails = async (req,res) => {
    try{
    const {fullName, gmail, username ,number, address, password, gender} = req.body;
    if(!fullName || !gmail || !username || !number || !address || !password){
      return res.status(400).json({
        message : "All fields are necessary",
        success : false
      })
    }
    //console.log(fullName, gmail, username ,number, address, password, gender);
    const response = await insertSignupDetails(fullName, gmail ,number, address, password, gender, username,req,res); // Function to insert contact details in the database
    res.json(response);
    } catch (err){
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
  
      // Set the 'role' cookie to expire immediately
      res.cookie('role', "", {
        httpOnly: false, // Set according to your needs
        secure: false,  // Set to true if using HTTPS in production
        expires: new Date(0), // Expire the cookie immediately
      });
  
      // Send a single response with a success message
      res.status(200).json({ message: "User logged out successfully" });
    } catch (err) {
      res.status(500).json({ error: `Server Error: ${err.message}` });
    }
  };
  