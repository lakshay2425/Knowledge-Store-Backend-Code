const express = require('express');
const router = express.Router();
const {contactDetails,feedbackDetails,suggestionDetails} = require('../controllers/formController');
const {isLoggedIn} = require("../middlewares/isLoggedIn");

router.post('/contactDetails', isLoggedIn, contactDetails);

router.post('/suggestionDetails', isLoggedIn, suggestionDetails );

router.post('/feedbackDetails', isLoggedIn, feedbackDetails );



module.exports = router;