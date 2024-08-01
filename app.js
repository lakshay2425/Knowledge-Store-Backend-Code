var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
var indexRouter = require('./routes/index');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const formRoutes = require("./routes/formRoutes");
const adminRoutes = require("./routes/adminRoutes");
var app = express();
// const mongoose = require("./config/mongoose");


app.use(cors({
  origin: 'http://localhost:4000', // Frontend URL
  credentials: true // Allow cookies to be sent and received
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use("/auth", authRoutes);
app.use("/forms", formRoutes)
app.use('/', indexRouter);
app.use("/admin", adminRoutes);

/* Checking Node environment value
console.log(process.env.NODE_ENV);

app.get("/", (req,res)=>{
  res.cookie("name", "Lakshay",{
    httpOnly: true,
    secure: false,
    maxAge: 5 * 60 * 60 * 1000,
    path: '/' // Ensure this path is correct
  });
  res.send("Hello");
})

app.get("/read", (req,res)=>{
  res.send(req.cookies.name);
})
*/


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
  res.render('error');
});


app.listen(3000);


module.exports = app;
