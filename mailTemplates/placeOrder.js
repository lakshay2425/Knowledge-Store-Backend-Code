import {baseEmailLayout} from "./baseEmailLayout.js";

export const generateOrderContent = (orders) => {
  const rows = orders.map(({ orderInfo }, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${orderInfo.id}</td>
      <td>${orderInfo.title}</td>
      <td>${orderInfo.quantity}</td>
      <td>₹${orderInfo.price}</td>
      <td>₹${orderInfo.rentalCharges}</td>
    </tr>`).join("");

  const total = orders.reduce((sum, { orderInfo }) => sum + (orderInfo.totalAmount || 0), 0);

  return `
    <h2>Order Confirmation</h2>
    <p>Thank you for your order from Knowledge Store!</p>
    <table border="1" cellpadding="8" cellspacing="0" style="width:100%; border-collapse: collapse; color: #fff;">
      <thead>
        <tr><th>#</th><th>Order ID</th><th>Book Name</th><th>Qty</th><th>Price</th><th>Rental</th></tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
    <p><strong>Total Amount: ₹${total}</strong></p>
    <p>We will notify you when your order has been shipped.</p>
  `;
};

export const orderConfirmation = (orders) => baseEmailLayout({
  title: "Knowledge Store - Order Confirmation",
  content: generateOrderContent(orders),
});

