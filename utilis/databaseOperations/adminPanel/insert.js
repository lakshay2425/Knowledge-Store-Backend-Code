const {executeQuery} = require("../executeQuery");


// Function to book details by admin
module.exports.insertBookDetails = async (price, quantity, genre, book_name, author, img_link) => {
    const query = 'INSERT INTO book_list (author, genre, price, book_name, Quantity, img_link) VALUES (?,?,?,?,?,?);';
    const params = [author, genre, price, book_name, quantity, img_link];
    console.log(params);
    const result = await executeQuery(query, params);
    return { success: true, message: 'Book info inserted successfully', result };
  };