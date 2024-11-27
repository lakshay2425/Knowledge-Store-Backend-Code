const express = require('express');
const router = express.Router();
const {deleteUserAccount, profileDetails,  userTestimonial,bookReview,  fetchUserTestimonial, fetchReveiw} = require("../controllers/userControllers");


router.post("/profile", profileDetails);
router.post("/bookReview", bookReview);
router.post("/testimonial",userTestimonial);
router.get("/fetchTestimonial", fetchUserTestimonial);
router.get("/fetchBookReview/:bookName", fetchReveiw);
router.delete("/deleteAccount", deleteUserAccount);

module.exports = router;


