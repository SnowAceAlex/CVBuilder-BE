import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';

// Import all models
import { User, CV, Template, AiLog, Subscription } from '../models/index.js';

dotenv.config();

const seedDummyData = async () => {
  try {
    console.log('Connecting to database...');
    await connectDB();
    console.log(
      '\nSeeding dummy data so database visualizers can infer the schema/attributes...',
    );

    // 1. Seed dummy User (if not exist)
    const dummyUser = await User.findOneAndUpdate(
      { email: 'dummy@example.com' },
      {
        firstName: 'Dummy',
        lastName: 'User',
        password: 'dummypassword123', // Just a dummy string
        role: 'user',
        aiUsageCount: 0,
      },
      { upsert: true, new: true },
    );

    console.log('Dummy User inserted.');

    // 2. Seed dummy CV
    await CV.findOneAndUpdate(
      { userId: dummyUser._id },
      {
        cvName: 'Dummy CV',
        templateId: new mongoose.Types.ObjectId(), // Fake ID just for structure
        personalInfo: {
          firstName: 'Dummy',
          lastName: 'User',
          email: 'dummy@example.com',
        },
        experience: [],
        education: [],
        skills: [],
      },
      { upsert: true },
    );
    console.log('Dummy CV inserted.');

    // 3. Seed dummy Template
    await Template.findOneAndUpdate(
      { name: 'Dummy Template' },
      {
        description: 'A mock template for database schema inference',
        thumbnailUrl: 'https://example.com/dummy.png',
        htmlStructure: '<div>Dummy</div>',
        cssStyles: '.dummy {}',
        isPremium: false,
      },
      { upsert: true },
    );
    console.log('Dummy Template inserted.');

    // 4. Seed dummy AiLog
    await AiLog.findOneAndUpdate(
      { userId: dummyUser._id },
      {
        actionType: 'generate_summary',
        promptUsed: 'Write a dummy summary',
        responseReceived: 'This is a dummy summary.',
        tokensUsed: 10,
      },
      { upsert: true },
    );
    console.log('Dummy AiLog inserted.');

    // 5. Seed dummy Subscription
    await Subscription.findOneAndUpdate(
      { userId: dummyUser._id },
      {
        plan: 'free',
        status: 'active',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(),
      },
      { upsert: true },
    );
    console.log('Dummy Subscription inserted.');

    console.log(
      '\nDummy data seeded successfully! You should now be able to see the attributes in your MongoDB visualizer.',
    );
    process.exit(0);
  } catch (error) {
    console.error('\nError seeding data:', error);
    process.exit(1);
  }
};

seedDummyData();
