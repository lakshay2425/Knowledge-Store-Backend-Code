const bookModel = require("../models/bookInfo");
const itemSchema = require("../utilis/joiValidator");
const {deleteAllProducts, deleteBook} = require("../utilis/deleteAll"); 
const wishlistModel = require("../models/wishlist");
const cartModel = require("../models/cart");
const createHttpError = require("http-errors");

const validateInput = (bookName, email) => {
  const { error, value } = itemSchema.validate({ bookName, email });
  if (error) {
    console.log("Invalid Input",error.message)
    throw new Error(error.details[0].message);
  }
  return value;
};

async function addBookToWishlist(bookName, email) {
  try {
    const value = validateInput(bookName, email);
    if(value){
      const existingBook = await wishlistModel.findOne({ bookName, email });
      if (existingBook) {
        return {
          message: "Book already exists in the wishlist",
          success: false,
          exist: true
        }; 
      }
        await wishlistModel.create({ bookName, email });
        return {
          message: "Book added to wishlist",
          success: true,
          exist: false
        }; 
    }
  } catch (error){
    console.error("Failed to add book to wishlist", error.message);
    return false;
  }
}

//Function to add a book to wishlist
module.exports.addToWishlist = async (req, res, next) => {
  try {
    const {bookName} = req.params;
    const {email} = req.body; 
    if (!bookName || !email) {
      return next(createHttpError(400, "Book name and email is required"));
    }
    const result = await addBookToWishlist(bookName, email);
    if (result.success) {
      return res.status(201).json({
        message: "Book added to cart successfully",
        success: true,
        exist: false
      })
    } else {
      const doesExist = result.exist;
      return res.status(doesExist? 409 : 404).json({
        message: doesExist? "Book already exist in wishlist" : "Falied to add book to wishlist",
        success: false,
        exist: doesExist
      })
    }
  } catch (error) {
    console.error("Error in adding book to wishlist",error.message);
    next(createHttpError(500, "Internal Server error in adding book to wishlist"))
  }
};

//Function to fetch wishlist books of a user
module.exports.fetchWishlistData = async (req, res, next) => {
  try {
    const email = req.query.email;
    if(!email){
      return next(createHttpError(400, "Missing required field"))
    }
    const regex = new RegExp(email, 'i'); // Case-insensitive regular expression
    const data = await wishlistModel.find({ email: regex });
    if (data.length > 0) {
      const booksName = data.map(book => book.bookName);
      const bookDetails = await bookModel.find({
        $or: booksName.map(name => ({ title: { $regex: new RegExp(name, 'i') } }))
      });
      res.status(200).json({
        message: "User Wishlist data fetch successfully",
        bookDetails,
        numberOfBooks: bookDetails.length 
      });
    } else {
      res.status(200).json({
        message: "No books found in wishlist", 
        numberOfBooks: 0
      });
    }
  } catch (error) {
    console.error("Error in fetching user's wishlist book",error.message);
    next(createHttpError(500, "Server Error"));
  }
};

//Function to delete a book from user wishlist section
module.exports.deleteWishlistProduct = async (req, res, next) => {
  try {
    const { bookName, email } = req.query;
    if (!email || !bookName) {
      const err = createHttpError(400, "Required field are missing");
      err.additionalFields = {success: false};
      return next(err);
    }
    await deleteBook(bookName, email, "Wishlist", res, next);
  } catch (error) {
    console.error("Error in deleting the book from wishlist",error.message);
    const err = createHttpError(500, "Server error"); 
    err.additionalFields = {success: false};
    next(err);
  }
}

module.exports.moveBookFromCartToWishlist = async (req, res, next) => {
  try {
    const { bookName, email } = req.body;
    if(!bookName || !email){
      const err = createHttpError(400, "Missing fields required");
      err.additionalFields = {success: false};
      return next(err);
  }
    await cartModel.findOneAndDelete({
      $and: [
        { bookName },
        { email }
      ]
    });
    const result = await addBookToWishlist(bookName, email);
    if (result.success){
      return res.status(201).json({
        message: "Moved book from  cart to wishlist successfully",
        success: true,
        exist: false,
      })
    } 
    else {
      const doesExist = result.exist;
      if(!doesExist){
        await cartModel.create({
          bookName,
          email
        })
      }
      return res.status(doesExist? 409 : 404).json({
        message: doesExist? "Book already exist in wishlist" : "Failed to move the book from cart to wishlist Try again later",
        success: false,
        exist: doesExist
      })
    }
  } catch (error) {
    console.error("Error in moving book from cart to wishlist", error.message);
      const err = createHttpError(500, "Internal Server Error");
      err.additionalFields = {success: false};
      return next(err);
  }
}

module.exports.deleteAllWishlistProduct = async (req, res, next) => {
  try {
    const { email } = req.query;
    if (!email) {
      return next(createHttpError(400, "Missing required field"))
    }
    await deleteAllProducts(email, "wishlist");
    return res.status(200).json({
      message : "All wishlist products deleted successfully",
      success : true
    })
  } catch (error){
    console.error("Error in deleting all wishlist product", error.message);
    next(createHttpError(500, "Error in deleting all products, Try again later"));
  }
}