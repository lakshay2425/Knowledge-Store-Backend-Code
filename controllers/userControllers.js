const orders = require("../models/order");
const testimonalModel = require("../models/testimonial");
const bookReviewModel = require("../models/review");
const userModel = require("../models/user");

module.exports.profileDetails = async (req, res) => {
  const { email } = req.body;

  if (!email) {

    return res.status(404).json({
      message: "Email is required"
    })
  }

  const userDetails = await userModel.findOne({ emailId: email }).select('-passwordHash');
  const numberOfOrders = userDetails.numberOfOrders;

  return res.status(200).json({
    message: "User Profile Details fetched successfully",
    orders: 0,
    userDetails: userDetails
  })
}


module.exports.bookReview = async (req, res) => {
  try {
    const { bookName, stars, username, description } = req.body;
    if (!bookName || !stars || !username || !description) {
      return res.status(400).json({
        success: false,
        message: "All field are required"
      })
    }
    const model = await bookReviewModel.create({
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
    res.status(404).json({
      error: error.message,
      success: false
    })
  }
}

module.exports.userTestimonial = async (req, res) => {
  try {
    const { username, testimonial } = req.body;
    if (!username || !testimonial) {
      return res.status(400).json({
        message: "All fields are required"
      })
    }
    const details = await testimonalModel.create({
      username,
      testimonial
    });
    res.status(200).json({
      message: "Testimonials added successfully",
      success: true
    })

  } catch (error) {
    res.status(404).json({
      error: error.message,
      success: false
    })
  }
}

module.exports.fetchUserTestimonial = async (req, res) => {
  try {
    const allUserTestimonial = await testimonalModel.find();
    return res.status(200).json({
      message: "All testimonials fetched",
      success: true,
      data: allUserTestimonial
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    })
  }
}

module.exports.fetchReveiw = async (req, res) => {
  try {
    const { bookName } = req.params;
    if (!bookName) {
      return res.status(404).json({
        message: "BookName is required",
        success: false
      })
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
    return res.status(500).json({
      success: false,
      error: error.message
    })
  }
}

module.exports.deleteUserAccount = async (req, res) => {
  try {
    const { username } = req.query;
    if(!username){
      return res.status(404).json({
        message: "Username is required",
        success : false
      })
    }
    const user = await userModel.findOne({ username });
    const orderDetails = await orders.find({ $and: [{ username }, { status: { $in: ["ordered", "delievered"] } }] });
    if (orderDetails.length > 0) {
      return res.status(404).json({
        message: "Account cannot be deleted becuase you have incoming or delivered orders",
        success: false
      })
    } else {
      await userModel.deleteOne({ username });
      return res.status(200).json({
        message: "Account deleted successfully",
        success: true
      })
    }


  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete the user account",
      success: false,
      error: error.message
    })
  }
}


module.exports.fetchUserDetails = async (req, res) => {
  try {
    const userDetail = await userModel.find().select('-passwordHash');
    return res.status(200).json({
      message: "User details fetched successfully",
      userDetails: userDetail
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

