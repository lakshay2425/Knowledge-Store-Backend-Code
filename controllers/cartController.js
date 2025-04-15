const cartModel = require("../models/cart");
const itemSchema = require("../utilis/joiValidator");
const bookModel = require("../models/bookInfo");
const {deleteAllProducts} = require("../utilis/deleteAll");
const wishlistModel = require("../models/wishlist"); 
const {deleteBook} = require("../utilis/deleteAll");

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
    if(value){
      const existingBook = await cartModel.findOne({ bookName, email });
      if (existingBook) {
        return {
          message: "Book already exists in the cart",
          success: false,
          exist: true
        }; // Book already exists in the cart
      }else{
        const cart = await cartModel.create({ bookName, email });
        return {
          message: "Book added to cart",
          success: true,
          exist: false
        }; 
      }
    }
  } catch (error) {
        return {
          message: "Error while adding book to cart",
          success: false,
          exist: false
        }; 
  }
}

//Function to update number of days in cart
module.exports.updateCart = async (req,res)=>{
  const {days, bookName} = req.body;
  
  if(!days || !bookName){
    return res.status(400).json({
      message : "Days and bookName is required",
      success : false,
      updated: false,
    })
  }

  const bookDetails = await cartModel.findOneAndUpdate({title : bookName}, {days}, {new : true});
  if(bookDetails){
    return res.status(200).json({
      message : "Number of days updated in Book information successfully",
      success : true,
      updated: true,
    })
  }else{
    return res.status(500).json({
      message : "Failed to update Number of days in Book information",
      success : false,
      updated: false,
    })
  }
}

//Function to add a book to user cart section
module.exports.addToCart = async (req, res) => {
  try {
    const { bookName, email } = req.body; // assuming you have user data available in req.user
    if (!bookName || !email) {
      return res.status(400).json({ error: "Book name and email is required" });
    };
    const result = await addBookToCart(bookName, email);
    if (result.success) {
      return res.status(201).json({
        message: "Book added to cart successfully",
        success: true,
        exist: false
      })
    } else {
      if(result.exist){
        return res.status(409).json({ 
        message: "Book already exist in cart",
        success: false,
        exist: true
        })
      }else{
        return res.status(404).json({
          success: false,
          message: "Falied to add book to cart",
          exist: false
        })
      } 
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Function to fetch  book details from user cart section
module.exports.fetchCartData = async (req, res) => {
  try {
    const email = req.query.email;
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
    const { bookName, email } = req.query;
    if (!email || !bookName) {
      return res.status(404).json({
        message: "Email and bookName is required",
        success: false
      })
    };
    await deleteBook(bookName, email, "Cart", res);
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
    
    if (!email || !bookName) {
      return res.status(404).json({
        message : "Email and bookName is required", 
        success: false
      })
    }
    
    await wishlistModel.findOneAndDelete({
      $and: [
        { bookName },
        { email }
      ]
    });
    const result = await addBookToCart(bookName, email);
    if (result.success) {
      return res.status(201).json({
        message: "Book added to cart successfully",
        success: true,
        exist: false
      })
    } else {
      if(result.exist){
        await wishlistModel.create({
          email,
          bookName
        })
        return res.status(409).json({ 
        message: "Book already exist in cart",
        success: false,
        exist: true
        })
      }else{
        await wishlistModel.create({
          email,
          bookName
        });
        return res.status(404).json({
          success: false,
          message: "Falied to add book to cart",
          exist: false
        });
      } 
    }
  } catch (error) {
    await wishlistModel.create({
      email,
      bookName
    });
    return res.status(500).json({
      message: error.message,
      success: false
    });
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