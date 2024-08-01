const mongoose = require('mongoose');
const dotenv = require('dotenv');
// Load environment variables from .env file
dotenv.config();

const dbURI = process.env.MONGO_URI ;

// Connect to the MongoDB database
module.exports = mongoose.connect(dbURI);

// Connection success and error handling
mongoose.connection.on('connected', () => {
  console.log(`Mongoose connected`);
});

mongoose.connection.on('error', (err) => {
  console.log(err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});


