const wishlistModel = require("../models/wishlist"); 
const cartModel = require("../models/cart");
const { fetchBookDetails } = require("../utilis/databaseOperations/fetchData");
const itemSchema = require("../utilis/joiValidator");

const validateInput = (bookName, email) => {
  const { error, value } = itemSchema.validate({bookName, email});
  if (error) {
      throw new Error(error.details[0].message);
  }
  return value;
};


module.exports.addToWishlist = async (req, res) => {
  try {
    const { bookName } = req.params;
    const email = req.body.email; // assuming you have user data available in req.user
    console.log(email);

    if (!bookName) {
      return res.status(400).json({ error: "Book name is required" });
    }
//   Use Joi.attempt() to validate the data against your schema
    const value = validateInput(bookName, email);
    console.log(value);
    const wishlist = await wishlistModel.create( {bookName, email } );
    res.status(201).json(wishlist);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports.fetchWishlistData = async (req,res) => {
    try {
        const email = req.body.email;
        console.log(email);
        const data = await wishlistModel.find({email : email});
        const booksName = data.map(book => book.bookName); 
        const bookDetails = await fetchBookDetails(booksName);
        res.status(200).json(bookDetails);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Server error" });
    }
};

module.exports.addToCart = async (req, res) => {
  try {
    const { bookName } = req.params;
    const {email} = req.body; // assuming you have user data available in req.user
    console.log(email, req.body, bookName);
    if (!bookName) {
      return res.status(400).json({ error: "Book name is required" });
    };
//   Use Joi.attempt() to validate the data against your schema
    const value = validateInput(bookName, email);
    console.log(value);
    const wishlist = await cartModel.create({bookName, email });
    res.status(201).json(wishlist);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server error" });
  }
};


module.exports.fetchCartData = async (req,res) => {
  try {
      const {email} = req.body;
      console.log(email);
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      };
      const data = await cartModel.find({email : email});
      // console.log(data);
      const booksName = data.map(book => book.bookName); 
      // console.log(booksName);
      const bookDetails = await fetchBookDetails(booksName);
      res.status(200).json(bookDetails);
  } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: `Server error ${error.message}` });
  }
};

module.exports.deleteCartProduct = async(req,res) =>{
  try {
    const {email} = req.body;
    const { bookName } = req.params;
    console.log(bookName, email);
    const data = await cartModel.findOneAndDelete({$and : [{bookName : bookName}, {email : email}]});
    res.status(201).json("Book Deleted Successfully");
} catch (error) {
    console.error(error.message);
    res.status(500).json({ error: `Server error ${error.message}` });
}
}


module.exports.deleteWishlistProduct = async(req,res) =>{
  try {
    const email = req.body.email;
    const { bookName } = req.params;
    console.log(bookName, email);
    const data = await wishlistModel.findOneAndDelete({$and : [{bookName : bookName}, {email : email}]});
    res.status(201).json("Book Deleted Successfully");
} catch (error) {
    console.error(error.message);
    res.status(500).json({ error: `Server error ${error.message}` });
}
}