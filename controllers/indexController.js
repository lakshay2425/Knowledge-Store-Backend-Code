const bookModel = require("../models/bookInfo");
const {getCachedData, setCacheData} = require("../utilis/fetchDataFromRedis")
// const {redisClient} = require("../config/redis");

//Function to fetch book details from database
module.exports.fetchBooks = async function (req, res) {
  try {
    const key = "allBooks";
    const cachedData = await getCachedData(key);
    if(cachedData){
      // console.log("Data from redis");
      return res.status(200).json({
        data: cachedData,
        success: true,
        message : "Book details fetched successfully",
      })
    }
      const books = await bookModel.find(); // Function to fetch data from the database
      await setCacheData(key, books);
      await getCachedData(key);
      // console.log("Data stored in redis in index controller");
      res.status(200).json({
        data : books,
        success : true,
        message : " Book details fetched successfully"
      });
  } catch (error) {
    console.log(error.message);
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
      if (!book) {
        return res.status(200).json({
          message: "Book you're trying to search isn't  available",
          success : false,
          found: false
        })
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
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
}


module.exports.fetchRecommendedBooks = async (req, res) => {
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
    return res.status(500).json({
      success: false,
      message: 'Server Error'
    })
  }
}