const { executeQuery } = require("../executeQuery");

// Function to delete book details by admin
module.exports.deleteBookDetails = async (book_name) => {
  try {
    // Check if the book exists
    const selectQuery = 'SELECT * FROM book_list WHERE book_name = ?';
    const selectParams = [book_name];
    console.log(selectParams);
    const selectResult = await executeQuery(selectQuery, selectParams);

    if (selectResult.length > 0) {
      // Book exists, proceed to delete
      const deleteQuery = 'DELETE FROM book_list WHERE book_name = ?';
      const deleteParams = [book_name];
      const deleteResult = await executeQuery(deleteQuery, deleteParams);

      return { success: true, message: 'Book Details Deleted successfully', result: deleteResult };
    } else {
      return { success: false, message: 'Book not found in the database' };
    }
  } catch (error) {
    console.error('Error deleting book details:', error);
    return { success: false, message: 'Book not deleted from the database', error: error.message };
  }
};
