const mongoose = require('mongoose');
require('dotenv').config();


const dbURI = process.env.MONGO_URI;

const connectOptions = {
  maxIdleTimeMS: 10000, // Close connections after 10 seconds of inactivity
};

async function connectToDatabase() {
  try {
    await mongoose.connect(dbURI, connectOptions);
    console.log('Mongoose connected');
  } catch (error) {
    console.error('Mongoose connection error:', error);
  }
}

// Connection success and error handling
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

module.exports = connectToDatabase;




