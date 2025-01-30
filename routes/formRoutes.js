const express = require('express');
const router = express.Router();
const {contactDetails,feedbackDetails,suggestionDetails, formResponse} = require('../controllers/formController');


router.post('/contactDetails',  contactDetails);

router.post('/suggestionDetails',  suggestionDetails );

router.post('/feedbackDetails', feedbackDetails );

router.get("formResponse", formResponse);


module.exports = router;