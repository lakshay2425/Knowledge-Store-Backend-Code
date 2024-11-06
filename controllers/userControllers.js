const wishlistModel = require("../models/wishlist");
const cartModel = require("../models/cart");
const itemSchema = require("../utilis/joiValidator");
const bookModel = require("../models/bookInfo");
const userModel = require("../models/user");
const orders = require("../models/order");
const testimonalModel = require("../models/testimonial");
const bookReviewModel = require("../models/review");

const validateInput = (bookName, email) => {
  const { error, value } = itemSchema.validate({ bookName, email });
  if (error) {
    throw new Error(error.details[0].message);
  }
  return value;
};

async function addBookToWishlist(bookName, email) {
  try {
    //   Use Joi.attempt() to validate the data against your schema
    const value = validateInput(bookName, email);
    //console.log(value);
    const wishlist = await wishlistModel.create({ bookName, email });
    //console.log(wishlist, "From adding book to wishlist");
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
    const result = addBookToWishlist(bookName,email);
    if(result){
      return res.status(201).json({
        message : "Book added to the Wishlist",
        success: true
      })
    }else{
      return res.status(404).json({
        message : "Failed to place the order Try again later",
        success : false
      })
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ 
      success : false,
      message : error.message,
      error: "Server error"
     });
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

async function addBookToCart(bookName, email){
  try {
    //Use Joi.attempt() to validate the data against your schema
    const value = validateInput(bookName, email);
    const cart = await cartModel.create({ bookName, email });
    //console.log(cart, "Cart Details");
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
    if(result){
      return res.status(201).json({
        message : "Book added to cart successfully", 
        success : true
      })
    }else{
      return res.status(404).json({
        success : false,
        message : "Falied to add book to cart"
      })
    }
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
      //console.log(data, "From fetch cart data function");
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

module.exports.fetchOrders = async (req, res) => {
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

async function placeBookOrder(email, bookName, numberOfDays) {
  try {
    const user = await userModel.findOne({ emailId: email });
  if (!user) {
    return res.status(500).json({
      message: "User doesn't exist. Login first"
    })
  }
  const userFullName = user.fullName;
  const userContactNumber = user.contactNumber;
  const userName = user.username;
  const bookDetails = await bookModel.findOne({ title: bookName });
  if (!bookDetails) {
    return res.status(404).json({
      message: "Book doesn't exist in the database"
    })
  }
  const quantity = bookDetails.quantity;
  if (quantity == 0) {
    return res.status(300).json({
      message: "Book isn't available"
    })
  } else {
    const bookGenre = bookDetails.genres;
    const securityDeposit = bookDetails.price;
    const rentCharges = numberOfDays * 20;
    const order = await orders.create({
      fullName: userFullName,
      securityDeposit,
      rentCharges,
      emailId: email,
      genre: bookGenre,
      bookName,
      contactNumber: userContactNumber,
      username: userName,
      days: numberOfDays
    })
    const updatedBookDetails = await bookModel.findOneAndUpdate(
      { title: bookName },
      { quantity: quantity - 1 },
      { new: true }
    )
    return true;
  }
  } catch (error) {
   console.log("Error", error.message);
   return false;
   //throw error("Failed to place the order") 
  }
}

module.exports.placeOrder = async (req, res) => {
  try {
    const { email, bookName, numberOfDays } = req.body;
    if (!email || !bookName || !numberOfDays) {
      return res.status(500).json({
        message: "All field are necessary"
      })
    }
    //console.log(email, bookName, numberOfDays);
    const result = placeBookOrder(email, bookName, numberOfDays);
    if(result){
      return res.status(201).json({
        message: "Orders place successfully",
        success : true
      })
    }else{
      return res.status(404).json({
        message : "Failed to place the order Try again later",
        success : false
      })
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Failed to place the order",
      error: error.message
    })
  }
}

module.exports.cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    const orderDetails = await orders.findOneAndUpdate(
      { _id: orderId },
      { status: " cancelled" },
      { new: true }
    );
    const book = orderDetails.bookName;
    const bookDetails = await bookModel.findOneAndUpdate(
      { title: book },
      { quantity: 1 },
      { new: true }
    );
    res.status(200).json({
      message: "Order cancelled successfully",
      success: true
    })
  } catch (error) {
    console.log(error.message);
    const orderDetails = await orders.findOneAndUpdate(
      { _id: orderId },
      { status: "ordered" }
    );
    res.status(404).json({
      message: error.message
    })
  }
}

module.exports.fetchSpecificOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const orderDetails = await orders.find({ _id: id });
    if (!orderDetails) {
      return res.status(404).json({
        message: "No order exist with this order id",
        success: false
      })
    } else {
      res.status(200).json({
        message: "Order Details found",
        orderInfo: orderDetails,
        success: true
      })
    }
  } catch (error) {
    console.log(error.message);
    res.status(404).json({
      message: error.message
    })
  }
}


