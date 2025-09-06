import express from 'express';
const router = express.Router();
import { addToWishlist, fetchWishlistData, deleteWishlistProduct, moveBookFromCartToWishlist, deleteAllWishlistProduct } from "../controllers/wishlistController.js";

router.get("/fetch", fetchWishlistData);
router.delete("/delete", deleteWishlistProduct);
router.delete("/deleteAll", deleteAllWishlistProduct);
router.post("/moveTowishlist", moveBookFromCartToWishlist);
router.post('/:bookName', addToWishlist);

export default router