const {executeQuery} = require("./executeQuery");

// Function to insert suggestion details
module.exports.insertSuggestionDetails = async (user_id, genre, bookName, author,res) => {
    try {
      const query = 'INSERT INTO suggestion_book (user_id, genre, book_name, author) VALUES (?,?,?,?);';
      const params = [user_id, genre, bookName, author];
      console.log(params);
      const result = await executeQuery(query, params);
      return { success: true, message: 'Suggestion inserted successfully', result };
    } catch (error) {
      res.status(500).send(`Failed to insert suggestion book details, ${error.message}`);
    }
  };
  
  
  
  // Function to insert feedback details
  module.exports.insertFeedbackDetails = async (user_id, feedback,res) => {
    try {
      const query = 'INSERT INTO feedback (user_id, feedback) VALUES (?,?);';
      const params = [user_id, feedback];
      console.log(params);
      const result = await executeQuery(query, params);
      return { success: true, message: 'Feedback inserted successfully', result };
    } catch (error) {
      res.status(500).send(`Failed to insert feedback details, ${error.message}`);
    }
  };
  
  
  
  // Function to insert contact details
  module.exports.insertContactDetails = async (user_id, concern, res) => {
    try {
      const query = 'INSERT INTO contact (user_id, concern) VALUES (?,?);';
      const params = [user_id, concern];
      console.log(params);
      const result = await executeQuery(query, params);
      return { success: true, message: 'Contact info inserted successfully', result };
    } catch (error) {
      res.status(500).send(`Failed to insert contact details, ${error.message}`);      
    }
  };
  