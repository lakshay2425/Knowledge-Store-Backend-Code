import orders from "../models/order.js";
import testimonalModel from "../models/testimonial.js";
import bookReviewModel from "../models/review.js";
import userModel from "../users/user.js";
import { returnError } from "../utilis/returnError.js";
import createHttpError from "http-errors";
// import { dbOperation } from "../utilis/advanceFunctions.js";
import { returnResponse } from "../utilis/returnResponse.js";
import { doesUserExist } from "../form/formController.js";

export const profileDetails = async (req, res, next) => {
  const { userId } = req.query;
  if (!userId) {
    return returnError(400, "Email is required", next);
  }
  try {
    const userDetails = await userModel.findOne({ userId });
    return res.status(200).json({
      message: "User Profile Details fetched successfully",
      userDetails
    })
  } catch (error) {
    console.error(error.message, "Internal Error in fetching user profile details");
    returnError(500, "Internal Error in fetching user profile details", next);
  }
}


export const bookReview = async (req, res, next) => {
  try {
    const { bookName, stars, username, description } = req.body;
    if (!bookName || !stars || !username || !description) {
      return returnError(400, "Required fields are missing", next);
    }
    await bookReviewModel.create({
      username,
      bookName,
      stars,
      description
    })
    res.status(200).json({
      message: "Reveiw added successfully",
      success: true
    })
  } catch (error) {
    console.log(error.message, "Internal Error in adding book review");
    returnError(500, "Internal Error in adding book review", next);
  }
}

export const userTestimonial = async (req, res, next) => {
  try {
    const { username, testimonial } = req.body;
    if (!username || !testimonial) {
      return returnError(400, "Required fields are missing", next)
    }
    await testimonalModel.create({
      username,
      testimonial
    });
    res.status(200).json({
      message: "Testimonials added successfully",
      success: true
    })

  } catch (error) {
    console.log(error.message, "Internal Error in adding user testimonial");
    returnError(500, "Internal Error in adding user testimonial", next);
  }
}

export const fetchUserTestimonial = async (req, res, next) => {
  try {
    const allUserTestimonial = await testimonalModel.find();
    return res.status(200).json({
      message: "All testimonials fetched",
      success: true,
      data: allUserTestimonial
    })
  } catch (error) {
    console.log(error.message, "Internal Error in fetching all testimonials");
    returnError(500, "Internal Error in fetching all testimonials", next);
  }
}

export const fetchReveiw = async (req, res, next) => {
  try {
    const { bookName } = req.params;
    if (!bookName) {
      return returnError(400, "Required fields are missing", next)
    }
    const bookReviews = await bookReviewModel.find({ bookName });
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
  } catch (error) {
    console.log(error.message, "Internal Error in fetching book review");
    returnError(500, "Internal Error in fetching book review", next);
  }
}

export const deleteUserAccount = async (req, res, next) => {
  try {
    const { username } = req.query;
    if (!username) {
      return returnError(400, "Required field is missing", next)
    }
    await userModel.findOne({ username });
    const orderDetails = await orders.find({ $and: [{ username }, { status: { $in: ["ordered", "delievered"] } }] });
    if (!(orderDetails.length > 0)) {
      await userModel.deleteOne({ username });
      return res.status(200).json({
        message: "Account deleted successfully",
        success: true
      })
    }
    return res.status(409).json({
      message: "Account cannot be deleted becuase you have incoming or delivered orders",
      success: false
    })
  } catch (error) {
    console.log(error.message, "Internal Error in deleting user account");
    returnError(500, "Internal Error in deleting user account", next);
  }
}


export const fetchUserDetails = async (req, res, next) => {
  try {
    const userDetail = await userModel.find();
    return res.status(200).json({
      message: "User details fetched successfully",
      userDetails: userDetail
    });
  } catch (error) {
    console.log(error.message, "Internal Error in fetching userInfo");
    returnError(500, "Internal Error in fetching userInfo", next);
  }
}

export const onBoarding = async (req, res, next) => {
  const { formData } = req.body;
  if (!formData) {
    return next(createHttpError(400, "Form data is required"));
  }
  const { city, contactNumber, address, preferences, gender } = formData;
  const userId = req.userId;
  let user;
  try {
    user = await userModel.create({
      _id: userId,
      city,
      contactNumber,
      address,
      gender,
      preferences
    })
  } catch (error) {
    console.error(error.message, "Internal Error in onboarding user");
    return next(createHttpError(500, "Internal Error in onboarding user"));
  }
  return res.status(201).json({
    message: "User onboarded successfully",
    userId: user._id,
  });
}


export const doesUserExists = async (req, res, next) => {
  const id = req.userId;
  const gmail = req.gmail;
  const userExist = await doesUserExist(id, next);
  if (!userExist.success) {
    return returnResponse("User doesn't exist", res, 203, { gmail });
  }
  return returnResponse("User exist", res, 200, { gmail });
}
