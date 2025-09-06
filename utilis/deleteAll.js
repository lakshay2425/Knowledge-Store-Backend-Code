import  wishlist from"../models/wishlist.js";
import  cart from"../models/cart.js";
import createHttpError from "http-errors";

export const deleteAllProducts = async (email, type) => {
  try {
    if (type === "wishlist") {
      await wishlist.deleteMany({ email });
      return { success: true, message: "All products deleted from wishlist" };
    } else if (type === "cart") {
      await cart.deleteMany({ email });
      return { success: true, message: "All products deleted from cart" };
    }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export const deleteBook = async (bookName, email, type, res, next) => {
  try {
    const regexEmail = new RegExp(email, 'i'); // Case-insensitive regular expression
    const regexBook = new RegExp(bookName, 'i'); // Case-insensitive regular expression
    if (type === "Wishlist") {
      await wishlist.findOneAndDelete({ $and: [{ bookName: regexBook }, { email: regexEmail }] });
      return res.status(200).json({ message: "Book Deleted Successfully", bookName, success: true });
    } else if (type === "Cart") {
      await cart.findOneAndDelete({ $and: [{ bookName: regexBook }, { email: regexEmail }] });
      return res.status(200).json({ message: "Book Deleted Successfully", bookName, success: true });
    }
  } catch (error) {
    console.log(error.message);
    const err = createHttpError(500, "Failed to delete the book");
    err.additionalFields = { success: false, bookName };
    return next(err);
  }
}