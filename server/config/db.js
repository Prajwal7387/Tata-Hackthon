import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const connUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/voiceedge';
    // set serverSelectionTimeoutMS to fail quickly if Mongo is not running
    const conn = await mongoose.connect(connUri, { serverSelectionTimeoutMS: 2000 });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    global.useMockDb = false;
  } catch (error) {
    console.warn(`\n[DATABASE WARNING] MongoDB connection failed: ${error.message}`);
    console.warn('[DATABASE WARNING] Falling back to In-Memory Mock Database for offline demonstration.\n');
    global.useMockDb = true;
  }
};

export default connectDB;
