const orders = require("../models/order");
const testimonalModel = require("../models/testimonial");
const bookReviewModel = require("../models/review");
const userModel = require("../models/user");
const {returnError} = require("../utilis/returnError.js")

module.exports.profileDetails = async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return returnError(400, "Email is required", next);
  }
  const userDetails = await userModel.findOne({ emailId: email }).select('-passwordHash');

  return res.status(200).json({
    message: "User Profile Details fetched successfully",
    orders: userDetails.numberOfOrders,
    userDetails
  })
}


module.exports.bookReview = async (req, res, next) => {
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

module.exports.userTestimonial = async (req, res, next) => {
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

module.exports.fetchUserTestimonial = async (req, res, next) => {
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

module.exports.fetchReveiw = async (req, res, next) => {
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

module.exports.deleteUserAccount = async (req, res,next) => {
  try {
    const { username } = req.query;
    if(!username){
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


module.exports.fetchUserDetails = async (req, res,next) => {
  try {
    const userDetail = await userModel.find().select('-passwordHash');
    return res.status(200).json({
      message: "User details fetched successfully",
      userDetails: userDetail
    });
  } catch (error) {
    console.log(error.message, "Internal Error in fetching userInfo");
    returnError(500, "Internal Error in fetching userInfo", next);
  }
}

