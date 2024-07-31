const { insertBookDetails} = require('../utilis/databaseOperations/adminPanel/insert');
const debuglog = require("debug")("development:adminControllers");



module.exports.bookDetails = async (req,res) => {
    try{
    const {price, quantity ,genre, book_name, author, img_link} = req.body;
    const response = await insertBookDetails(price, quantity ,genre, book_name, author, img_link); // Function to insert contact details in the database
    res.json(response);
    } catch (err){
      res.status(500).send(`Server Error ${err}`);
    }
  };