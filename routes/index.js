var express = require('express');
var router = express.Router();
const {fetchBooks, fetchData, fetchBook} = require("../controllers/indexController"); 


router.get('/books', fetchBooks);

router.get('/books/:genre',fetchData);

router.get("/search/:bookName", fetchBook);

module.exports = router;
