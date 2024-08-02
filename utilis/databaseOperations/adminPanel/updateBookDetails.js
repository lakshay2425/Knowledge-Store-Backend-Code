const {executeQuery} = require("../executeQuery");


// Function to book details by admin
module.exports.updateBookDetails = async (author, genre, price, quantity, book_name, img_link) => {
    try {
        // Check if the book exists
        const selectQuery = 'SELECT * FROM book_list WHERE book_name = ?';
        const selectParams = [book_name];
        const selectResult = await executeQuery(selectQuery, selectParams);

        if (selectResult.length > 0){
            const updationQuery = 'UPDATE book_list SET author = ?, genre = ?, price = ?, Quantity = ?, img_link = ?  WHERE book_name = ?';
            const updationParams = [author, genre, price, quantity,  img_link ,book_name,];
            const updationResult = await executeQuery(updationQuery,updationParams);
            console.log(updationResult.info);
            if(updationResult){
                return { success: true, message: 'Book details updated in the database'};
            }else{
                return { success: false, message: 'Book details not updated in the database' };
            }
        }else{
            return { success: false, message: 'Book not found in the database' };
        }
    } catch (error) {
        console.error('Error updating book details:', error);
    return { success: false, message: 'Failed in updating book details', error: error.message };
    }
  };