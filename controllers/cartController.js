const cartModel = require("../models/cart");
const itemSchema = require("../utilis/joiValidator");
const bookModel = require("../models/bookInfo");
const {deleteAllProducts} = require("../utilis/deleteAll");

const validateInput = (bookName, email) => {
  const { error, value } = itemSchema.validate({ bookName, email });
  if (error) {
    throw new Error(error.details[0].message);
  }
  return value;
};


async function addBookToCart(bookName, email) {
  try {
    //Use Joi.attempt() to validate the data against your schema
    const value = validateInput(bookName, email);
    const cart = await cartModel.create({ bookName, email });
    return true;
  } catch (error) {
    return false;
  }
}


//Function to add a book to user cart section
module.exports.addToCart = async (req, res) => {
  try {
    const { bookName } = req.params;
    const { email } = req.body; // assuming you have user data available in req.user
    if (!bookName || !email) {
      return res.status(400).json({ error: "Book name and email is required" });
    };
    const result = await addBookToCart(bookName, email);
    if (result) {
      return res.status(201).json({
        message: "Book added to cart successfully",
        success: true
      })
    } else {
      return res.status(404).json({
        success: false,
        message: "Falied to add book to cart"
      })
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Function to fetch  book details from user cart section
module.exports.fetchCartData = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    };

    const regex = new RegExp(email, 'i'); // Case-insensitive regular expression
    const data = await cartModel.find({ email: regex });
    if (data.length > 0) {
      const booksName = data.map(book => book.bookName);
      const bookDetails = await bookModel.find({
        $or: booksName.map(name => ({ title: { $regex: new RegExp(name, 'i') } }))
      });
      return res.status(200).json({
        message: "User Cart data fetch successfully", bookDetails,
        numberOfBooks: bookDetails.length
      });
    } else {
      return res.status(200).json({
        message: "No books added to cart",
        numberOfBooks: 0
      })
    }

  } catch (error) {
    res.status(500).json({ error: `Server error ${error.message}` });
  }
};


//Function to delete a book from user cart section
module.exports.deleteCartProduct = async (req, res) => {
  try {
    const { email } = req.body;
    const { bookName } = req.params;
    if (!email || !bookName) {
      return res.status(404).json({
        message: "Email and bookName is required",
        success: false
      })
    }
    const regex = new RegExp(email, 'i'); // Case-insensitive regular expression
    const regexBook = new RegExp(bookName, 'i'); // Case-insensitive regular expression
    const response = await cartModel.findOneAndDelete({ $and: [{ bookName: regexBook }, { email: regex }] });
    res.status(200).json({ message: "Book Deleted Successfully", success: true, book: bookName });
  } catch (error) {
    res.status(500).json({
      error: `Server error ${error.message}`,
      success: false
    });
  }
}

module.exports.moveBookFromWishlisttoCart = async (req, res) => {
  try {
    const { bookName, email } = req.body;
    const bookDetailsFromWishlist = await wishlistModel.findOneAndDelete({
      $and: [
        { bookName },
        { email }
      ]
    });
    const result = await addBookToCart(bookName, email);
    if (result) {
      return res.status(201).json({
        message: "Book added to cart successfully",
        success: true
      })
    } else {
      const bookDetails = await wishlistModel.create({
        email,
        bookName
      })
      return res.status(404).json({
        success: false,
        message: "Falied to add book to cart"
      })
    }
  } catch (error) {
    const bookDetails = await wishlistModel.create({
      email,
      bookName
    })
    return res.status(500).json({
      message: error.message,
      success: false
    })
  }
};


module.exports.deleteAllCartProduct = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({
        message: "Email is required",
        success: false
      })
    }
    const response = await deleteAllProducts(email, "cart");
    return res.status(200).json({
      message : "All cart products deleted successfully",
      success : true
    })
  } catch (error) {
     return res.status(500).json({
      success: false,
      message: "Error in deleting all products, Try again later"
    })
  }
}