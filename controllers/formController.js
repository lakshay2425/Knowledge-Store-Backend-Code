const { insertContactDetails,  insertFeedbackDetails,insertSuggestionDetails} = require('../utilis/databaseOperations/insertFormDetails');
const debuglog = require("debug")("development:formController");


module.exports.feedbackDetails = async (req,res) => {
    try{
    const { feedback} = req.body;
    const {user_id} = req.user;
    const response = await insertFeedbackDetails(user_id, feedback); // Function to insert contact details in the database
    debuglog(response);
    res.json(response);
    } catch (err){
      res.status(500).send(`Server Error ${err}`);
    }
  };


module.exports.suggestionDetails = async (req,res) => {
    try{
    const { genre, bookName, author} = req.body;
    const {user_id} = req.user;
    const response = await insertSuggestionDetails(user_id ,genre, bookName, author); // Function to insert contact details in the database
    res.json(response);
    } catch (err){
      res.status(500).send(`Server Error ${err}`);
    }
  };


module.exports.contactDetails = async (req,res) => {
    try{
      const { concern} = req.body;
      const {user_id} = req.user;
    const response = await insertContactDetails(concern, user_id); // Function to insert contact details in the database
    res.json(response);
    } catch (err){
      res.status(500).send(`Server Error ${err}`);
    }
  };