const bookModel = require("../models/bookInfo");
const orders = require("../models/order");

 // Function to insert book details in the database
module.exports.bookDetails = async (req,res) => {
    try{
    const {price, quantity ,genre, book_name, author, img_link, description, reviews, rating, type} = req.body;
    if(!price || !quantity || !genre || !book_name || !author || !img_link || !type){
      return res.status(400).json({
        message : "All Fields are necessary",
        success : false
      })
    }
    const response = await bookModel.create({price, quantity ,genre, title : book_name, author, type, imageLink : img_link, type, description, rating, reviews});
    res.json(response);
    } catch (err){
      res.status(500).json({
        success : false,
        error : err.message
      });
    }
  };


//Function to delete a book from the database
module.exports.deleteBook = async (req,res) => {
  try {
    const {bookName} = req.params;
    if(!bookName){
      return res.status(400).json({
        message : "Book name is required",
        success : false
      })
    }

    const regexBook = new RegExp(bookName, 'i'); // Case-insensitive regular expression
    const response = await bookModel.findOneAndDelete({title : regexBook});
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success : false,
      error : error.message
    });
  }
};

//Function to update book details in the database
module.exports.updateBook = async (req,res) => {
  try {
    const {author, genres, price, title, quantity, imageLink} = req.body;
    if(!price || !quantity || !genres || !title || !imageLink){
      return res.status(400).json({
        message : "All Fields are necessary",
        success : false
      })
    }
    const response = await bookModel.findOneAndUpdate(
      {title : title},
      {price, quantity ,genre : genres, title , author, imageLink},
      {new : true}
    );
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success : false,
      error : error.message
    });
  }
}

module.exports.fetchAllUserOrders = async (req,res)=>{
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
}