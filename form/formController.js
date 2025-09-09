import findUserById from"../utilis/fetchUserId.js";
import feedbackModel from "./feedback.js";
import suggestionModel from "./suggestion.js";
import contactModel from "./contact.js";
import createHttpError from"http-errors";

export const doesUserExist = async (userId, next)=>{
  const userDetail = await findUserById(userId, next);
    if(!userDetail){
      return {
        exist: false
      }
    }
    return {
      success: true,
      userDetail
    };
}

//Function to insert feedback details in the database
export const feedbackDetails = async (req, res,next) => {
  try {
    const id = req.userId;
    
    const { feedback } = req.body;
    if (!feedback) {
      const err = createHttpError(400, "Missing required fields");
      err.additionalFields = {success: false} 
      return next(err);
    }
    const userDetail = await doesUserExist(id, next);
    if(!userDetail.success){
      return next(createHttpError(40, "User account doesn't exist"))
    }
    const userId = userDetail.userDetail._id;
    await feedbackModel.create({ userId, feedback });
      res.status(201).json({
      message: "Feedback Form submitted successfully",
    })
  } catch (error) {
    console.error("Error in submitting feedback form", error.message);
    const err = createHttpError(500, "Error in submitting feedback form");
    err.additionalFields = {success: false} 
    return next(err);
  }
};

// Function to insert contact details in the database
export const suggestionDetails = async (req, res,next) => {
  try {
    const id = req.userId;
    if (!id) {
      const err = createHttpError(400, "User ID is required");
      err.additionalFields = {success: false} 
      return next(err);
    }
    const {  genre, bookName, author } = req.body;
    if ( !genre || !bookName || !author) {
      const err = createHttpError(400, "Missing required fields");
      err.additionalFields = {success: false} 
      return next(err);
    }
    const userDetail = await doesUserExist(id, next);
    if(!userDetail.success){
      return next(createHttpError(40, "User account doesn't exist"))
    }
    const userId = userDetail.userDetail._id;
    await suggestionModel.create({
      userId,
      genre,
      bookName,
      author,
    });
    res.status(201).json({
      message: "Suggestion Form submitted successfully",
    })
  } catch (error) {
    console.error("Error in submitting suggestion form", error.message);
    const err = createHttpError(500, "Error in submitting suggestion form");
    err.additionalFields = {success: false} 
    return next(err);
  }
};

// Function to insert contact details in the database
export const contactDetails = async (req, res,next) => {
  try {
    const id = req.userId;
    const { concern } = req.body.details;
    if (!concern) {
          const err = createHttpError(400, "Missing required fields");
          err.additionalFields = {success: false} 
          return next(err);
    }
    console.log("All field are present")
    const userDetail = await doesUserExist(id, next);
    console.log("User Detail", userDetail)
    if(!userDetail.success){
      console.log("user doesn't exist")
      return next(createHttpError(40, "User account doesn't exist"))
    }
          console.log("user exist")
    const userId = userDetail.userDetail._id;
    await contactModel.create({ concern, userId });
    res.status(201).json({
      message: "Contact Form submitted successfully",
    })
  } catch (error) {
    console.error("Error in submitting contact form", error.message);
    const err = createHttpError(500, "Error in submitting contact form");
    err.additionalFields = {success: false} 
    return next(err);
  }
};

export const formResponse = async (req, res, next) => {
  try {
    const contactFormResponse = await contactModel.find();
    const suggestionFormResponse = await suggestionModel.find();
    const feedbackFormResponse = await feedbackModel.find();
    const formResponses = {
      contactFormResponse,
      suggestionFormResponse,
      feedbackFormResponse,
    };
    return res.status(200).json({
      message: "Form Responses",
      data: formResponses,
    });
  } catch (error) {
    console.log(error.message, "Error in fetching all the formResponses")
    const err = createHttpError(500, "Internal Server Error");
    err.additionalFields = {success: false} 
    next(err);
  }
};
