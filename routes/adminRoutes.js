const express = require('express');
const router = express.Router();
const {bookDetails, deleteBook, updateBook, fetchAllUserOrders} = require("../controllers/adminControllers");


router.post("/create", bookDetails );


router.delete("/delete/:bookName", deleteBook);

router.put("/update/:bookName", updateBook);

router.get("/userOrders", fetchAllUserOrders);


module.exports = router;