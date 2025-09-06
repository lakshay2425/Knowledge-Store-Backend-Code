import  express from 'express';
const router = express.Router();
import {addToCart, fetchCartData, deleteCartProduct, updateCart, moveBookFromWishlisttoCart, deleteAllCartProduct} from "../controllers/cartController.js";

router.post("/fetch", fetchCartData);
router.delete("/delete", deleteCartProduct);
router.delete("/deleteAll", deleteAllCartProduct);
router.post("/moveTocart", moveBookFromWishlisttoCart);
router.post('/:bookName', addToCart);
router.patch("/updateCart", updateCart);

export default router;