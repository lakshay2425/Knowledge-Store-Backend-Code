const {fetchBook, fetchBooks,  fetchData} = require('../utilis/databaseOperations/fetchData');

module.exports.fetchBooks = async function(req,res){
    try {
      const books = await fetchData(); // Function to fetch data from the database
      res.json(books);
    } catch (error) {
      res.status(500).send(`Server Error, ${error}`);
    }
  };

module.exports.fetchData = async function(req,res){
    try {
      const {genre} = req.params;
      const books = await fetchBooks(genre); //Functio to fetch books data category wise from the database
      res.json(books);
    } catch (error) {
      res.status(500).send(`Server Error ${error}`);
    }
  }

module.exports.fetchBook = async function(req,res){
  try {
    const {bookName} = req.params;
    const book = await fetchBook(bookName); //Function to fetch book data for the search functionality
    res.json(book);
  } catch (error) {
    console.error(`Error in fetchBook: ${error.message}`);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });  }
}  