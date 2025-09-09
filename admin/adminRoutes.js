import  express from 'express';
const router = express.Router();
import {bookDetails, deleteBook, updateBook, fetchAllUserOrders} from "./adminControllers.js";


router.post("/create", bookDetails );
router.delete("/delete/:bookName", deleteBook);
router.put("/update/:bookName", updateBook);
router.get("/userOrders", fetchAllUserOrders);

export default router;