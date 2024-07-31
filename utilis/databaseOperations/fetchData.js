const {executeQuery} = require("./executeQuery");
const debuglog = require("debug")("development:databaseOperationfetchData");


// Function to fetch all book data
module.exports.fetchData = async () => {
  try {
    const query = 'SELECT * FROM book_list;';
    const result = await executeQuery(query);
    debuglog(result);
    return { success: true, message: 'Fetched all books data', result };
  } catch (error) {
    debuglog('Error fetching data:', error);
    return { success: false, message: 'Failed to fetch books data', error };
  }
};
  
  // Function to fetch books by genre
  module.exports.fetchBooks = async (genre) => {
    debuglog(genre);
    const query = 'SELECT * FROM book_list WHERE genre = ?;';
    const params = [genre];
    const result = await executeQuery(query, params);
    return { success: true, message: 'Fetched books by genre', result };
  };
  