const bookModel = require("../models/bookInfo");
const {getCachedData, setCacheData} = require("../utilis/fetchDataFromRedis");
const createHttpError = require("http-errors");

//Function to fetch book details from database
module.exports.fetchBooks = async function (req, res,next) {
  try {
    const key = "allBooks";
    const cachedData = await getCachedData(key);
    if(cachedData){
      return res.status(200).json({
        data: cachedData,
        success: true,
        message : "Book details fetched successfully",
      })
    }
      const books = await bookModel.find(); 
      await setCacheData(key, books);
      await getCachedData(key);
      res.status(200).json({
        data : books,
        success : true,
        message : "Book details fetched successfully"
      });
  } catch (error) {
    console.log("Failed to fetch books data",error.message);
    next(createHttpError(500, "Failed to fetch books data"))
  }
};


//Function to fetch specific book details 
module.exports.fetchBook = async function (req, res, next) {
  try {
    const { bookName } = req.params;
    if (!bookName) {
      return next(createHttpError(400, "Book Name is missing"))
    }
    const key = bookName;
    const cachedData = await getCachedData(key);
    if(cachedData){
      return res.status(200).json({
        message: "Book details fetched",
        data: cachedData,
        numberOfResult : cachedData.length,
        success: true,
        found: true
      })
    }else{
      const regex = new RegExp(bookName, 'i'); // Case-insensitive regular expression
      const book = await bookModel.find({
        $text: {
          $search: `${regex}`
        }
      });
      if (book.length == 0) {
        const err = new Error("Book you're trying to search isn't available");
        err.statusCode = 200;
        err.additonalFields = {
          success : false,
          found: false
        }
        return next(err);
      }
      await setCacheData(key, book);
      res.status(200).json({
        message: "Book details fetched",
        data: book,
        numberOfResult : book.length,
        success: true,
        found: true
      });
    }
  } catch (error) {
    console.log(`Error in fetching specific bookDetails`,error.message);
    return next(createHttpError(500, "Internal Server Error"));
  }
}


module.exports.fetchRecommendedBooks = async (req, res, next) => {
  try {
    const key = "recommendedBooks";
    const cachedData = await getCachedData(key);
    if(cachedData){
      return res.status(200).json({
        data: cachedData,
        success: true,
        message : "Recommended Books fetched successfully",
      })
    }else{
      const bookArray = ["Rich Dad Poor Dad","Zero to One", "Pyschology of Money", "The Power of Your Subconcious Mind", "How Business Storytelling Works", "Atomic Habits", "Building a Second Brain"];
      const recommendedBookDetails = await bookModel.find({ title: { $in: bookArray } });
      await setCacheData(key, recommendedBookDetails);
      return res.status(200).json({
        message: "Recommended Books fetched successfully",
        data: recommendedBookDetails,
        success: true
      })
    }
  } catch (error) {
    console.error("Error in fetching recommended books details", error.message);
    next(createHttpError(500, "Internal Server Error"));
  }
}