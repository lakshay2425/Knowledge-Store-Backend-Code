import express from 'express';
const router = express.Router();
import { fetchOrders, placeOrder, cancelOrder, fetchSpecificOrderDetails } from "../orders/ordersController.js";

router.get("/fetch", fetchOrders);
router.post("/placeOrder", placeOrder);
router.patch("/cancelOrder", cancelOrder);
router.get("/:id", fetchSpecificOrderDetails);

export default router