# Knowledge Store Backend

**Knowledge Store** is a book rental platform backend that allows users to rent books from a wide selection of genres at affordable prices. The platform solves the problem of expensive book purchases and storage by enabling users to rent books for as long as they need, then return them when finished.

---

## Features

- **User Authentication**: Secure signup and login using JWT and bcrypt.
- **Book Management**: Admins can add, update, and delete books.
- **Book Search**: Users can search for books by name or genre.
- **Wishlist & Cart**: Users can add books to their wishlist or cart, move books between them, and remove books.
- **Order Management**: Place, fetch, and cancel book orders.
- **Feedback & Suggestions**: Users can submit feedback, contact forms, and book suggestions.
- **Caching**: Uses Redis for caching frequently accessed data.
- **Security**: Implements rate limiting, helmet, and attack protection middleware.

---

## Technologies Used

- **ExpressJS**: Server framework
- **MongoDB Atlas**: Cloud database
- **Mongoose**: MongoDB ODM
- **jsonwebtoken**: User authentication
- **bcrypt**: Password encryption
- **Redis**: Caching layer
- **Cloudinary**: Book image storage
- **Nodemailer**: Email service (planned)
- **Helmet**: Security headers
- **Arcjet**: Attack and signup protection

---

## Project Structure

- **controllers/**: Route handler logic (admin, user, cart, wishlist, orders, forms, etc.)
- **models/**: Mongoose schemas for all entities (User, Book, Order, Wishlist, etc.)
- **routes/**: Express route definitions, grouped by feature
- **middlewares/**: Global error handler, rate limiter, protection middleware
- **utilis/**: Utility functions (encryption, validation, Redis, etc.)
- **config/**: Configuration for MongoDB, Redis, and environment variables

---

## API Route Categories

1. **AdminRoutes**: Manage book details (insert, update, delete)
2. **AuthRoutes**: Signup, login, logout
3. **FormRoutes**: Handle suggestion, contact, and feedback forms
4. **IndexRoute**: Fetch all books or specific book details
5. **UserRoute**: Wishlist, cart, profile, testimonials, reviews, account management
6. **OrderRoutes**: Place, fetch, and cancel orders

---

## How to Run

1. **Clone the repository**
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Set environment variables**  
   Create a `.env` file with all required variables (see `config/config.js` for keys).
4. **Start MongoDB Atlas and Redis**  
   Ensure your MongoDB Atlas and Redis instances are running and accessible.
5. **Run the server**
   ```bash
   node app.js
   ```
   The server will run on port `3000` by default.

---

## Future Plans

- Dockerize the application for easier deployment.
- Add a book summary section to help users decide which book to rent.
- Integrate email notifications for orders and feedback.

---

## Contact

For suggestions or questions, contact: **lakshay12290@gmail.com**

---