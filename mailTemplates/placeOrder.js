const orderConfirmation  = (options)=>{
    const {bookInfo, total}= options;
    return (
        `<!DOCTYPE html>
<html>
<head>
  <title>Knowledge Store - Order Confirmation</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      color: #fff;
      background-color: #001f3f;
      line-height: 1.6;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      padding: 20px;
      border-radius: 8px;
    }
    h2 {
      color: #fff;
      text-align: center;
      margin-bottom: 20px;
    }
    p {
      margin-bottom: 15px;
    }
    ul {
      list-style-type: none;
      padding: 0;
    }
    li {
      margin-bottom: 8px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>Order Confirmation</h2>
    <p>Thank you for your order from Knowledge Store! Your order ID is ${bookInfo.id}.</p>
    <p>Order Details:</p>
    <ul>
      <li> Book Name ${bookInfo.title}, </li>
      <li> Quantity ${bookInfo.quantity}, </li>
      <li> Price of the book ${bookInfo.price}, <li>
      <li> Rental Charges are ${bookInfo.rentalCharges}</li>
    </ul>
    <p>Total: ${total}</p>
    <p>We will notify you when your order has been shipped.</p>
  </div>
</body>
</html>`
    )
}


module.exports.orderConfirmation = orderConfirmation;