const loginAccount  = (params)=>{
    const {ipAddress, timestamp} = params;
    return  (
    `    <!DOCTYPE html>
    <html>
    <head>
      <title>Knowledge Store - New Login</title>
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
      </style>
    </head>
    <body>
      <div class="container">
        <h2>New Login Detected</h2>
        <p>A new login was detected on your Knowledge Store account from {${ipAddress}} at ${timestamp}.</p>
        <p>If this was you, please disregard this email. If not, please change your password immediately.</p>
      </div>
    </body>
    </html>
    `)    
}


module.exports.loginAccount = loginAccount;