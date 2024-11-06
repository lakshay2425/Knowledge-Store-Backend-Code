var express = require('express');
var router = express.Router();
const {addToWishlist, fetchWishlistData,deleteUserAccount, profileDetails,deleteWishlistProduct,deleteCartProduct,addToCart, fetchCartData, userTestimonial,bookReview, fetchOrders, placeOrder, cancelOrder, fetchSpecificOrderDetails, fetchUserTestimonial, fetchReveiw, moveBookFromCartToWishlist, moveBookFromWishlisttoCart} = require("../controllers/userControllers");


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
router.post("/bookReview", bookReview);
router.post("/testimonial",userTestimonial);
router.get("/fetchTestimonial", fetchUserTestimonial);
router.get("/fetchBookReview/:bookName", fetchReveiw);
router.delete("/deleteAccount", deleteUserAccount);
router.post("/moveToWishlist", moveBookFromCartToWishlist);
router.post("/moveToCart", moveBookFromWishlisttoCart);

module.exports = router;


