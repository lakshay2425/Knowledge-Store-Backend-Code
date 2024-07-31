const express = require('express');
const router = express.Router();
const {bookDetails} = require("../controllers/adminControllers");


router.post("/create", bookDetails );

router.post("/read",);

router.post("/delete",)

router.post("/update",)


module.exports = router;