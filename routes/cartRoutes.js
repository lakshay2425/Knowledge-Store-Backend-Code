const express = require('express');
const router = express.Router();
const {addToCart, fetchCartData, deleteCartProduct, updateCart, moveBookFromWishlisttoCart, deleteAllCartProduct} = require("../controllers/cartController");

router.get("/fetch", fetchCartData);
router.delete("/delete", deleteCartProduct);
router.delete("/deleteAll", deleteAllCartProduct);
router.post("/moveTocart", moveBookFromWishlisttoCart);
router.post('/:bookName', addToCart);
router.patch("/updateCart", updateCart);

module.exports = router;