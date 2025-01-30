const bookModel = require("../models/bookInfo");
const wishlistModel = require("../models/wishlist");
const itemSchema = require("../utilis/joiValidator");
const {deleteAllProducts} = require("../utilis/deleteAll"); 

const validateInput = (bookName, email) => {
  const { error, value } = itemSchema.validate({ bookName, email });
  if (error) {
    throw new Error(error.details[0].message);
  }
  return value;
};

async function addBookToWishlist(bookName, email) {
  try {
    const value = validateInput(bookName, email);
    const wishlist = await wishlistModel.create({ bookName, email });
    return true;
  } catch (error) {
    return false;
  }
}
//Function to add a book to wishlist
module.exports.addToWishlist = async (req, res) => {
  try {
    const { bookName } = req.params;
    const email = req.body.email; // assuming you have user data available in req.user

    if (!bookName || !email) {
      return res.status(400).json({ error: "Book name and email is required" });
    }
    const result = addBookToWishlist(bookName, email);
    if (result) {
      return res.status(201).json({
        message: "Book added to the Wishlist",
        success: true
      })
    } else {
      return res.status(404).json({
        message: "Failed to place the order Try again later",
        success: false
      })
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
      error: "Server error"
    });
  }
};


//Function to fetch wishlist books of a user
module.exports.fetchWishlistData = async (req, res) => {
  try {
    const email = req.body.email;
    const regex = new RegExp(email, 'i'); // Case-insensitive regular expression
    const data = await wishlistModel.find({ email: regex });
    if (data.length > 0) {
      const booksName = data.map(book => book.bookName);
      const bookDetails = await bookModel.find({
        $or: booksName.map(name => ({ title: { $regex: new RegExp(name, 'i') } }))
      });
      res.status(200).json(bookDetails);
    } else {
      res.status(200).json({
        message: "No books found in wishlist", success: false
      });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server error" });
  }
};


//Function to delete a book from user wishlist section
module.exports.deleteWishlistProduct = async (req, res) => {
  try {
    const { email } = req.body;
    const { bookName } = req.params;

    if (!email || !bookName) {
      return res.status(404).json({
        message: "Email and bookName is required",
        success: fasle
      })
    }

    const regex = new RegExp(email, 'i'); // Case-insensitive regular expression
    const regexBook = new RegExp(bookName, 'i'); // Case-insensitive regular expression
    const data = await wishlistModel.findOneAndDelete({ $and: [{ bookName: regexBook }, { email: regex }] });
    res.status(200).json({ message: "Book Deleted Successfully", bookName });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: `Server error ${error.message}` });
  }
}

module.exports.moveBookFromCartToWishlist = async (req, res) => {
  try {
    const { bookName, email } = req.body.data;
    const bookDetailsFromCart = await cartModel.findOneAndDelete({
      $and: [
        { bookName },
        { email }
      ]
    });
    const result = await addBookToWishlist(bookName, email);
    if (result) {
      return res.status(201).json({
        message: "Moved book from  cart to wishlist successfully",
        success: true
      })
    } else {
      const book = await cartModel.create({
        bookName,
        email
      })
      return res.status(404).json({
        message: "Failed to move the book from cart to wishlist Try again later",
        success: false
      })
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false
    })
  }
}

module.exports.deleteAllWishlistProduct = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({
        message: "Email is required",
        success: false
      })
    }
    const response = await deleteAllProducts(email, "wishlist");
    return res.status(200).json({
      message : "All wishlist products deleted successfully",
      success : true
    })
  } catch (error){
    return res.status(500).json({
      success : false,
      message : "Error in deleting all products, Try again later"
    })
  }
}