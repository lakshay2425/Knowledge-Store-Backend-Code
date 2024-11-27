const express = require('express');
const router = express.Router();
const {addToWishlist,fetchWishlistData,deleteWishlistProduct, moveBookFromCartToWishlist, deleteAllWishlistProduct} = require("../controllers/wishlistController"); 

router.post('/:bookName', addToWishlist);
router.get("/fetch", fetchWishlistData);
router.delete("/:bookName/delete", deleteWishlistProduct);
router.post("/moveToWishlist", moveBookFromCartToWishlist);
router.delete("/deleteAll", deleteAllWishlistProduct);

module.exports = router;