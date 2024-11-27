const orders = require("../models/order");
const userModel = require("../models/user");
const bookModel = require("../models/bookInfo");

module.exports.fetchOrders = async (req, res) => {
    const { email } = req.body;
  
    if (!email) {
      return res.status(404).json({
        message: "Email is required"
      })
    }
  
    const userOrderDetails = await orders.find({ emailId: email });
    const number = userOrderDetails.length;
    return res.status(200).json({
      message: "User Profile Details and Order Details fetched successfully",
      orderDetails: userOrderDetails,
      orders: number
    })
  };


  async function placeBookOrder(email, bookName, numberOfDays) {
    try {
      const user = await userModel.findOne({ emailId: email });
    if (!user) {
      return res.status(500).json({
        message: "User doesn't exist. Login first"
      })
    }
    const userFullName = user.fullName;
    const userContactNumber = user.contactNumber;
    const userName = user.username;
    const bookDetails = await bookModel.findOne({ title: bookName });
    if (!bookDetails) {
      return res.status(404).json({
        message: "Book doesn't exist in the database"
      })
    }
    const quantity = bookDetails.quantity;
    if (quantity == 0) {
      return res.status(300).json({
        message: "Book isn't available"
      })
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
      const updatedBookDetails = await bookModel.findOneAndUpdate(
        { title: bookName },
        { quantity: quantity - 1 },
        { new: true }
      )
      return true;
    }
    } catch (error) {
     console.log("Error", error.message);
     return false;
     //throw error("Failed to place the order") 
    }
  }
  
  module.exports.placeOrder = async (req, res) => {
    try {
      const { email, bookName, numberOfDays } = req.body;
      if (!email || !bookName || !numberOfDays) {
        return res.status(500).json({
          message: "All field are necessary"
        })
      }
      const result = placeBookOrder(email, bookName, numberOfDays);
      if(result){
        return res.status(201).json({
          message: "Orders place successfully",
          success : true
        })
      }else{
        return res.status(404).json({
          message : "Failed to place the order Try again later",
          success : false
        })
      }
    } catch (error) {
      console.log(error.message);
      res.status(500).json({
        message: "Failed to place the order",
        error: error.message
      })
    }
  };  

  module.exports.cancelOrder = async (req, res) => {
    try {
      const { orderId } = req.body;
      const orderDetails = await orders.findOneAndUpdate(
        { _id: orderId },
        { status: " cancelled" },
        { new: true }
      );
      const book = orderDetails.bookName;
      const bookDetails = await bookModel.findOneAndUpdate(
        { title: book },
        { quantity: 1 },
        { new: true }
      );
      res.status(200).json({
        message: "Order cancelled successfully",
        success: true
      })
    } catch (error) {
      console.log(error.message);
      const orderDetails = await orders.findOneAndUpdate(
        { _id: orderId },
        { status: "ordered" }
      );
      res.status(404).json({
        message: error.message
      })
    }
  }

  module.exports.fetchSpecificOrderDetails = async (req, res) => {
    try {
      const { id } = req.params;
      const orderDetails = await orders.find({ _id: id });
      if (!orderDetails) {
        return res.status(404).json({
          message: "No order exist with this order id",
          success: false
        })
      } else {
        res.status(200).json({
          message: "Order Details found",
          orderInfo: orderDetails,
          success: true
        })
      }
    } catch (error) {
      console.log(error.message);
      res.status(404).json({
        message: error.message
      })
    }
  }  