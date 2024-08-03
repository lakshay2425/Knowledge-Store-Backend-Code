const {executeQuery} = require("./executeQuery");


// Function to fetch all book data
module.exports.fetchData = async () => {
  try {
    const query = 'SELECT * FROM book_list;';
    const result = await executeQuery(query);
    return { success: true, message: 'Fetched all books data', result };
  } catch (error) {
    console.log(`Error fetching data:${error.message}, databaseOperation:fetchData`);
    return { success: false, message: `Failed to fetch books data ${error.message}` };
  }
};
  
  // Function to fetch books by genre
  module.exports.fetchBooks = async (genre) => {
    try {
      const query = 'SELECT * FROM book_list WHERE genre  COLLATE utf8mb4_0900_ai_ci = ?;';
      const params = [genre];
      const result = await executeQuery(query, params);
      return { success: true, message: 'Fetched books by genre', result };
    } catch (error) {
      console.log(`Error fetching data:${error.message}, databaseOperation:fetchData`);
      return { success: false, message: `Failed to fetch books data by genre ${error.message}` };
    }
  };
  
  // Function to fetch book for search result
  module.exports.fetchBook = async (bookName) => {
    try {
      const query = 'SELECT * FROM book_list WHERE book_name COLLATE utf8mb4_0900_ai_ci = ?;';
      const params = [bookName];
      const result = await executeQuery(query, params);
      return { success: true, message: 'Fetched book for search result', result };
    } catch (error) {
      console.log(`Error fetching data:${error.message}, databaseOperation:fetchData`);
      return { success: false, message: `Failed to fetch books data by genre ${error.message}` };
    }
  };  