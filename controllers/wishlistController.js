const bookModel = require("../models/bookInfo");
const itemSchema = require("../utilis/joiValidator");
const {deleteAllProducts, deleteBook} = require("../utilis/deleteAll"); 
const wishlistModel = require("../models/wishlist");
const cartModel = require("../models/cart");
//const {moveBook} = require("../utilis/moveBook");

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
    if(value){
      const existingBook = await wishlistModel.findOne({ bookName, email });
      if (existingBook) {
        //console.log("Already exist");
        return {
          message: "Book already exists in the wishlist",
          success: false,
          exist: true
        }; // Book already exists in the cart
      }else{
        await wishlistModel.create({ bookName, email });
       // console.log("Added to wishlist");
        return {
          message: "Book added to wishlist",
          success: true,
          exist: false
        }; 
      }
    }
  } catch (error) {
    return false;
  }
}
//Function to add a book to wishlist
module.exports.addToWishlist = async (req, res) => {
  try {
    const {email, bookName} = req.body; 
    // console.log(email, bookName);
    if (!bookName || !email) {
      return res.status(400).json({ error: "Book name and email is required" });
    }

    const result = await addBookToWishlist(bookName, email);
    //console.log(result);
    if (result.success) {
      return res.status(201).json({
        message: "Book added to cart successfully",
        success: true,
        exist: false
      })
    } else {
      if(result.exist){
        return res.status(409).json({ 
        message: "Book already exist in wishlist",
        success: false,
        exist: true
        })
      }else{
        return res.status(404).json({
          success: false,
          message: "Falied to add book to wishlist",
          exist: false
        })
      } 
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
    const email = req.query.email;
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
    console.error(error.message);
    res.status(500).json({ error: "Server error" });
  }
};

//Function to delete a book from user wishlist section
module.exports.deleteWishlistProduct = async (req, res) => {
  try {
    const { bookName, email } = req.query;

    if (!email || !bookName) {
      return res.status(404).json({
        message: "Email and bookName is required",
        success: false
      })
    }
    await deleteBook(bookName, email, "Wishlist", res);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: `Server error ${error.message}` , succes: false});
  }
}

module.exports.moveBookFromCartToWishlist = async (req, res) => {
  try {
    const { bookName, email } = req.body;
    if(!bookName || !email){
      return res.status(400).json({
        message : 'Fields are required',
        success: false
    })
  }
  console.log("Params are there bookName, and email");
    //await moveBook(bookName, email, res, "cart", "wishlist");
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
    } else {
      if(result.exist){
        return res.status(409).json({
          message: "Book already exist in wishlist",
          success: false,
          exist: true,
        })  
      }else{
        await cartModel.create({
          bookName,
          email
        })
        return res.status(404).json({
          message: "Failed to move the book from cart to wishlist Try again later",
          success: false,
          exist: false,
        }) 
      }
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