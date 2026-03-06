import mongoose from 'mongoose';
import dns from 'dns';

// Fix for Node.js MongoDB SRV resolution issues (ECONNREFUSED) on some network setups
dns.setServers(['8.8.8.8', '8.8.4.4']);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

export default connectDB;
