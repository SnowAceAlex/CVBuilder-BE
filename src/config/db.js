import mongoose from 'mongoose';
import dns from 'dns';

// Fix for Node.js MongoDB SRV resolution issues (ECONNREFUSED) on some network setups
dns.setServers(['8.8.8.8', '8.8.4.4']);

const connectDB = async () => {
  const uri = process.env.MONGO_URI || process.env.DATABASE_URL;
  if (!uri || typeof uri !== 'string') {
    console.error(
      'Missing MongoDB connection string. Set MONGO_URI (or DATABASE_URL) in your environment — e.g. in Render: Environment → add MONGO_URI with your Atlas/hosted Mongo URL.',
    );
    process.exit(1);
  }
  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

export default connectDB;
