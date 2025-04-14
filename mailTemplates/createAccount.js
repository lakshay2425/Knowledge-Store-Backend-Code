const createAccount = (params)=> {
    const {username}  = params;
    return (
    `<!DOCTYPE html>
<html>
<head>
  <title>Welcome to Knowledge Store</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      color: #fff; /* White text for dark background */
      background-color: #001f3f; /* Navy blue background */
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
    a.button {
      display: inline-block;
      padding: 10px 20px;
      background-color: #fff; /* White button */
      color: #001f3f; /* Navy text on white button */
      text-decoration: none;
      border-radius: 5px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>Welcome to Knowledge Store, ${username}!</h2>
    <p>Thank you for creating an account. We're excited to have you join our community.</p>
  </div>
</body>
</html>`
)}

module.exports.createAccount = createAccount;