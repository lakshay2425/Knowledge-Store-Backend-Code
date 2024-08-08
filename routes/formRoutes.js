const express = require('express');
const router = express.Router();
const {contactDetails,feedbackDetails,suggestionDetails} = require('../controllers/formController');


router.post('/contactDetails',  contactDetails);

router.post('/suggestionDetails',  suggestionDetails );

router.post('/feedbackDetails', feedbackDetails );



module.exports = router;