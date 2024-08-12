const express = require('express');
const router = express.Router();
const {loginDetails, insertSignupDetails, logoutUser} = require('../controllers/authController');

router.post('/loginDetails', loginDetails);  
router.get('/logout', logoutUser);
router.post('/signupDetails', insertSignupDetails);
  

module.exports = router;