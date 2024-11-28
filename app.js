const createError = require('http-errors');
const express = require('express');
const path = require('path');
const config = require("config");
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


MongoDB();

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  standardHeaders: true, // Return rate limit info in the RateLimit-* headers
  legacyHeaders: false, // Disable the X-RateLimit-* headers
  handler: (req, res, next) => {
    console.log(`Rate limit exceeded for IP ${req.ip}`);
    res.status(429).json({
      error: "Too Many Requests",
      message: "You have exceeded the rate limit. Please wait 15 minutes before making another request."
    });
  }
});

const authLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  standardHeaders: true, // Return rate limit info in the RateLimit-* headers
  legacyHeaders: false, // Disable the X-RateLimit-* headers
  handler: (req, res, next) => {
    console.log(`Rate limit exceeded for IP ${req.ip}`);
    res.status(429).json({
      error: "Too Many Requests",
      message: "You have exceeded the rate limit. Please wait 15 minutes before making another request."
    });
  }
});

const frontendURL = config.get("FRONTEND_URL");
app.use(cors({
  origin: frontendURL, // Frontend URL
  credentials: true // Allow cookies to be sent and received
}));

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
});

app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "default-src 'self'");
  next();
});


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use("/auth", authLimiter, authRoutes);
app.use("/forms",limiter, formRoutes)
app.use('/', limiter,indexRouter);
app.use("/admin", adminRoutes);
app.use("/user",limiter, userRoutes);
app.use("/wishlist", limiter, wishlistRoutes);
app.use("/cart", limiter, cartRoutes);
app.use("/orders", limiter,orderRoutes)

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


app.listen(3000);


module.exports = app;
