const mongoose = require('mongoose');
const dotenv = require('dotenv');
const debuglog = require("debug")("development:mongooseConfig");
// Load environment variables from .env file
dotenv.config();

const dbURI = process.env.MONGO_URI ;

// Connect to the MongoDB database
module.exports = mongoose.connect(dbURI);

// Connection success and error handling
mongoose.connection.on('connected', () => {
  debuglog(`Mongoose connected`);
});

mongoose.connection.on('error', (err) => {
  debuglog(err);
});

mongoose.connection.on('disconnected', () => {
  debuglog('Mongoose disconnected');
});


