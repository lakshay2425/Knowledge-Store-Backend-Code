const express = require('express');
const router = express.Router();
const {fetchOrders, placeOrder, cancelOrder, fetchSpecificOrderDetails} = require("../controllers/ordersController");

router.post("/fetch", fetchOrders);
router.post("/placeOrder", placeOrder);
router.patch("/cancelOrder", cancelOrder);
router.get("/:id", fetchSpecificOrderDetails);

module.exports = router;