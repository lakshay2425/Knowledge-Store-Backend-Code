var express = require('express');
var router = express.Router();
const {addToWishlist, fetchWishlistData, deleteWishlistProduct,deleteCartProduct,addToCart, fetchCartData} = require("../controllers/userControllers");


router.post('/:bookName/wishlist', addToWishlist);
router.post("/wishlist", fetchWishlistData);
router.post('/:bookName/cart', addToCart);
router.post("/cart", fetchCartData);
router.delete("/:bookName/cart/delete", deleteCartProduct);
router.delete("/:bookName/wishlist/delete", deleteWishlistProduct);

module.exports = router;


