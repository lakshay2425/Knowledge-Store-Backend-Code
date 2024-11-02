var express = require('express');
var router = express.Router();
const {fetchBooks,  fetchBook, fetchRecommendedBooks} = require("../controllers/indexController"); 


router.get('/books', fetchBooks);


router.get("/search/:bookName", fetchBook);

router.get("/recommendedBooks", fetchRecommendedBooks);

module.exports = router;
