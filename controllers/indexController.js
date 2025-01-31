const bookModel = require("../models/bookInfo");


//Function to fetch book details from database
module.exports.fetchBooks = async function (req, res) {
  try {
    const books = await bookModel.find(); // Function to fetch data from the database
    res.status(200).json({
      data : books,
      success : true,
      message : " Book details fetched successfully"
    });
  } catch (error) {
    res.status(500).json({
      message :  "Error fetching books",
      success : false
    });
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
    const regex = new RegExp(bookName, 'i'); // Case-insensitive regular expression
    const book = await bookModel.findOne({
      $text: {
        $search: `${regex}`
      }
    });
    if (!book) {
      return res.status(200).json({
        message: "Book you're trying to search isn't  available",
        success : false,
        found: false
      })
    }
    res.status(200).json({
      message: "Book details fetched",
      data: book,
      success: true,
      found: true
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
}


module.exports.fetchRecommendedBooks = async (req, res) => {
  try {
    const bookArray = ["Rich Dad Poor Dad","Zero to One", "Pyschology of Money", "The Power of Your Subconcious Mind", "How Business Storytelling Works", "Atomic Habits", "Building a Second Brain"];
    const recommendedBookDetails = await bookModel.find({ title: { $in: bookArray } });
    return res.status(200).json({
      message: "Recommended Books fetched successfully",
      data: recommendedBookDetails,
      success: true
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server Error'
    })
  }
}