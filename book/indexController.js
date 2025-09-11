import { asyncHandler, dbOperation } from "../utilis/advanceFunctions.js";
import bookModel from "./bookInfo.js";
import  {getCachedData, setCacheData} from "../utilis/fetchDataFromRedis.js";
import createHttpError from "http-errors";

//Function to fetch book details from database
export const fetchBooks = asyncHandler(async function (req, res) {
    const key = "allBooks";
    const cachedData = await getCachedData(key);
    if(cachedData){
      return res.status(200).json({
        data: cachedData,
        success: true,
        message : "Book details fetched successfully",
      })
    }
    const books = await dbOperation(
      ()=> bookModel.find(),
      "Failed to fetch books"
    );
    await setCacheData(key, books);
    res.status(200).json({
      data: books,
      success: true,
      message: "Book details fetched successfully"
    });
});


//Function to fetch specific book details 
export const fetchBook = asyncHandler(async function (req, res, next) {
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
    }
    else{
    const regex = new RegExp(bookName, 'i'); // Case-insensitive regular expression
    const book = await dbOperation(
      ()=> bookModel.find({
      $text: {
        $search: `${regex}`
      }
    }),
    `Failed to find book info ${bookName}`
    );
    if (book.length == 0) {
      const err = new Error("Book you're trying to search isn't available");
      err.statusCode = 200;
      err.additonalFields = {
        success: false,
        found: false
      }
      return next(err);
    }
    await setCacheData(key, book);
    res.status(200).json({
      message: "Book details fetched",
      data: book,
      numberOfResult: book.length,
      success: true,
      found: true
    });
    }
})


export const fetchRecommendedBooks = asyncHandler(async (req, res) => {
    const key = "recommendedBooks";
    const cachedData = await getCachedData(key);
    if(cachedData){
      return res.status(200).json({
        data: cachedData,
        success: true,
        message : "Recommended Books fetched successfully",
      })
    }
    else{
    const bookArray = ["Rich Dad Poor Dad", "Zero to One", "Pyschology of Money", "The Power of Your Subconcious Mind", "How Business Storytelling Works", "Atomic Habits", "Building a Second Brain"];
    const recommendedBookDetails = await dbOperation(
      ()=> bookModel.find({ title: { $in: bookArray } }),
      "Failed to fetch recommended books"
    );
    await setCacheData(key, recommendedBookDetails);
    return res.status(200).json({
      message: "Recommended Books fetched successfully",
      data: recommendedBookDetails,
      success: true
    })
    }
})