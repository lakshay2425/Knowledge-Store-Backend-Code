const express = require('express');
const router = express.Router();
const {addToCart, fetchCartData, deleteCartProduct, moveBookFromWishlisttoCart, deleteAllCartProduct} = require("../controllers/cartController");

router.post('/:bookName', addToCart);
router.get("/fetch", fetchCartData);
router.delete("/:bookName/delete", deleteCartProduct);
router.post("/moveToCart", moveBookFromWishlisttoCart);
router.delete("/deleteAll", deleteAllCartProduct);

module.exports = router;