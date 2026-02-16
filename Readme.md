# Knowledge Store Backend

> ⚠️ **This project is discontinued and no longer actively maintained.**

**Knowledge Store** is a book rental platform backend that allows users to rent books from a wide selection of genres at affordable prices. The platform solves the problem of expensive book purchases and storage by enabling users to rent books for as long as they need, then return them when finished.

---

## Features

- **User Authentication**: Secure authentication using JWT and bcrypt
- **Book Management**: Admins can add, update, and delete books
- **Book Search**: Users can search for books by name or genre
- **Wishlist & Cart**: Users can add books to their wishlist or cart, move books between them, and remove books
- **Order Management**: Place, fetch, and cancel book orders
- **Feedback & Suggestions**: Users can submit feedback, contact forms, and book suggestions
- **Reviews & Testimonials**: Users can leave book reviews and testimonials
- **Caching**: Uses Redis for caching frequently accessed data
- **Security**: Implements rate limiting and Helmet for security headers
- **Docker Support**: Production-ready Docker configuration with Caddy reverse proxy

---

## Technologies Used

- **Express.js**: Server framework
- **MongoDB Atlas**: Cloud database
- **Mongoose**: MongoDB ODM
- **jsonwebtoken**: User authentication
- **bcrypt**: Password hashing
- **Redis**: Caching layer
- **Helmet**: Security headers
- **Joi**: Request validation
- **express-rate-limit**: Rate limiting
- **Docker**: Containerization

---

## Prerequisites

- Node.js 18.x or higher
- MongoDB Atlas account or local MongoDB instance
- Redis instance (local or cloud)
- Docker (optional, for containerized deployment)

---

## Project Structure

The project follows a feature-based modular architecture:

```
backend/
├── admin/          # Admin routes and controllers
├── book/           # Book info and controllers
├── cart/           # Cart functionality
├── form/           # Feedback, contact, and suggestion forms
├── orders/         # Order management
├── users/          # User profiles, reviews, testimonials
├── wishlist/       # Wishlist functionality
├── models/         # Mongoose schemas
├── routes/         # Route aggregation and payment routes
├── middlewares/    # Auth, rate limiter, error handler
├── utilis/         # Utility functions
├── config/         # Configuration files
├── mailTemplates/  # Email templates
└── Docker/         # Docker configuration
```

---

## API Routes

All routes are prefixed with `/api`

| Route | Description |
|-------|-------------|
| `/` | Fetch all books or specific book details |
| `/admin` | Manage book details (insert, update, delete) |
| `/user` | User profile, testimonials, reviews, account management |
| `/wishlist` | Wishlist operations |
| `/cart` | Cart operations |
| `/orders` | Place, fetch, and cancel orders |
| `/forms` | Submit feedback, contact, and suggestion forms |
| `/payment` | Payment processing |
| `/health` | Health check endpoint |

---

## Getting Started

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set environment variables**  
   Copy `.env.example` to `.env` and fill in the required values:
   ```bash
   cp .env.example .env
   ```

4. **Start the server**
   ```bash
   npm run dev
   ```
   The server will run on port `3000` by default.

### Docker Deployment

The project includes Docker configuration for production deployment with Redis and Caddy reverse proxy:

```bash
cd Docker
docker compose up -d
```

---

## Environment Variables

See `.env.example` for all required environment variables:

- `PORT` - Server port
- `MONGO_ATLAS_URI` - MongoDB connection string
- `REDIS_URL` - Redis connection URL
- `JWT_PUBLIC_KEY` - JWT public key for verification
- `LOCALHOST_FRONTEND_URL` - Local frontend URL (for CORS)
- `PRODUCTION_FRONTEND_URL` - Production frontend URL (for CORS)

---

## License

This project is open source and available under the [MIT License](LICENSE).

---

## Contact

For suggestions or questions, contact: **lakshay12290@gmail.com**
