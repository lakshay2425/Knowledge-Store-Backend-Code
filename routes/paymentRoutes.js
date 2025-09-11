import express from "express";
import createHttpError from "http-errors";
import bookModel from "../book/bookInfo.js";
import axios from 'axios'
const router = express.Router();

router.post("/orderId", async (req, res, next) => {
    // const {bookName, numberOfDays} = req.body;
    const bookName = "Rich Dad Poor Dad";
    const numberOfDays = 10;
    if (!bookName || !numberOfDays) {
        return next(createHttpError(400, "Required field missing"));
    }
    let book;
    try {
        book = await bookModel.findOne({ title: bookName });
        if (!book) {
            return next(createHttpError(400, "Book doesn't exist in our Database"));
        }
    } catch (error) {
        console.error("Error in finding book", error.message);
        return next(createHttpError(500, "Failed to retrive book"))
    }
    if (book.quantity == 0) {
        return next(createHttpError(400, "Book isn't available right now"));
    }
    // const payableAmount = book.price + numberOfDays*20;
    const payableAmount = 500;
    let response;
    try {
        response = await axios.post("http://localhost:7000/api/payment/create/orderId", { payableAmount }, {
            headers: { "Content-Type": "application/json" }
        })
    } catch (error) {
        console.error("Error in calling the API to generate OrderId", error.message);
        return next(createHttpError(500, "Failed to call API to get orderId"))
    }
    console.log(response.data);
    res.status(201).json({
        success: true,
        orderId: JSON.stringify(response.data.orderId)
    })
})

export default router;