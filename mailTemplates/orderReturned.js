const orderReturned = ({customerName, orderId, returnDate, websiteUrl,rentalPeriod,currentYear=currentYear=new Date().getFullYear(),refundAmount,bookAuthor,bookTitle, totalPaid})=>{
    `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Returned - Knowledge Store</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f8f9fa;
            padding: 20px;
        }
        
        .template-container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            overflow: hidden;
            position: relative;
        }
        
        .template-container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        
        .header::before {
            content: '';
            position: absolute;
            top: -50%;
            right: -50%;
            width: 100%;
            height: 100%;
            background: rgba(255,255,255,0.1);
            border-radius: 50%;
            transform: rotate(45deg);
        }
        
        .header h1 {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 8px;
            position: relative;
            z-index: 1;
        }
        
        .header p {
            font-size: 16px;
            opacity: 0.9;
            position: relative;
            z-index: 1;
        }
        
        .icon {
            width: 60px;
            height: 60px;
            margin: 0 auto 20px;
            background: rgba(255,255,255,0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28px;
            position: relative;
            z-index: 1;
        }
        
        .content {
            padding: 40px 30px;
        }
        
        .order-details {
            background: linear-gradient(135deg, #f8f9ff 0%, #e3f2fd 100%);
            border-radius: 15px;
            padding: 25px;
            margin: 25px 0;
            border-left: 4px solid #667eea;
        }
        
        .order-details h3 {
            color: #667eea;
            font-size: 18px;
            margin-bottom: 15px;
            font-weight: 600;
        }
        
        .detail-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 12px;
            padding-bottom: 8px;
            border-bottom: 1px solid rgba(102, 126, 234, 0.1);
        }
        
        .detail-row:last-child {
            border-bottom: none;
            margin-bottom: 0;
        }
        
        .detail-label {
            font-weight: 600;
            color: #555;
        }
        
        .detail-value {
            color: #333;
            font-weight: 500;
        }
        
        .status-badge {
            display: inline-block;
            padding: 8px 16px;
            border-radius: 25px;
            font-weight: 600;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .status-returned {
            background: linear-gradient(135deg, #ff9800, #f57c00);
            color: white;
        }
        
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 30px;
            font-weight: 600;
            font-size: 16px;
            text-align: center;
            margin: 20px 0;
            box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
            transition: transform 0.2s ease;
        }
        
        .cta-button:hover {
            transform: translateY(-2px);
        }
        
        .footer {
            background: #f8f9fa;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e9ecef;
        }
        
        .automated-message {
            font-size: 12px;
            color: #888888;
            margin-top: 20px;
        }
        
        .footer hr {
            border: none;
            border-top: 1px solid #e9ecef;
            margin: 20px 0;
        }
        
        .social-links {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 15px;
            margin: 15px 0;
        }
        
        .social-links a {
            display: inline-block;
            transition: transform 0.2s ease;
        }
        
        .social-links a:hover {
            transform: translateY(-2px);
        }
        
        .social-links img {
            border-radius: 4px;
        }
        
        .portfolio-link {
            color: #667eea !important;
            text-decoration: none;
            font-weight: 600;
            padding: 8px 16px;
            border-radius: 20px;
            background: rgba(102, 126, 234, 0.1);
            transition: all 0.2s ease;
        }
        
        .portfolio-link:hover {
            background: rgba(102, 126, 234, 0.2);
            transform: translateY(-1px);
        }
        
        .copyright {
            margin-top: 20px;
            font-size: 12px;
            color: #666;
        }
        
        .testing-notice {
            background: linear-gradient(135deg, #fff3cd, #ffeaa7);
            border: 1px solid #ffeaa7;
            border-radius: 10px;
            padding: 20px;
            margin: 25px 0;
            text-align: center;
        }
        
        .testing-notice h4 {
            color: #856404;
            font-size: 16px;
            margin-bottom: 8px;
            font-weight: 600;
        }
        
        .testing-notice p {
            color: #856404;
            font-size: 14px;
            line-height: 1.5;
        }
        
        .book-list {
            background: white;
            border-radius: 10px;
            padding: 20px;
            margin: 20px 0;
            border: 1px solid #e9ecef;
        }
        
        .book-item {
            display: flex;
            align-items: center;
            padding: 15px 0;
            border-bottom: 1px solid #f1f3f4;
        }
        
        .book-item:last-child {
            border-bottom: none;
        }
        
        .book-image {
            width: 60px;
            height: 80px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            border-radius: 8px;
            margin-right: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 12px;
        }
        
        .book-details {
            flex: 1;
        }
        
        .book-title {
            font-weight: 600;
            color: #333;
            margin-bottom: 4px;
        }
        
        .book-author {
            color: #666;
            font-size: 14px;
        }
        
        .book-price {
            color: #667eea;
            font-weight: 600;
            font-size: 16px;
        }
        
        @media (max-width: 600px) {
            .template-container {
                border-radius: 15px;
            }
            
            .header {
                padding: 30px 20px;
            }
            
            .header h1 {
                font-size: 24px;
            }
            
            .content {
                padding: 30px 20px;
            }
            
            .order-details {
                padding: 20px;
            }
            
            .detail-row {
                flex-direction: column;
                gap: 4px;
            }
            
            .book-item {
                flex-direction: column;
                text-align: center;
                gap: 10px;
            }
            
            .book-image {
                margin-right: 0;
            }
        }
    </style>
</head>
<body>
    <div class="template-container">
        <div class="header">
            <div class="icon">📦</div>
            <h1>Order Returned</h1>
            <p>Your return has been processed</p>
        </div>
        <div class="content">
            <p>Hi <strong>${customerName}</strong>,</p>
            <p>We've successfully processed your book return. Thank you for using our rental service!</p>
            
            <div class="order-details">
                <h3>🔄 Return Details</h3>
                <div class="detail-row">
                    <span class="detail-label">Order ID:</span>
                    <span class="detail-value">${orderId}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Return Date:</span>
                    <span class="detail-value">${returnDate}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Rental Period:</span>
                    <span class="detail-value">${rentalPeriod} days</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Status:</span>
                    <span class="status-badge status-returned">Returned</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Refund Amount:</span>
                    <span class="detail-value">₹${refundAmount}</span>
                </div>
            </div>
            
            <div class="book-list">
                <h3>📚 Returned Books</h3>
                <div class="book-item">
                    <div class="book-image">BOOK</div>
                    <div class="book-details">
                        <div class="book-title">${bookTitle}</div>
                        <div class="book-author">by ${bookAuthor}</div>
                    </div>
                    <div class="book-price">₹${totalPaid}</div>
                </div>
            </div>
            
            <div class="testing-notice">
                <h4>🧪 Testing Mode Notice</h4>
                <p>This application is currently in testing phase. No actual books were delivered or returned. This is a demonstration of our email notification system.</p>
            </div>
            
            <a href="${websiteUrl}" class="cta-button">Rent More Books</a>
        </div>
        <div class="footer">
            <p>We hope you enjoyed your reading experience!</p>
            <p>Thank you for choosing Knowledge Store 📖</p>
            
            <p class="automated-message">
                This is an automated message from Knowledge Store. Please do not reply to this email.
            </p>

            <hr />

            <div>
                <p>Connect with me:</p>
                <div class="social-links">
                    <a href="https://www.linkedin.com/in/lakshaymahajan25" target="_blank">
                        <img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" width="24" height="24" alt="LinkedIn" />
                    </a>
                    <a href="https://github.com/lakshay2425" target="_blank">
                        <img src="https://cdn-icons-png.flaticon.com/512/733/733553.png" width="24" height="24" alt="GitHub" />
                    </a>
                    <a href="https://lakshaymahajan.com/" target="_blank" class="portfolio-link">
                        Portfolio
                    </a>
                </div>
                <p class="copyright">© ${currentYear} Lakshay Mahajan. All rights reserved.</p>
            </div>
        </div>
    </div>
</body>
</html>`
}

module.exports = {orderReturned};