const express = require('express');
const router = express.Router();

//Importing middlewares
const {authenticate} = require("../middleware.js");
const {createRateLimiter} = require("../middlewares/rateLimiter.js")

//Importing routes
const authRoutes = require('./authRoutes.js');
const formRoutes = require("./formRoutes.js");
const wishlistRoutes = require("./wishlistRoutes.js")
const cartRoutes = require("./cartRoutes.js");
const adminRoutes = require("./adminRoutes.js");
const orderRoutes = require("./ordersRoute.js");
const userRoutes = require("./users.js");
const indexRouter = require("./index.js");


const limiter = createRateLimiter(30, 1); // 30 requests per 1 minute
const authLimiter = createRateLimiter(20, 5); // 20 requests per 5 minutes



router.use("/auth", authLimiter, authRoutes);
router.use("/forms",authenticate, limiter, formRoutes)
router.use('/', limiter, indexRouter);
router.use("/admin", authenticate, adminRoutes);
router.use("/user",authenticate,limiter, userRoutes);
router.use("/wishlist", authenticate, limiter, wishlistRoutes);
router.use("/cart",  limiter, cartRoutes);
router.use("/orders", authenticate, limiter,orderRoutes);


module.exports = router;