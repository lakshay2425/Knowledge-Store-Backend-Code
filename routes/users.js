var express = require('express');
var router = express.Router();
const {addToWishlist, fetchWishlistData, profileDetails,deleteWishlistProduct,deleteCartProduct,addToCart, fetchCartData, fetchOrders, placeOrder, cancelOrder, fetchSpecificOrderDetails} = require("../controllers/userControllers");


router.post('/:bookName/wishlist', addToWishlist);
router.post("/wishlist", fetchWishlistData);
router.delete("/:bookName/wishlist/delete", deleteWishlistProduct);
router.post('/:bookName/cart', addToCart);
router.post("/cart", fetchCartData);
router.delete("/:bookName/cart/delete", deleteCartProduct);
router.post("/profile", profileDetails);
router.post("/orders", fetchOrders);
router.post("/placeOrder", placeOrder);
router.patch("/cancelOrder", cancelOrder);
router.get("/order/:id", fetchSpecificOrderDetails);

module.exports = router;


