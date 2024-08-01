const {executeQuery} = require("./executeQuery");


// Function to fetch all book data
module.exports.fetchData = async () => {
  try {
    const query = 'SELECT * FROM book_list;';
    const result = await executeQuery(query);
    return { success: true, message: 'Fetched all books data', result };
  } catch (error) {
    console.log(`Error fetching data:${error}, databaseOperation:fetchData`);
    return { success: false, message: 'Failed to fetch books data', error };
  }
};
  
  // Function to fetch books by genre
  module.exports.fetchBooks = async (genre) => {
    const query = 'SELECT * FROM book_list WHERE genre = ?;';
    const params = [genre];
    const result = await executeQuery(query, params);
    return { success: true, message: 'Fetched books by genre', result };
  };
  
  // Function to fetch book for search result
  module.exports.fetchBook = async (bookName) => {
    const query = 'SELECT * FROM book_list WHERE book_name = ?;';
    const params = [bookName];
    const result = await executeQuery(query, params);
    return { success: true, message: 'Fetched book for search result', result };
  };  