const express = require('express');
const router = express.Router();
const {bookDetails, deleteBook, updateBook} = require("../controllers/adminControllers");


router.post("/create", bookDetails );


router.delete("/delete/:bookName", deleteBook);

router.put("/update/:bookName", updateBook);


module.exports = router;