const bookModel = require("../models/bookInfo");
const orders = require("../models/order");
const {returnError} = require("../utilis/returnError.js")

 // Function to insert book details in the database
module.exports.bookDetails = async (req,res, next) => {
    try{
    const {price, quantity ,genre, book_name, author, img_link, description, reviews, rating, type} = req.body;
    if(!price || !quantity || !genre || !book_name || !author || !img_link || !type){
      return returnError(400, "Missing required fields", next);
    }
    const bookInfo = await bookModel.create({price, quantity ,genre, title : book_name, author, type, imageLink : img_link, description, rating, reviews});
    return res.status(201).json({
      success: true,
      message: "Book created successfully",
      id: bookInfo._id
    })
    } catch (error){
      console.log(error.message, "Error in creating new book in db")
      returnError(500, "Internal Server Error in creating book", next);
    }
  };


//Function to delete a book from the database
module.exports.deleteBook = async (req,res, next) => {
  try {
    const {bookName} = req.params;
    if(!bookName){
      return returnError(400, "Missing required fields", next);
    }

    const regexBook = new RegExp(bookName, 'i'); // Case-insensitive regular expression
    const deleteBookInfo = await bookModel.findOneAndDelete({title : regexBook});
    return res.status(200).json({
      success: true,
      message: "Book deleted successfully",
      book: deleteBookInfo
    })
  } catch (error) {
      console.log(error.message, "Error in deleting book from db")
      returnError(500, "Internal Server Error in deleting bookInfo", next);
  }
};

//Function to update book details in the database
module.exports.updateBook = async (req,res, next) => {
  try {
    const {author, genres, price, title, quantity, imageLink} = req.body;
    if(!price || !quantity || !genres || !title || !imageLink){
      return returnError(400, "Missing required fields", next);
    }
    const updatedBookInfo = await bookModel.findOneAndUpdate(
      {title : title},
      {price, quantity ,genre : genres, title , author, imageLink},
      {new : true}
    );
    return res.status(200).json({
      success: true,
      message: "Book updated successfully",
      id: updatedBookInfo._id
    })
  } catch (error) {
    console.log(error.message, "Error in updating book info in db")
      returnError(500, "Internal Server Error in updating bookInfo", next);
  }
}

module.exports.fetchAllUserOrders = async (req,res, next)=>{
  try {
    const orderDetails = await orders.find();
  if(orderDetails.length == 0){
    return res.status(200).json({
      message : "No orders yet",
      orders : 0
    })
  }else{
    return res.status(200).json({
      message: "All users orders fetched successfully",
      ordersInfo : orderDetails,
      orders : orderDetails.length
    })
  }
  } catch (error) {
    console.error("Error in fetching all user orders", error.message);
    returnError(500, "Internal Server Error in fetching orders", next);  
  }
}


