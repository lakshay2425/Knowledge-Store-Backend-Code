import bookModel from "../book/bookInfo.js";
import orders from "../models/order.js";
import { asyncHandler, dbOperation } from "../utilis/advanceFunctions.js";
import { returnError } from "../utilis/returnError.js"
import { validateMissingFields } from "../utilis/validateMissingFields.js";

// Function to insert book details in the database
export const bookDetails = asyncHandler(async (req, res, next) => {
  const { price, quantity, genre, book_name, author, img_link, description, reviews, rating, type } = req.body;
  const isFieldsMissing = validateMissingFields({ price, quantity, genre, book_name, author, img_link, description, reviews, rating, type })
  if (isFieldsMissing) {
    return returnError(400, "Missing required fields", next);
  }
  const bookInfo = await dbOperation(
    () => bookModel.create({ price, quantity, genre, title: book_name, author, type, imageLink: img_link, description, rating, reviews }),
    `Failed to create book entry ${book_name} in the database`
  );
  return res.status(201).json({
    success: true,
    message: "Book created successfully",
    id: bookInfo._id
  })
});


//Function to delete a book from the database
export const deleteBook = asyncHandler(async (req, res, next) => {
  const { bookName } = req.params;
  if (!bookName) {
    return returnError(400, "Missing required fields", next);
  }

  const regexBook = new RegExp(bookName, 'i'); // Case-insensitive regular expression
  const deleteBookInfo = await dbOperation(
    () => bookModel.findOneAndDelete({ title: regexBook }),
    `Failed to delete book ${bookName} from database`
  );
  return res.status(200).json({
    success: true,
    message: "Book deleted successfully",
    book: deleteBookInfo
  })
});

//Function to update book details in the database
export const updateBook = asyncHandler(async (req, res, next) => {
  const { author, genres, price, title, quantity, imageLink } = req.body;
  const isFieldsMissing = validateMissingFields({ author, genres, price, title, quantity, imageLink });

  if (isFieldsMissing) {
    return returnError(400, "Missing required fields", next);
  }

  const updatedBookInfo = await dbOperation(
    () => bookModel.findOneAndUpdate(
      { title: title },
      { price, quantity, genre: genres, title, author, imageLink },
      { new: true }
    ),
    `Failed to update book information ${title}`
  );

  return res.status(200).json({
    success: true,
    message: "Book updated successfully",
    id: updatedBookInfo._id
  })
})

export const fetchAllUserOrders = asyncHandler(async (req, res) => {
  const orderDetails = await dbOperation(
    () => orders.find(),
    `Failed to fetch all book orders from database`
  )
  if (orderDetails.length == 0) {
    return res.status(200).json({
      message: "No orders yet",
      orders: 0
    })
  } else {
    return res.status(200).json({
      message: "All users orders fetched successfully",
      ordersInfo: orderDetails,
      orders: orderDetails.length
    })
  }
})


