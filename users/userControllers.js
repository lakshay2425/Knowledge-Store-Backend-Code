import orders from "../models/order.js";
import testimonalModel from "../models/testimonial.js";
import bookReviewModel from "../models/review.js";
import userModel from "../users/user.js";
import { returnError } from "../utilis/returnError.js";
import createHttpError from "http-errors";
// import { dbOperation } from "../utilis/advanceFunctions.js";
import { returnResponse } from "../utilis/returnResponse.js";
import { doesUserExist } from "../form/formController.js";
import { config } from "../config/config.js";
import jwt from 'jsonwebtoken'
import { asyncHandler, dbOperation, serviceOperation } from "../utilis/advanceFunctions.js";
import { validateMissingFields } from "../utilis/validateMissingFields.js";

export const profileDetails =  asyncHandler(async (req, res) => {
  const userId  = req.userId;
    
  const userDetails = await dbOperation(
      ()=> userModel.findById(userId),
      `Failed to find user profile details with userId ${userId}`
    );
    
    return res.status(200).json({
      message: "User Profile Details fetched successfully",
      userDetails
    })
})


export const bookReview = asyncHandler(async (req, res, next) => {
    const { bookName, stars, username, description } = req.body;
    const fieldMissing = validateMissingFields({ bookName, stars, username, description });
    if (fieldMissing) {
      return returnError(400, "Required fields are missing", next);
    }

    await dbOperation(
      ()=> bookReviewModel.create({
      username,
      bookName,
      stars,
      description
    }), `Failed to create book review for ${bookName} by ${username}`
    )
    res.status(200).json({
      message: "Reveiw added successfully",
      success: true
    })
  
})

export const userTestimonial = asyncHandler(async (req, res, next) => {
    const { username, testimonial } = req.body;

    const fieldMissing = validateMissingFields({ username, testimonial })
    if (fieldMissing) {
      return returnError(400, "Required fields are missing", next)
    }

    await dbOperation(
      ()=> testimonalModel.create({
      username,
      testimonial
    }), `Failed to create user testimonial ${username}`
    );
    res.status(200).json({
      message: "Testimonials added successfully",
      success: true
    })
})

export const fetchUserTestimonial = asyncHandler(async (req, res) => {

  const allUserTestimonial = await dbOperation(
      ()=> testimonalModel.find(),
      "Failed to fetch user testimonails"
    );
    return res.status(200).json({
      message: "All testimonials fetched",
      success: true,
      data: allUserTestimonial
    })
})

export const fetchReveiw = asyncHandler(async (req, res, next) => {
    const { bookName } = req.params;
    if (!bookName) {
      return returnError(400, "Required fields are missing", next)
    }
    
    const bookReviews = await dbOperation(
      ()=> bookReviewModel.find({ bookName }),
      `Failed to fetch book reviews for ${bookName}`
    );

    if (bookReviews.length == 0) {
      return res.status(200).json({
        success: true,
        message: "No reviews found for this book",
        reviews: 0
      })
    }

    return res.status(200).json({
      message: "Fetched reviews successfully",
      reviewData: bookReviews,
      reviews: bookReviews.length
    })
  
})

export const deleteUserAccount = asyncHandler(async (req, res) => {
    const userId  = req.userId;

    const orderDetails = await dbOperation(
      ()=> orders.find({ $and: [{ _id: userId }, { status: { $in: ["ordered", "delievered"] } }] }),
      `Failed to fetch orders for user with userId ${userId}`
    );

    if (!(orderDetails.length > 0)) {
      const response = await userModel.findByIdAndDelete(userId);
      if(response){
        return res.status(200).json({
          message: "Account deleted successfully",
          success: true
        })
      }
    }
    return res.status(409).json({
      message: "Account cannot be deleted becuase you have incoming or delivered orders",
      success: false
    })
})


export const fetchUserDetails = asyncHandler(async (req, res) => {
    const userDetail = await dbOperation(()=> userModel.find(), "Failed to find user details");
    return res.status(200).json({
      message: "User details fetched successfully",
      userDetails: userDetail
    });
  
})

export const onBoarding = asyncHandler(async (req, res, next) => {
  const { formData } = req.body;
  const { city, contactNumber, address, preferences, gender } = formData;
  const fieldMissing = validateMissingFields({ city, contactNumber, address, preferences, gender });
  
  if (fieldMissing) {
    return next(createHttpError(400, "Form data is required"));
  }

  const userId = req.userId;
  
    const user = await dbOperation(()=> userModel.create({
      _id: userId,
      city,
      contactNumber,
      address,
      gender,
      preferences
    }), `Failed to create user account for Knowledge Store ${userId}`)
  
  return res.status(201).json({
    message: "User onboarded successfully",
    userId: user._id,
  });
})


export const doesUserExists = async (req, res, next) => {
  let id;
  let gmail;
  try {
    const token = req.cookies.token;
    if (!token) {
      console.info('No token provided');
      return returnResponse("You're not authenticated", res, 200, { userInfo: null });
    }
    const publicKey = config.get("JWT_PUBLIC_KEY");
    const decoded = await serviceOperation(
      () => jwt.verify(token, publicKey),
      "Failed to verify and decode the token"
    );
    id = decoded.sub;
    gmail = decoded.userInfo.userEmail
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(createHttpError(401, "Token has expired, please login again"));
    }
    if (error instanceof jwt.JsonWebTokenError) {
      console.info('Invalid token', error);
      return next(createHttpError(401, "Invalid token, please login again"));
    }

    console.info('Auth verification failed', error.message);
    return next(createHttpError(500, "Internal server error"));
  }
  const userExist = await doesUserExist(id, next);
  if (!userExist.success) {
    return returnResponse("User doesn't exist", res, 203, { gmail });
  }
  return returnResponse("User exist", res, 200, { gmail });
}
