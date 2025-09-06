import  express from 'express';
const router = express.Router();
import {contactDetails,feedbackDetails,suggestionDetails, formResponse} from '../controllers/formController.js';


router.post('/contactDetails',  contactDetails);
router.post('/suggestionDetails',  suggestionDetails );
router.post('/feedbackDetails', feedbackDetails );
router.get("formResponse", formResponse);


export default router;