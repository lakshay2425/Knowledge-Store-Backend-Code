const bookModel = require("../models/bookInfo");


//Function to fetch book details from database
module.exports.fetchBooks = async function (req, res) {
  try {
    const books = await bookModel.find(); // Function to fetch data from the database
    //console.log(books.length);
    res.json(books);
  } catch (error) {
    res.status(500).send(`Server Error, ${error.message}`);
  }
};


//Function to fetch specific book details 
module.exports.fetchBook = async function (req, res) {
  try {
    const { bookName } = req.params;
    if (!bookName) {
      return res.status(404).json({
        status: "Book Name is missing",
        success: false
      })
    }
    //console.log(bookName);
    const regex = new RegExp(bookName, 'i'); // Case-insensitive regular expression
    const book = await bookModel.findOne({
      $text: {
        $search: `${regex}`
      }
    }); //Function to fetch book data for the search functionality
    // console.log(book, "Book Details");
    if(!book){
      return res.status(200).json({
        message : "Book not found",
        found : false
      })
    }
    res.status(200).json({ 
      message: "Book details fetched", 
      bookDetails: book,
      found : true 
    });
  } catch (error) {
    console.error(`Error in fetchBook: ${error.message}`);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
}  