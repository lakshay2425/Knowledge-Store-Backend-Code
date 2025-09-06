export const baseEmailLayout = ({ title, content, year = new Date().getFullYear() }) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <style>
    body { font-family: Arial, sans-serif; background: #001f3f; color: #fff; margin: 0; padding: 0; }
    .container { max-width: 700px; margin: 20px auto; padding: 20px; border-radius: 8px; }
    hr { border: 0; border-top: 1px solid #333; margin: 30px 0; }
    .footer { text-align: center; color: #888; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    ${content}

    <p style="font-size: 12px; color: #888888; margin-top: 20px;">
      This is an automated message from Knowledge Store. Please do not reply to this email.
    </p>

    <hr />

    <div class="footer">
      <p>Connect with me:</p>
      <a href="https://www.linkedin.com/in/lakshaymahajan25" target="_blank">
        <img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" width="24" height="24" />
      </a>
      <a href="https://github.com/lakshay2425" target="_blank">
        <img src="https://cdn-icons-png.flaticon.com/512/733/733553.png" width="24" height="24" />
      </a>
      <a href="https://lakshaymahajan.com/" target="_blank" style="color:#cccccc; text-decoration:underline;">
        Portfolio
      </a>
      <p style="margin-top: 20px;">© ${year} Lakshay Mahajan. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;
