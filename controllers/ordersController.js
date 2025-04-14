const orders = require("../models/order");
const userModel = require("../models/user");
const bookModel = require("../models/bookInfo");
const { sendEmail } = require("../utilis/mailFunction");

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
    if (!bookDetails){
      return res.status(404).json({
        message: "Book doesn't exist in the database"
      })
    }
    const quantity = bookDetails.quantity;
    if (quantity == 0){
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
  
  module.exports.placeOrder = async (req, res) => {
    try {
      const { email, bookName, numberOfDays } = req.body;
      if (!email || !bookName || !numberOfDays) {
        return res.status(500).json({
          message: "All field are necessary"
        })
      }
      const result = await placeBookOrder(email, bookName, numberOfDays);
      if(result.success){
        const response = await sendEmail(email, 
          {bookInfo : {
            title : bookName,
             quantity: result.quantity,
              price: result.price,
              id: result.id,
              rentalCharges : result.rentCharges 
            }, total : result.total}, 3 ,"Thank you for ordering and choosing us");
        return res.status(201).json({
          message: `Orders place successfully, and ${response ? "Mail sent" :" Failed to sent the mail"}`,
          success : true,
          mailStatus: response,
        })
      }else{
        console.log(result.error)
        await bookModel.findOneAndUpdate(
          { title: bookName },
          { quantity: 1 },
          { new: true }
        )
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
      await orders.findOneAndUpdate(
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
      res.status(404).json({
        message: error.message
      })
    }
  }  