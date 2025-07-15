const express = require('express');
const router = express.Router();
const {loginDetails, logoutUser} = require('../controllers/authController');


router.post('/loginDetails', loginDetails);  
router.get('/logout', logoutUser);
  


module.exports = router;