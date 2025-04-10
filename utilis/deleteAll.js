const wishlist = require("../models/wishlist");
const cart = require("../models/cart");

module.exports.deleteAllProducts = async (email, type)=>{
    try {
        if(type === "wishlist"){
        const deletedProductResponse = await wishlist.deleteMany({email});
        return {success : true, message : "All products deleted from wishlist"};
        }else if(type === "cart"){
            const deletedProductResponse = await cart.deleteMany({email});
            return {success : true, message : "All products deleted from cart"};
        }
    } catch (error) {
        return {success : false, error : error.message}
    }
}

module.exports.deleteBook =  async (bookName, email, type, res)=>{
  try {
    const regex = new RegExp(email, 'i'); // Case-insensitive regular expression
    const regexBook = new RegExp(bookName, 'i'); // Case-insensitive regular expression
    if(type === "Wishlist"){
      await wishlist.findOneAndDelete({ $and: [{ bookName: regexBook }, { email: regex }] });
      return res.status(200).json({ message: "Book Deleted Successfully", bookName, success : true });
    }else if(type === "Cart"){
      await cart.findOneAndDelete({ $and: [{ bookName: regexBook }, { email: regex }] });
      return res.status(200).json({ message: "Book Deleted Successfully", bookName , success : true});  
    }
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({ message: "Failed to delete the book", bookName , success : false});
  }
}