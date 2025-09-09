import  express from 'express';
const router = express.Router();
import {addToCart, fetchCartData, deleteCartProduct, updateCart, moveBookFromWishlisttoCart, deleteAllCartProduct} from "./cartController.js";

router.get("/", fetchCartData);
router.delete("/", deleteCartProduct);
router.delete("/deleteAll", deleteAllCartProduct);
router.post("/moveTocart", moveBookFromWishlisttoCart);
router.post('/', addToCart);
router.patch("/", updateCart);

export default router;