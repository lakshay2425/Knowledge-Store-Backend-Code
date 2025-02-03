const express = require('express');
const router = express.Router();
const {loginDetails, logoutUser} = require('../controllers/authController');
const {insertSignupDetails} = require("../utilis/authenticationOperations/verifySignupDetails")

router.post('/loginDetails', loginDetails);  
router.get('/logout', logoutUser);
router.post('/signupDetails', insertSignupDetails);
  


module.exports = router;