import dotenv from 'dotenv';
import connectDB from '../config/db.js';

// Import all models
import { User, CV, AiLog, Subscription } from '../models/index.js';

// Load environment variables
dotenv.config();

const syncModels = async () => {
  try {
    console.log('Connecting to database...');
    // The connectDB function inside config/db.js already grabs MONGO_URI from process.env
    await connectDB();

    console.log('\nUploading models to MongoDB...');

    const models = [
      { name: 'User', model: User },
      { name: 'CV', model: CV },
      { name: 'AiLog', model: AiLog },
      { name: 'Subscription', model: Subscription },
    ];

    for (const { name, model } of models) {
      // Create collection explicitly (if it doesn't already exist)
      await model.createCollection();
      console.log(`- ${name} collection created/verified`);

      // Sync indexes based on schema definitions
      await model.syncIndexes();
      console.log(`  > ${name} indexes synced`);
    }

    console.log('\nAll models uploaded and indexes synced successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\nError uploading models:', error);
    process.exit(1);
  }
};

syncModels();
