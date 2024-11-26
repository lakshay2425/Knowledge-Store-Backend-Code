const express = require('express');
const router = express.Router();
const {addToWishlist,fetchWishlistData,deleteWishlistProduct, moveBookFromCartToWishlist} = require("../controllers/wishlistController"); 

router.post('/:bookName', addToWishlist);
router.get("/fetch", fetchWishlistData);
router.delete("/:bookName/delete", deleteWishlistProduct);
router.post("/moveToWishlist", moveBookFromCartToWishlist);

module.exports = router;