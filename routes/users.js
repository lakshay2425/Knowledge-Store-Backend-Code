import express from 'express';
const router = express.Router();
import { deleteUserAccount, profileDetails, userTestimonial, bookReview, fetchUserTestimonial, fetchReveiw, fetchUserDetails, onBoarding, doesUserExists } from "../controllers/userControllers.js";
import { authenticateUser } from '../middlewares/authMidlleware.js';


router.get("/profile", profileDetails);
router.post("/bookReview", bookReview);
router.post("/testimonial", userTestimonial);
router.get("/fetchTestimonial", fetchUserTestimonial);
router.get("/fetchBookReview/:bookName", fetchReveiw);
router.delete("/deleteAccount", deleteUserAccount);
router.get("/fetchUserDetails", fetchUserDetails);
router.post("/onboarding", authenticateUser, onBoarding);
router.get('/check', authenticateUser, doesUserExists)



export default router


