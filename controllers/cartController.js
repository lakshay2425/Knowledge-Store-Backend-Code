const cartModel = require("../models/cart");
const itemSchema = require("../utilis/joiValidator");
const {deleteAllProducts} = require("../utilis/deleteAll");
const wishlistModel = require("../models/wishlist"); 
const {deleteBook} = require("../utilis/deleteAll");
const createHttpError = require("http-errors");

const validateInput = (bookName, email) => {
  const { error, value } = itemSchema.validate({ bookName, email });
  if (error) {
    console.log(`Invalid Input ${bookName, email}`,error.message)
    throw new Error(error.details[0].message);
  }
  return value;
};


async function addBookToCart(bookName, email, rentalPeriod, next) {
  try {
    const value = validateInput(bookName, email);
    if(value){
      const existingBook = await cartModel.findOne({ bookName, email });
      if (!existingBook) {
        await cartModel.create({ bookName, email, days: rentalPeriod });
        return {
          message: "Book added to cart",
          success: true,
          exist: false
        }; 
      }
      return {
          message: "Book already exists in the cart",
          success: false,
          exist: true
        };
    }
  } catch (error){
    console.log("Error in adding book to cart",error.message)
    const err = createHttpError(500, "Internal Server Error")
    err.additonalFields = {
          success: false,
          exist: false
    }    
    next(err);
  }
}

//Function to update number of days in cart
module.exports.updateCart = async (req,res,next)=>{
  const {days, bookName} = req.body;
  
  if(!days || !bookName){
    console.log("Missing days and bookName")
    const err = createHttpError(400, "Missing days and bookName")
    err.additonalFields = {
        success: false,
        updated: false
    }    
    return next(err)
  }

  try{
    const bookDetails = await cartModel.findOneAndUpdate({title : bookName}, {days}, {new : true});
    if(bookDetails){
      return res.status(200).json({
        message : "Number of days updated in Book information successfully",
        success : true,
        updated: true,
     })
  }}
  catch(err){
    console.log("Error in updating cart", err.message);
    const error = createHttpError(500, "Missing days and bookName")
    error.additonalFields = {
        success: false,
        updated: false
    }
    next(error);
  }
}

//Function to add a book to user cart section
module.exports.addToCart = async (req, res,next) => {
  try {
    const { bookName, email , rentalPeriod} = req.body; // assuming you have user data available in req.user
    if (!bookName || !email ||!rentalPeriod){
      console.log("Missing required fields") 
      return next(createHttpError(400, "Missing required fields"))
    };
    const result = await addBookToCart(bookName, email, rentalPeriod,next);
    if (!result.success) {
     if(result.exist){
        return res.status(409).json({ 
        message: "Book already exist in cart",
        success: false,
        exist: true
        })
      }
    }
    return res.status(201).json({
        message: "Book added to cart successfully",
        success: true,
        exist: false
      })
  } catch (error) {
    console.log("Failed to add book to cart", error.message);
    return next(createHttpError(500, "Internal Server Error"));
  }
};

//Function to fetch  book details from user cart section
module.exports.fetchCartData = async (req, res, next) => {
  try {
    const email = req.body.email;
    if (!email) {
      return next(createHttpError(400, "Email is required"))
    }; 

    const userCartWithBookInfo = await cartModel.aggregate([
        { $match: { email: email } },
        {
          $lookup: {
            from: "books",
            localField: "bookName",
            foreignField: "title",
            as: "bookInfo"
          }
        },
        { $unwind: "$bookInfo" },
        {
          $project: {
            _id: 0,
            bookName: 1,
            days: 1,
            author : "$bookInfo.author", 
            description:"$bookInfo.description",
            genre: "$bookInfo.genre",
            price: "$bookInfo.price",
            imageLink : "$bookInfo.imageLink",
            reviews: "$bookInfo.reviews",
            rating : "$bookInfo.rating",
            type: "$bookInfo.type",
          }
        }
    ]);
    return res.status(200).json({
        message:  `${userCartWithBookInfo.length > 0 ? "User Cart data fetch successfully" : "No Data in the cart"}`,
        bookDetails : userCartWithBookInfo,
        numberOfBooks: userCartWithBookInfo.length
      });
  } catch (error) {
    console.log(error.message, "Failed to fetch user cart data");
    const err = createHttpError(500, "Failed to fetch user cart data")
    err.additonalFields = {success: false};
    next(err);
  };
}


//Function to delete a book from user cart section
module.exports.deleteCartProduct = async (req, res,next) => {
  try {
    const { bookName, email } = req.query;
    if (!email || !bookName) {
      const err = createHttpError(400, "Missing required parameters")
      err.additonalFields = {success: false};
      return next(err);
    };
    await deleteBook(bookName, email, "Cart", res);
  } catch (error) {
    console.log(error.message, "Error in deleting book from user's cart")  
    const err = createHttpError(500, "Error in deleting book from user's cart due to internal server error")
    err.additonalFields = {success: false};
    next(err);
  }
}

module.exports.moveBookFromWishlisttoCart = async (req, res,next) => {
  try {
    const { bookName, email } = req.body;

    if (!email || !bookName) {
      const err = createHttpError(400, "Missing required parameters")
      err.additonalFields = {success: false};
      return next(err);
    }
    
    await wishlistModel.findOneAndDelete({
      $and: [
        { bookName },
        { email }
      ]
    });
    const result = await addBookToCart(bookName, email,next);
    if (!result.success) {
      if(result.exist){
        return res.status(409).json({ 
        message: "Book already exist in cart",
        success: false,
        exist: true
        })
      }
    } 
    return res.status(201).json({
        message: "Book added to cart successfully",
        success: true,
        exist: false
      })
  } catch (error) {
    console.error("Error in moving book from wishlist to cart", error.message)
    return res.status(500).json({
      message: error.message,
      success: false
    });
  }
};


module.exports.deleteAllCartProduct = async (req, res,next) => {
  try {
    const { email } = req.query;
    if (!email) {
      console.error("Email is missing");
      const err = createHttpError(400, "Email is missing");
      err.additonalFields = {success: false}
      return next(err);
    }
    await deleteAllProducts(email, "cart");
    return res.status(200).json({
      message : "All cart products deleted successfully",
      success : true
    })
  } catch (error){
    console.log("Error ind deleting all cart product", error.message);
    const err = createHttpError(500, "Internal Server Error");
    err.additonalFields = {success: false};
    next(err);
  }
}