const {verifyLoginDetails} = require('../utilis/databaseOperations/verifyLoginDetails');
const {insertSignupDetails} = require("../utilis/databaseOperations/verifySignupDetails");


module.exports.loginDetails = async (req, res) => {
    try {
      const { username, password } = req.body;
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
    console.log(fullName, gmail, username ,number, address, password, gender);
    const response = await insertSignupDetails(fullName, gmail ,number, address, password, gender, username,req,res); // Function to insert contact details in the database
    res.json(response);
    } catch (err){
      res.status(500).send(`Server Error ${err.message}`);
    }
  };

  module.exports.logoutUser = async (req,res)=> {
    try{
      res.cookie("token", "", {
        httpOnly : true,
        secure : true
    });
    res.redirect("/");
  } catch(err){
    res.status(500).send(`Server Error ${err.message}`);
  }
  };