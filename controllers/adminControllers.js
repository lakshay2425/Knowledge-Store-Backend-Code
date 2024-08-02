const { insertBookDetails,} = require('../utilis/databaseOperations/adminPanel/insertBookDetails');
const {deleteBookDetails} = require("../utilis/databaseOperations/adminPanel/deleteBookDetails");
const {updateBookDetails} = require("../utilis/databaseOperations/adminPanel/updateBookDetails")

module.exports.bookDetails = async (req,res) => {
    try{
    const {price, quantity ,genre, book_name, author, img_link} = req.body;
    const response = await insertBookDetails(price, quantity ,genre, book_name, author, img_link); // Function to insert contact details in the database
    console.log(response);
    res.json(response);
    } catch (err){
      res.status(500).send(`Server Error ${err}`);
    }
  };

module.exports.deleteBook = async (req,res) => {
  try {
    const {bookName} = req.params;
    console.log(req.params);
    const response = await deleteBookDetails(bookName);
    res.json(response);
  } catch (error) {
    res.status(500).send(`Server Error ${err}`);
  }
};

module.exports.updateBook = async (req,res) => {
  try {
    const {author, genre, price, Quantity, book_name, img_link} = req.body;
    const response = await updateBookDetails(author, genre, price, Quantity, book_name, img_link);
    res.json(response);
  } catch (error) {
    res.status(500).send(`Server Error ${error}`);
  }
}