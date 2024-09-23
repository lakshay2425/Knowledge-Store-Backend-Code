const bookModel = require("../models/bookInfo");


 // Function to insert book details in the database
module.exports.bookDetails = async (req,res) => {
    try{
    const {price, quantity ,genre, book_name, author, img_link} = req.body;
    if(!price || !quantity || !genre || !book_name || !author || !img_link){
      return res.status(400).json({
        message : "All Fields are necessary",
        success : false
      })
    }
    const response = await bookModel.create({price, quantity ,genre, title : book_name, author, imageLink : img_link});
    console.log(response);
    res.json(response);
    } catch (err){
      res.status(500).send(`Server Error ${err.message}`);
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
    console.log(bookName);
    const response = await bookModel.findOneAndDelete({title : bookName});
    console.log(response);
    res.json(response);
  } catch (error) {
    res.status(500).send(`Server Error ${err.message}`);
  }
};

//Function to update book details in the database
module.exports.updateBook = async (req,res) => {
  try {
    const {author, genre, price, Quantity, book_name, img_link} = req.body;
    if(!price || !Quantity || !genre || !book_name || !author || !img_link){
      return res.status(400).json({
        message : "All Fields are necessary",
        success : false
      })
    }
    const response = await bookModel.findOneAndUpdate(
      {title : book_name},
      {price, quantity : Quantity ,genre, title : book_name, author, imageLink : img_link},
      {new : true}
    );
    console.log(response);
    res.json(response);
  } catch (error) {
    res.status(500).send(`Server Error ${error.message}`);
  }
}