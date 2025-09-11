import express from 'express';
const router = express.Router();
import { fetchOrders, placeOrder, cancelOrder, fetchSpecificOrderDetails } from "../orders/ordersController.js";
import { authenticateUser } from '../middlewares/authMidlleware.js';

router.get("/", authenticateUser, fetchOrders);
router.post("/", placeOrder);
router.patch("/cancelOrder", cancelOrder);
router.get("/:id", fetchSpecificOrderDetails);

export default router