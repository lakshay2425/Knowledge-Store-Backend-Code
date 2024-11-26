const express = require('express');
const router = express.Router();
const {addToCart, fetchCartData, deleteCartProduct, moveBookFromWishlisttoCart} = require("../controllers/cartController");

router.post('/:bookName', addToCart);
router.get("/fetch", fetchCartData);
router.delete("/:bookName/delete", deleteCartProduct);
router.post("/moveToCart", moveBookFromWishlisttoCart);

module.exports = router;