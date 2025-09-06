import  mongoose from 'mongoose'
import { config } from "./config.js";

const dbURI = config.get("MONGO_ATLAS_URI");


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


mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

export default connectToDatabase;



