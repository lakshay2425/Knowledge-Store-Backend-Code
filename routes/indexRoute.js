import express from 'express';
const router = express.Router();


//Importing routes
import formRoutes from "../form/formRoutes.js";
import  wishlistRoutes from "../wishlist/wishlistRoutes.js"
import cartRoutes from "../cart/cartRoutes.js";
import adminRoutes from "../admin/adminRoutes.js";
import orderRoutes from "../orders/ordersRoute.js";
import userRoutes from "../users/users.js";
import paymentRoutes from "./paymentRoutes.js";
import indexRouter from "../book/index.js";

//Importing middlewares
import { createRateLimiter } from "../middlewares/rateLimiter.js"
import { authenticateUser } from '../middlewares/authMidlleware.js';

const  limiter = createRateLimiter(30, 1);



router.use("/forms", limiter, authenticateUser, formRoutes)
router.use('/', limiter, indexRouter);
router.use("/admin", adminRoutes);
router.use("/payment", paymentRoutes)
router.use("/user", limiter, userRoutes);
router.use("/wishlist", limiter, authenticateUser,wishlistRoutes);
router.use("/cart", limiter, authenticateUser,cartRoutes);
router.use("/orders", limiter, orderRoutes);


export default router