const userDetails = require("../utilis/fetchUserId");
const feedbackModel = require("../models/feedback");
const suggestionModel = require("../models/suggestion");
const contactModel = require("../models/contact");

//Function to insert feedback details in the database
module.exports.feedbackDetails = async (req, res) => {
  try {
    const { gmail, feedback } = req.body;
    if (!gmail || !feedback) {
      return res.status(400).json({
        message: "Gmail and feedback is required",
      });
    }
    const userDetail = await userDetails(gmail);
    const userId = userDetail._id.toString();
    const response = await feedbackModel.create({ userId, feedback });
    res.json(response);
  } catch (err) {
    res.status(500).send(`Server Error ${err.message}`);
  }
};

// Function to insert contact details in the database
module.exports.suggestionDetails = async (req, res) => {
  try {
    const { gmail, genre, bookName, author } = req.body;
    if (!gmail || !genre || !bookName || !author) {
      return res.status(400).json({
        message: "Gmail, genre, bookName and author is required",
      });
    }
    const userDetail = await userDetails(gmail);
    const userId = userDetail._id.toString();
    const response = await suggestionModel.create({
      userId,
      genre,
      bookName,
      author,
    });
    res.json(response);
  } catch (err) {
    return res.status(500).send(`Server Error ${err.message}`);
  }
};

// Function to insert contact details in the database
module.exports.contactDetails = async (req, res) => {
  try {
    const { gmail, concern } = req.body.details;
    if (!gmail || !concern) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const userDetail = await userDetails(gmail);
    const userId = userDetail._id.toString();
    const response = await contactModel.create({ concern, userId });
    res.json(response);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: `Server Error ${err.message}`,
    });
  }
};

module.exports.formResponse = async (req, res) => {
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
      success: true,
      message: "Form Responses",
      data: formResponses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Server Error ${err.message}`,
    });
  }
};
