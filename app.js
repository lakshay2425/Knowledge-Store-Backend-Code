require("dotenv").config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const indexRouter = require('./routes/index');
const authRoutes = require('./routes/authRoutes');
const formRoutes = require("./routes/formRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes")
const cartRoutes = require("./routes/cartRoutes");
const adminRoutes = require("./routes/adminRoutes");
const orderRoutes = require("./routes/ordersRoute");
const userRoutes = require("./routes/users");
const rateLimit = require('express-rate-limit');
const app = express();
const MongoDB = require("./config/mongoose");
const helmet = require('helmet');
const {authenticate} = require("./middleware");
const {connectRedis} = require("./config/redis")

MongoDB();

// Set trust proxy (modify as needed for your environment)
app.set('trust proxy', 1); // or 1, or 'multiple'

const createRateLimiter = (maxRequests, timeInMinutes) => {
  return rateLimit({
    windowMs: timeInMinutes * 60 * 1000, // time in minutes
    max: maxRequests, // limit each IP to maxRequests per windowMs
    standardHeaders: true, // Return rate limit info in the RateLimit-* headers
    legacyHeaders: false, // Disable the X-RateLimit-* headers
    handler: (req, res) => {
      res.status(429).json({
        error: "Too Many Requests",
        message: `You have exceeded the rate limit. Please wait ${timeInMinutes} minutes before making another request.`
      });
    }
  });
};

const limiter = createRateLimiter(30, 1); // 30 requests per 1 minute
const authLimiter = createRateLimiter(20, 5); // 20 requests per 5 minutes


const frontendURLs = [process.env.LOCALHOST_FRONTEND_URL, process.env.PRODUCTION_FRONTEND_URL];
const allowedOrigins = frontendURLs;

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true, // Allow cookies to be sent and received,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
}));

// Use Helmet for security headers
app.use(helmet());

// Additional headers for extra security
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader("Content-Security-Policy", "default-src 'self'");
  next();
});


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use("/auth", authLimiter, authRoutes);
app.use("/forms",authenticate, limiter, formRoutes)
app.use('/', limiter, indexRouter);
app.use("/admin", authenticate, adminRoutes);
app.use("/user",authenticate,limiter, userRoutes);
app.use("/wishlist", authenticate, limiter, wishlistRoutes);
app.use("/cart", authenticate, limiter, cartRoutes);
app.use("/orders", authenticate, limiter,orderRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
});


(async () => {
  try {
    await connectRedis(); // ensure connection first
    app.listen(3000, () => {
      console.log("🚀 Server running on port 3000");
    });
  } catch (err) {
    console.error("❌ Could not connect to Redis", err);
    process.exit(1); // Exit if Redis fails to connect
  }
})();



module.exports = app;
