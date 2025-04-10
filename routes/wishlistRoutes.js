const express = require('express');
const router = express.Router();
const {addToWishlist,fetchWishlistData,deleteWishlistProduct, moveBookFromCartToWishlist, deleteAllWishlistProduct} = require("../controllers/wishlistController"); 

router.get("/fetch", fetchWishlistData);
router.delete("/delete", deleteWishlistProduct);
router.delete("/deleteAll", deleteAllWishlistProduct);
router.post("/moveTowishlist", moveBookFromCartToWishlist);
router.post('/:bookName', addToWishlist);

module.exports = router;