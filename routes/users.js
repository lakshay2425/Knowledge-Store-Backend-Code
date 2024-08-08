var express = require('express');
var router = express.Router();
const {addToWishlist, fetchWishlistData, deleteCartProduct,addToCart, fetchCartData} = require("../controllers/userControllers");

/* GET users listing. */
router.get('/:bookName/wishlist', addToWishlist);
router.get("/wishlist", fetchWishlistData);

router.get('/:bookName/cart', addToCart);
router.get("/cart", fetchCartData);
router.delete("/:bookName/cart/delete", deleteCartProduct);

module.exports = router;


