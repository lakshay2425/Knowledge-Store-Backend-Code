const wishlistModel = require("../models/wishlist"); 
const cartModel = require("../models/cart");
const { fetchBookDetails } = require("../utilis/databaseOperations/fetchData");
//const joiValidator = require("../utilis/joiValidator");
//const Joi = require('joi');


module.exports.addToWishlist = async (req, res) => {
  try {
    const { bookName } = req.params;
    //const userId = req.user._id; // assuming you have user data available in req.user

    if (!bookName) {
      return res.status(400).json({ error: "Book name is required" });
    }
//    Use Joi.attempt() to validate the data against your schema
//    const validatedData = Joi.attempt(data, schema);
    const wishlist = await wishlistModel.create({ bookName });
    res.status(201).json(wishlist);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports.fetchWishlistData = async (req,res) => {
    try {
        const data = await wishlistModel.find();
        const booksName = data.map(book => book.bookName); 
        const bookDetails = await fetchBookDetails(booksName);
        res.status(201).json(bookDetails);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Server error" });
    }
};

module.exports.addToCart = async (req, res) => {
  try {
    const { bookName } = req.params;
    //const userId = req.user._id; // assuming you have user data available in req.user

    if (!bookName) {
      return res.status(400).json({ error: "Book name is required" });
    };
//   Use Joi.attempt() to validate the data against your schema
//   const validatedData = Joi.attempt(data, schema);
    const wishlist = await cartModel.create({ bookName });
    res.status(201).json(wishlist);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server error" });
  }
};


module.exports.fetchCartData = async (req,res) => {
  try {
      const data = await cartModel.find();
      const booksName = data.map(book => book.bookName); 
      const bookDetails = await fetchBookDetails(booksName);
      res.status(201).json(bookDetails);
  } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: "Server error" });
  }
};

module.exports.deleteCartProduct = async(req,res) =>{
  try {
    const { bookName } = req.params;
    console.log(bookName);
    const data = await cartModel.findOneAndDelete({bookName});
    console.log(data);
    res.status(201).json("Book Deleted Successfully");
} catch (error) {
    console.error(error.message);
    res.status(500).json({ error: `Server error ${error.message}` });
}
}