import orders from "../models/order.js";
import userModel from "../users/user.js";
import bookModel from "../book/bookInfo.js";
import createHttpError from "http-errors";
import { returnError } from "../utilis/returnError.js";
import { asyncHandler, dbOperation } from "../utilis/advanceFunctions.js";

export const fetchOrders = asyncHandler(async (req, res) => {
    const userId  = req.userId;
    const userOrderDetails = await dbOperation(()=> orders.find({ userId }), `Failed to fetch orders associated with userId ${userId}`);
    
    let number = 0;
    
    if (userOrderDetails.length > 0) {
      number = userOrderDetails.length;
    }
    return res.status(200).json({
      message: "User's Order Details fetched successfully",
      orderDetails: userOrderDetails,
      orders: number
    })
});


async function placeBookOrder(email, bookName, numberOfDays, next) {
  try {
    const user = await userModel.findOne({ emailId: email });
    if (!user) {
      return next(createHttpError(400, "User doesn't exist, Login first"))
    }
    const userFullName = user.fullName;
    const userContactNumber = user.contactNumber;
    const userName = user.username;
    const bookDetails = await bookModel.findOne({ title: bookName });
    if (!bookDetails) {
      return returnError(404, "Book doesn't exist in the database", next);
    }
    const quantity = bookDetails.quantity;
    if (quantity == 0) {
      return returnError(300, "Book is not available", next);
    } else {
      const bookGenre = bookDetails.genres;
      const securityDeposit = bookDetails.price;
      const rentCharges = numberOfDays * 20;
      const order = await orders.create({
        fullName: userFullName,
        securityDeposit,
        rentCharges,
        emailId: email,
        genre: bookGenre,
        bookName,
        contactNumber: userContactNumber,
        username: userName,
        days: numberOfDays
      })
      await bookModel.findOneAndUpdate(
        { title: bookName },
        { quantity: quantity - 1 },
        { new: true }
      )
      return {
        success: true,
        total: rentCharges + securityDeposit,
        price: securityDeposit,
        quantity,
        id: order._id,
        rentCharges,
      };
    }
  } catch (error) {
    await bookModel.findOneAndUpdate(
      { title: bookName },
      { quantity: 1 },
      { new: true }
    )
    return { success: false, error: error.message };
  }
}

export const placeOrder = async (req, res, next) => {
  try {
    const { email, bookName, numberOfDays } = req.body;
    if (!email || !bookName || !numberOfDays) {
      return returnError(400, "Required fields are missing", next)
    }
    const result = await placeBookOrder(email, bookName, numberOfDays, next);
    if (result.success) {
      return res.status(201).json({
        message: `Orders place successfully}`,
        success: true,
      })
    } else {
      await bookModel.findOneAndUpdate(
        { title: bookName },
        { quantity: 1 },
        { new: true }
      )
      returnError(404, "Failed to place the order", next)
    }
  } catch (error) {
    console.log(error.message, "Internal Error inplacing the order");
    returnError(500, "Internal Error in placing the order", next);
  }
};

export const cancelOrder = async (req, res, next) => {
  try {
    const { orderId } = req.body;
    if (!orderId) {
      return returnError(400, "Required field is missing", next)
    }
    const orderDetails = await orders.findOneAndUpdate(
      { _id: orderId },
      { status: " cancelled" },
      { new: true }
    );
    const book = orderDetails.bookName;
    await bookModel.findOneAndUpdate(
      { title: book },
      { quantity: 1 },
      { new: true }
    );
    res.status(200).json({
      message: "Order cancelled successfully",
      success: true
    })
  } catch (error) {
    console.log("Internal Error in cancelling the order", error.message);
    returnError(500, "Internal Error in cancelling the order", next);
  }
}

export const fetchSpecificOrderDetails = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    if (!id) {
      return returnError(400, "Required field is missing", next)
    }

    const orderDetails = await dbOperation(()=> orders.find({ _id: id }), `Failed to fetch order details of id ${id}`);
    
    if (!orderDetails) {
      return returnError(400, "No order with this id exist", next)
    } else {
      res.status(200).json({
        message: "Order Details found",
        orderInfo: orderDetails,
        success: true
      })
    }
}) 