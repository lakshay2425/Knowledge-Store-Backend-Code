var express = require('express');
var router = express.Router();
const {fetchBooks, fetchData} = require("../controllers/indexController"); 


router.get('/books', fetchBooks);

router.get('/books/:genre',fetchData);


module.exports = router;
