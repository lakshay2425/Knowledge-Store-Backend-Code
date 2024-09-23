const wishlistModel = require("../models/wishlist"); 
const cartModel = require("../models/cart");
const itemSchema = require("../utilis/joiValidator");
const  bookModel = require("../models/bookInfo");


const validateInput = (bookName, email) => {
  const { error, value } = itemSchema.validate({bookName, email});
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
    const wishlist = await wishlistModel.create( {bookName, email } );
    res.status(201).json(wishlist);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server error" });
  }
};


//Function to fetch wishlist books of a user
module.exports.fetchWishlistData = async (req,res) => {
    try {
        const email = req.body.email;
        console.log(email);
        const data = await wishlistModel.find({email : email});
        const booksName = data.map(book => book.bookName); 
        const bookDetails = await bookModel.find({title : {$in : booksName}});
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
    const {email} = req.body; // assuming you have user data available in req.user


    if (!bookName || !email) {
      return res.status(400).json({ error: "Book name and email is required" });
    };

    console.log(email, bookName, "From add to cart function");
//   Use Joi.attempt() to validate the data against your schema
    const value = validateInput(bookName, email);
    console.log(value);

    const wishlist = await cartModel.create({bookName, email });
    res.status(201).json(wishlist);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};

//Function to fetch  book details from user cart section
module.exports.fetchCartData = async (req,res) => {
  try {
      const {email} = req.body;
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      };

      console.log(email, "From fetch cart data function");
      const data = await cartModel.find({email});
      console.log(data, "From fetch cart data function");
      const booksName = data.map(book => book.bookName); 
      console.log(booksName, "From fetch cart data function");
      const bookDetails = await bookModel.find({title : {$in : booksName}});
      res.status(200).json(bookDetails);
  } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: `Server error ${error.message}` });
  }
};


//Function to delete a book from user cart section
module.exports.deleteCartProduct = async(req,res) =>{
  try {
    const {email} = req.body;
    const { bookName } = req.params;

    if(!email || !bookName){
      return res.status(404).json({
        message : "Email and bookName is required",
        success : fasle
      })
    }
    console.log(bookName, email);
    const data = await cartModel.findOneAndDelete({$and : [{bookName : bookName}, {email : email}]});
    res.status(200).json({message :"Book Deleted Successfully", bookName});
} catch (error) {
    console.error(error.message);
    res.status(500).json({ error: `Server error ${error.message}` });
}
}

//Function to delete a book from user wishlist section
module.exports.deleteWishlistProduct = async(req,res) =>{
  try {
    const {email} = req.body;
    const { bookName } = req.params;
    
    if(!email || !bookName){
      return res.status(404).json({
        message : "Email and bookName is required",
        success : fasle
      })
    }

    console.log(bookName, email);
    const data = await wishlistModel.findOneAndDelete({$and : [{bookName : bookName}, {email : email}]});
    res.status(200).json({message :"Book Deleted Successfully", bookName});
} catch (error) {
    console.error(error.message);
    res.status(500).json({ error: `Server error ${error.message}` });
}
}