const wishlistModel = require("../models/wishlist");
const cartModel = require("../models/cart");
const itemSchema = require("../utilis/joiValidator");
const bookModel = require("../models/bookInfo");
const userModel = require("../models/user");
const orders = require("../models/order");

const validateInput = (bookName, email) => {
  const { error, value } = itemSchema.validate({ bookName, email });
  if (error) {
    throw new Error(error.details[0].message);
  }
  return value;
};


//Function to add a book to wishlist
module.exports.addToWishlist = async (req, res) => {
  try {
    const { bookName } = req.params;
    const email = req.body.email; // assuming you have user data available in req.user

    if (!bookName || !email) {
      return res.status(400).json({ error: "Book name and email is required" });
    }

    console.log(email, bookName, "From add to wishlist function");

    //   Use Joi.attempt() to validate the data against your schema
    const value = validateInput(bookName, email);
    console.log(value);
    const wishlist = await wishlistModel.create({ bookName, email });
    res.status(201).json(wishlist);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server error" });
  }
};


//Function to fetch wishlist books of a user
module.exports.fetchWishlistData = async (req, res) => {
  try {
    const email = req.body.email;
    //console.log(email);
    const regex = new RegExp(email, 'i'); // Case-insensitive regular expression
    const data = await wishlistModel.find({ email: regex });
    const booksName = data.map(book => book.bookName);
    const bookDetails = await bookModel.find({ title: { $in: booksName } });
    res.status(200).json(bookDetails);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server error" });
  }
};

//Function to add a book to user cart section
module.exports.addToCart = async (req, res) => {
  try {
    const { bookName } = req.params;
    const { email } = req.body; // assuming you have user data available in req.user
    if (!bookName || !email) {
      return res.status(400).json({ error: "Book name and email is required" });
    };

    console.log(email, bookName, "From add to cart function");
    //   Use Joi.attempt() to validate the data against your schema
    const value = validateInput(bookName, email);
    console.log(value);

    const wishlist = await cartModel.create({ bookName, email });
    res.status(201).json(wishlist);
  } catch (error) {
    console.error(error.message);
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

    //console.log(email, "From fetch cart data function");
    const regex = new RegExp(email, 'i'); // Case-insensitive regular expression
    //console.log(regex);
    const data = await cartModel.find({ email: regex });
    if (data.length > 0) {
      console.log(data, "From fetch cart data function");
      const booksName = data.map(book => book.bookName);
      //console.log(booksName, "From fetch cart data function");
      const bookDetails = await bookModel.find({ title: { $in: booksName } });
      //console.log(bookDetails.length, "From Fetching user cart data function")
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
    console.error(error.message);
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
        success: fasle
      })
    }
    //console.log(bookName, email);
    const regex = new RegExp(email, 'i'); // Case-insensitive regular expression
    const regexBook = new RegExp(bookName, 'i'); // Case-insensitive regular expression
    const data = await cartModel.findOneAndDelete({ $and: [{ bookName: regexBook }, { email: regex }] });
    res.status(200).json({ message: "Book Deleted Successfully", regexBook });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: `Server error ${error.message}` });
  }
}

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

    //console.log(bookName, email);
    const regex = new RegExp(email, 'i'); // Case-insensitive regular expression
    const regexBook = new RegExp(bookName, 'i'); // Case-insensitive regular expression
    const data = await wishlistModel.findOneAndDelete({ $and: [{ bookName: regexBook }, { email: regex }] });
    res.status(200).json({ message: "Book Deleted Successfully", bookName });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: `Server error ${error.message}` });
  }
}

module.exports.profileDetails = async (req, res) => {
  const { email } = req.body;
  //console.log(req.body);

  if (!email) {
    //console.log("Email Missing");
    return res.status(404).json({
      message: "Email is required"
    })
  }
  //console.log("Email", email);

  const userDetails = await userModel.findOne({ emailId: email }).select('-passwordHash');
  //console.log(userDetails);
  const numberOfOrders = userDetails.numberOfOrders;

  return res.status(200).json({
    message: "User Profile Details fetched successfully",
    orders: 0,
    userDetails: userDetails
  })
}

module.exports.fetchOrders = async (req,res) => {
  const { email } = req.body;
  //console.log(req.body);

  if (!email) {
    //console.log("Email Missing");
    return res.status(404).json({
      message: "Email is required"
    })
  }
  //console.log("Email", email);

  const userOrderDetails = await orders.find({ emailId: email });
  const number = userOrderDetails.length;
  return res.status(200).json({
    message: "User Profile Details and Order Details fetched successfully",
    orderDetails: userOrderDetails,
    userDetails: userDetails,
    orders: number
  })
}