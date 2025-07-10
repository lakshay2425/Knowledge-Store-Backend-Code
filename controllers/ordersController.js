const orders = require("../models/order");
const userModel = require("../models/user");
const bookModel = require("../models/bookInfo");
const createHttpError = require("http-errors");
const {returnError} = require("../utilis/returnError");

module.exports.fetchOrders = async (req, res, next) => {
    try {
      const { email } = req.body;
    if (!email) {
      return returnError(400, "Required field is missing", next);
    }
    const userOrderDetails = await orders.find({ emailId: email });
    const number = userOrderDetails.length;
    return res.status(200).json({
      message: "User Profile Details and Order Details fetched successfully",
      orderDetails: userOrderDetails,
      orders: number
    })
    } catch (error) {
      console.log(error.message, "Internal Error in fetching user's order");
      returnError(500, "Internal Error in fetching user's order", next);
    }
  };


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
    if (!bookDetails){
      return returnError(404, "Book doesn't exist in the database", next);
    }
    const quantity = bookDetails.quantity;
    if (quantity == 0){
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
        total : rentCharges + securityDeposit,
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
     return {success: false, error: error.message};  
    }
  }
  
  module.exports.placeOrder = async (req, res, next) => {
    try {
      const { email, bookName, numberOfDays } = req.body;
      if (!email || !bookName || !numberOfDays) {
        return returnError(400,"Required fields are missing" ,next)
      }
      const result = await placeBookOrder(email, bookName, numberOfDays, next);
      if(result.success){
        return res.status(201).json({
          message: `Orders place successfully}`,
          success : true,
        })
      }else{
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

  module.exports.cancelOrder = async (req, res, next) => {
    try {
      const { orderId } = req.body;
      if(!orderId){
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
        returnError(500, "Internal Error in cancelling the order",next);
    }
  }

  module.exports.fetchSpecificOrderDetails = async (req, res, next) => {
    try {
      const { id } = req.params;
       if(!id){
        return returnError(400, "Required field is missing", next)
      }
      const orderDetails = await orders.find({ _id: id });
      if (!orderDetails) {
        return returnError(400, "No order with this id exist", next)
      } else {
        res.status(200).json({
          message: "Order Details found",
          orderInfo: orderDetails,
          success: true
        })
      }
    } catch (error) {
      console.log("Internal Error in fetching specific order details", error.message);
        returnError(500, "Internal Error in fetching specific order details",next);
    }
  }  