var express = require('express');
var router = express.Router();
const {fetchBooks,  fetchBook} = require("../controllers/indexController"); 


router.get('/books', fetchBooks);


router.get("/search/:bookName", fetchBook);

module.exports = router;
