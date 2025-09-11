import findUserById from "../utilis/fetchUserId.js";
import feedbackModel from "./feedback.js";
import suggestionModel from "./suggestion.js";
import contactModel from "./contact.js";
import createHttpError from "http-errors";
import { asyncHandler, dbOperation } from "../utilis/advanceFunctions.js";
import { validateMissingFields } from "../utilis/validateMissingFields.js";

export const doesUserExist = async (userId, next) => {
  const userDetail = await findUserById(userId, next);
  if (!userDetail) {
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
export const feedbackDetails = asyncHandler(async (req, res, next) => {
  const id = req.userId;
  const { feedback } = req.body;

  if (!feedback) {
    const err = createHttpError(400, "Missing required fields");
    err.additionalFields = { success: false }
    return next(err);
  }

  const userDetail = await doesUserExist(id, next);
  if (!userDetail.success) {
    return next(createHttpError(40, "User account doesn't exist"))
  }

  const userId = userDetail.userDetail._id;

  await dbOperation(
    () => feedbackModel.create({ userId, feedback }),
    `Failed to submit feedback form for user ${userId}`
  )
  res.status(201).json({
    message: "Feedback Form submitted successfully",
  })
});

// Function to insert contact details in the database
export const suggestionDetails = asyncHandler(async (req, res, next) => {
  const id = req.userId;
  const { genre, bookName, author } = req.body;

  const fieldsMissing = validateMissingFields({ genre, bookName, author })
  if (fieldsMissing) {
    const err = createHttpError(400, "Missing required fields");
    return next(err);
  }

  const userDetail = await doesUserExist(id, next);
  if (!userDetail.success) {
    return next(createHttpError(40, "User account doesn't exist"))
  }

  const userId = userDetail.userDetail._id;
  await dbOperation(
    () => suggestionModel.create({
      userId,
      genre,
      bookName,
      author,
    }), `Failed to submit suggestion form for user with $${userId}`
  );

  res.status(201).json({
    message: "Suggestion Form submitted successfully",
  })
});

// Function to insert contact details in the database
export const contactDetails = asyncHandler(async (req, res, next) => {
  const id = req.userId;
  const { concern } = req.body.details;
  if (!concern) {
    const err = createHttpError(400, "Missing required fields");
    err.additionalFields = { success: false }
    return next(err);
  }

  const userDetail = await doesUserExist(id, next);

  if (!userDetail.success) {
    return next(createHttpError(40, "User account doesn't exist"))
  }

  const userId = userDetail.userDetail._id;
  await dbOperation(
    () => contactModel.create({ concern, userId }),
    `Failed to submit contact form with userId ${userId}`
  );
  res.status(201).json({
    message: "Contact Form submitted successfully",
  })
});

export const formResponse = asyncHandler(async (req, res) => {
  const contactFormResponse = await dbOperation(() => contactModel.find(), "Failed to fetch all contact form responses");
  const suggestionFormResponse = await dbOperation(() => suggestionModel.find(), "Failed to fetch all suggestion form responses");
  const feedbackFormResponse = await dbOperation(() => feedbackModel.find(), "Failed to fetch all feedback form responses");

  const formResponses = {
    contactFormResponse,
    suggestionFormResponse,
    feedbackFormResponse,
  };

  return res.status(200).json({
    message: "Form Responses",
    data: formResponses,
  });
});
