import bookModel from "../book/bookInfo.js";
import itemSchema from "../utilis/joiValidator.js";
import { deleteAllProducts, deleteBook } from "../utilis/deleteAll.js";
import wishlistModel from "../wishlist/wishlist.js";
import cartModel from "../cart/cart.js";
import createHttpError from "http-errors";
import { asyncHandler, dbOperation } from "../utilis/advanceFunctions.js";

const validateInput = (bookName, email) => {
  const { error, value } = itemSchema.validate({ bookName, email });
  if (error) {
    console.log("Invalid Input", error.message)
    throw new Error(error.details[0].message);
  }
  return value;
};

async function addBookToWishlist(bookName, email) {
  try {
    const value = validateInput(bookName, email);
    if (value) {
      const existingBook = await wishlistModel.findOne({ bookName, email });
      if (existingBook) {
        return {
          message: "Book already exists in the wishlist",
          success: false,
          exist: true
        };
      }
      await wishlistModel.create({ bookName, email });
      return {
        message: "Book added to wishlist",
        success: true,
        exist: false
      };
    }
  } catch (error) {
    console.error("Failed to add book to wishlist", error.message);
    return false;
  }
}

//Function to add a book to wishlist
export const addToWishlist = asyncHandler(async (req, res, next) => {
  const { bookName } = req.body;
  const email = req.gmail;

  if (!bookName) {
    return next(createHttpError(400, "Book name and email is required"));
  }

  const result = await addBookToWishlist(bookName, email);

  if (result.success) {
    return res.status(201).json({
      message: "Book added to cart successfully",
      success: true,
      exist: false
    })
  } else {
    const doesExist = result.exist;
    return res.status(doesExist ? 409 : 404).json({
      message: doesExist ? "Book already exist in wishlist" : "Falied to add book to wishlist",
      success: false,
      exist: doesExist
    })
  }
});

//Function to fetch wishlist books of a user
export const fetchWishlistData = asyncHandler(async (req, res, next) => {
  const email = req.gmail;

  if (!email) {
    return next(createHttpError(400, "Missing required field"))
  }

  const regex = new RegExp(email, 'i'); // Case-insensitive regular expression

  const data = await dbOperation(() => wishlistModel.find({ email: regex }), `Failed to fetch wishlist data for user with email: ${email}`);

  if (data.length > 0) {
    const booksName = data.map(book => book.bookName);
    const bookDetails = await bookModel.find({
      $or: booksName.map(name => ({ title: { $regex: new RegExp(name, 'i') } }))
    });

    res.status(200).json({
      message: "Your wishlist data fetched successfully",
      bookDetails,
      numberOfBooks: bookDetails.length
    });

  } else {
    res.status(200).json({
      message: "No books found in wishlist",
      numberOfBooks: 0
    });
  }
});

//Function to delete a book from user wishlist section
export const deleteWishlistProduct = asyncHandler(async (req, res, next) => {
  const email = req.gmail;
  const { bookName } = req.query;

  if (!bookName) {
    const err = createHttpError(400, "Required field are missing");
    err.additionalFields = { success: false };
    return next(err);
  }

  await deleteBook(bookName, email, "Wishlist", res, next);
})

export const moveBookFromCartToWishlist = asyncHandler(async (req, res, next) => {
  const email = req.gmail;
  const { bookName } = req.body;

  if (!bookName) {
    const err = createHttpError(400, "Missing fields required");
    err.additionalFields = { success: false };
    return next(err);
  }

  const bookInfo = await dbOperation(() => cartModel.findOneAndDelete({
    $and: [
      { bookName },
      { email }
    ]
  }), `Failed to fetch book info from cart for email ${email} and bookName ${bookName}`);

  if (!bookInfo) {
    return next(createHttpError(404, "Book you're trying to move from cart to wishlist doesn't exist"))
  }

  const result = await addBookToWishlist(bookName, email);

  if (result.success) {
    return res.status(201).json({
      message: "Book has been moved to wishlist from  cart successfully",
      success: true,
      exist: false,
    })
  }
  else {
    const doesExist = result.exist;
    if (!doesExist) {
      await dbOperation(() => cartModel.create({
        bookName,
        email
      }), `Failed to create book entry in cart for user with email ${email} and bookName ${bookName} `)
    }
    return res.status(doesExist ? 409 : 404).json({
      message: doesExist ? "Book already exist in wishlist" : "Failed to move the book from cart to wishlist Try again later",
      success: false,
      exist: doesExist
    })
  }
})

export const deleteAllWishlistProduct = asyncHandler(async (req, res) => {
  const email = req.gmail;

  await deleteAllProducts(email, "wishlist");

  return res.status(200).json({
    message: "All wishlist products deleted successfully",
    success: true
  })
})