module.exports.bookReview = async (req, res) => {
  try {
    const { bookName, stars, username, description } = req.body;
    if (!bookName || !stars || !username || !description) {
      return res.status(400).json({
        success: false,
        message: "All field are required"
      })
    }
    const model = await bookReviewModel.create({
      username,
      bookName,
      stars,
      description
    })
    res.status(200).json({
      message: "Reveiw added successfully",
      success: true
    })
  } catch (error) {
    console.log("Error", error.message);
    res.status(404).json({
      error: error.message,
      success: false
    })
  }
}

module.exports.userTestimonial = async (req, res) => {
  try {
    const { username, testimonial } = req.body;
    if (!username || !testimonial) {
      return res.status(400).json({
        message: "All fields are required"
      })
    }
    const details = await testimonalModel.create({
      username,
      testimonial
    });
    res.status(200).json({
      message: "Testimonials added successfully",
      success: true
    })

  } catch (error) {
    console.log("Error", error.message);
    res.status(404).json({
      error: error.message,
      success: false
    })
  }
}

module.exports.fetchUserTestimonial = async (req, res) => {
  try {
    const allUserTestimonial = await testimonalModel.find();
    return res.status(200).json({
      message: "All testimonials fetched",
      success: true,
      data: allUserTestimonial
    })
  } catch (error) {
    console.log("Error", error.message);
    return res.status(500).json({
      success: false,
      error: error.message
    })
  }
}

module.exports.fetchReveiw = async (req, res) => {
  try {
    const { bookName } = req.params;
    if (!bookName) {
      return res.status(404).json({
        message: "BookName is required",
        success: false
      })
    }
    const bookReviews = await bookReviewModel.find({ bookName });
    if (bookReviews.length == 0) {
      return res.status(200).json({
        success: true,
        message: "No reviews found for this book",
        reviews: 0
      })
    }
    return res.status(200).json({
      message: "Fetched reviews successfully",
      reviewData: bookReviews,
      reviews: bookReviews.length
    })
  } catch (error) {
    console.log("Error", error.message);
    return res.status(500).json({
      success: false,
      error: error.message
    })
  }
}

module.exports.deleteUserAccount = async (req, res) => {
  try {
    const { username } = req.body;
    const user = await userModel.findOne({ username });
    const orderDetails = await orders.find({ $and: [{ username }, { status: { $in: ["ordered", "delievered"] } }] });
    if (orderDetails.length > 0) {
      return res.status(404).json({
        message: "Account cannot be deleted becuase you have incoming or delivered orders",
        success: false
      })
    } else {
      await userModel.deleteOne({ username });
      return res.status(200).json({
        message: "Account deleted successfully",
        success: true
      })
    }


  } catch (error) {
    console.log("Error", error.message);
    return res.status(500).json({
      message: "Failed to delete the user account",
      success: false,
      error: error.message
    })
  }
}

module.exports.moveBookFromWishlisttoCart = async (req,res)=>{
  try {
    const {bookName, email, numberOfDays} = req.body;
    const bookDetailsFromWishlist = await wishlistModel.findOneAndDelete({$and : [
      {bookName},
      {email}
    ]});
    const result = await addBookToCart(bookName, email);
    if(result){
      return res.status(201).json({
        message : "Book added to cart successfully", 
        success : true
      })
    }else{
      const bookDetails = await wishlistModel.create({
        email, 
        bookName
      })
      return res.status(404).json({
        success : false,
        message : "Falied to add book to cart"
      })
    }
  } catch (error) {
    console.log("Error", error.message);
    const bookDetails = await wishlistModel.create({
      email, 
      bookName
    })
    return res.status(500).json({
      message : error.message,
      success : false
    })
  }
};

module.exports.moveBookFromCartToWishlist = async (req,res)=>{
  try {
    const {bookName, email} = req.body;
    const bookDetailsFromCart = await cartModel.findOneAndDelete({$and : [
    {bookName},
    {email}
    ]});
    const result =  await addBookToWishlist(bookName,email);
    if(result){
      return res.status(201).json({
        message: "Moved book from  cart to wishlist successfully",
        success : true
      })
    }else{
      const book = await cartModel.create({
        bookName,
        email
      })
      return res.status(404).json({
        message : "Failed to move the book from cart to wishlist Try again later",
        success : false
      })
    }
  } catch (error) {
    console.log("Error", error.message);
    return res.status(500).json({
      message : error.message,
      success : false
    })
  }
}