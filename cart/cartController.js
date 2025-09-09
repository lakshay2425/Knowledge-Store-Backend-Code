import cartModel from "./cart.js";
import itemSchema from "../utilis/joiValidator.js";
import { deleteAllProducts, deleteBook } from "../utilis/deleteAll.js";
import wishlistModel from "../wishlist/wishlist.js";
import createHttpError from "http-errors";
import { asyncHandler } from "../utilis/advanceFunctions.js";

const validateInput = (bookName, email) => {
  const { error, value } = itemSchema.validate({ bookName, email });
  if (error) {
    console.log(`Invalid Input ${bookName, email}`, error.message)
    throw new Error(error.details[0].message);
  }
  return value;
};


async function addBookToCart(bookName, email, rentalPeriod, next) {
  try {
    const value = validateInput(bookName, email);
    if (value) {
      const existingBook = await cartModel.findOne({ bookName, email });
      if (!existingBook) {
        await cartModel.create({ bookName, email, days: rentalPeriod });
        return {
          message: "Book added to cart",
          success: true,
          exist: false
        };
      }
      return {
        message: "Book already exists in the cart",
        success: false,
        exist: true
      };
    }
  } catch (error) {
    console.log("Error in adding book to cart", error.message)
    const err = createHttpError(500, "Internal Server Error")
    err.additonalFields = {
      success: false,
      exist: false
    }
    next(err);
  }
}

//Function to update number of days in cart
export const updateCart = async (req, res, next) => {
  const { days, bookName } = req.body;
  const email = req.gmail;

  if (!days || !bookName) {
    console.log("Missing days and bookName")
    const err = createHttpError(400, "Missing days and bookName")
    err.additonalFields = {
      success: false,
      updated: false
    }
    return next(err)
  }

  try {
    const bookDetails = await cartModel.findOneAndUpdate({ $and: [{ title: bookName }, { email }] }, { days }, { new: true });
    if (bookDetails) {
      return res.status(200).json({
        message: "Number of days updated in Book information successfully",
        success: true,
        updated: true,
      })
    }
  }
  catch (err) {
    console.log("Error in updating cart", err.message);
    const error = createHttpError(500, "Missing days and bookName")
    error.additonalFields = {
      success: false,
      updated: false
    }
    next(error);
  }
}

//Function to add a book to user cart section
export const addToCart = asyncHandler(async (req, res, next) => {
  // try {
  const email = req.gmail;
  const { rentalPeriod, bookName } = req.body; // assuming you have user data available in req.user
  console.log(req.body, "Request Body Object")
  if (!bookName || !rentalPeriod) {
    console.log(bookName, rentalPeriod);
    console.log("Missing required fields bookName or rentalPeriod")
    return next(createHttpError(400, "Missing required fields"))
  };

  const result = await addBookToCart(bookName, email, rentalPeriod, next);
  if (!result.success) {
    if (result.exist) {
      return res.status(409).json({
        message: "Book already exist in cart",
        success: false,
        exist: true
      })
    }
  }
  return res.status(201).json({
    message: "Book added to cart successfully",
    success: true,
    exist: false
  })
  // } catch (error) {
  //   console.log("Failed to add book to cart", error.message);
  //   return next(createHttpError(500, "Internal Server Error"));
  // }
});

//Function to fetch  book details from user cart section
export const fetchCartData = asyncHandler(async (req, res) => {
  // try {
  const email = req.gmail;

  const userCartWithBookInfo = await cartModel.aggregate([
    { $match: { email: email } },
    {
      $lookup: {
        from: "books",
        localField: "bookName",
        foreignField: "title",
        as: "bookInfo"
      }
    },
    { $unwind: "$bookInfo" },
    {
      $project: {
        _id: 0,
        bookName: 1,
        days: 1,
        author: "$bookInfo.author",
        description: "$bookInfo.description",
        genre: "$bookInfo.genre",
        price: "$bookInfo.price",
        imageLink: "$bookInfo.imageLink",
        reviews: "$bookInfo.reviews",
        rating: "$bookInfo.rating",
        type: "$bookInfo.type",
      }
    }
  ]);
  return res.status(200).json({
    message: `${userCartWithBookInfo.length > 0 ? "User Cart data fetch successfully" : "No Data in the cart"}`,
    bookDetails: userCartWithBookInfo,
    numberOfBooks: userCartWithBookInfo.length
  });
  // } catch (error) {
  //   console.log(error.message, "Failed to fetch user cart data");
  //   const err = createHttpError(500, "Failed to fetch user cart data")
  //   err.additonalFields = { success: false };
  //   next(err);
  // };
})


//Function to delete a book from user cart section
export const deleteCartProduct = asyncHandler(async (req, res, next) => {
  const email = req.gmail;
  const { bookName } = req.query;
  if (!bookName) {
    const err = createHttpError(400, "Missing bookName or gmail")
    err.additonalFields = { success: false };
    return next(err);
  };
  await deleteBook(bookName, email, "Cart", res, next);

})

export const moveBookFromWishlisttoCart = async (req, res, next) => {
  const session = await wishlistModel.startSession();
  try {
    const email = req.gmail;
    const { bookName } = req.body;

    if (!bookName) {
      const err = createHttpError(400, "Missing bookName or email parameters")
      err.additonalFields = { success: false };
      return next(err);
    }
    session.startTransaction();
    const deleteFromWishlist = await wishlistModel.findOneAndDelete({
      $and: [
        { bookName },
        { email }
      ]
    });
    if (!deleteFromWishlist) {
      return next(createHttpError(404, "Book you're trying to move from wishlist to cart doesn't exist in wishlist"))
    }
    const result = await addBookToCart(bookName, email, next);
    if (!result.success) {
      if (result.exist) {
        return res.status(409).json({
          message: "Book already exist in cart",
          success: false,
          exist: true
        })
      }
    }
    session.commitTransaction();
    return res.status(201).json({
      message: "Book moved to cart successfully",
      success: true,
      exist: false
    })
  } catch (error) {
    session.abortTransaction();
    console.error("Error in moving book from wishlist to cart", error.message)
    return res.status(500).json({
      message: error.message,
      success: false
    });
  }
};


export const deleteAllCartProduct = asyncHandler(async (req, res, next) => {
  // try {
  const email = req.gmail;
  // if (!email) {
  //   console.error("Email is missing");
  //   const err = createHttpError(400, "Email is missing");
  //   err.additonalFields = { success: false }
  //   return next(err);
  // }
  const response = await deleteAllProducts(email, "cart");
  if (response.success === false) {
    return next(createHttpError(500, "Failed to remove all books from your cart"))
  }
  return res.status(200).json({
    message: "All cart products deleted successfully",
    success: true
  })
  // } catch (error) {
  //   console.log("Error ind deleting all cart product", error.message);
  //   const err = createHttpError(500, "Internal Server Error");
  //   err.additonalFields = { success: false };
  //   next(err);
  // }
})