const express = require('express');
const router = express.Router();

//Importing middlewares
const {createRateLimiter} = require("../middlewares/rateLimiter.js")

//Importing routes
const formRoutes = require("./formRoutes.js");
const wishlistRoutes = require("./wishlistRoutes.js")
const cartRoutes = require("./cartRoutes.js");
const adminRoutes = require("./adminRoutes.js");
const orderRoutes = require("./ordersRoute.js");
const userRoutes = require("./users.js");
const paymentRoutes = require("./paymentRoutes.js");
const indexRouter = require("./index.js");


const limiter = createRateLimiter(30, 1); 



router.use("/forms", limiter, formRoutes)
router.use('/', limiter, indexRouter);
router.use("/admin" , adminRoutes);
router.use("/user",limiter, userRoutes);
router.use("/wishlist",  limiter, wishlistRoutes);
router.use("/cart",  limiter, cartRoutes);
router.use("/orders",  limiter,orderRoutes);
router.use("/payment", paymentRoutes)


module.exports = router;