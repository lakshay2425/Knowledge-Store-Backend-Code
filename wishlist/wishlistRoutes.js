import express from 'express';
const router = express.Router();
import { addToWishlist, fetchWishlistData, deleteWishlistProduct, moveBookFromCartToWishlist, deleteAllWishlistProduct } from "./wishlistController.js";

router.get("/", fetchWishlistData);
router.delete("/", deleteWishlistProduct);
router.delete("/deleteAll", deleteAllWishlistProduct);
router.post("/moveTowishlist", moveBookFromCartToWishlist);
router.post('/', addToWishlist);

export default router