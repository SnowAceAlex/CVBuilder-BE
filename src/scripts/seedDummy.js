import dotenv from 'dotenv';
import connectDB from '../config/db.js';

// Import all models
import { User, CV, AiLog } from '../models/index.js';

dotenv.config();

const defaultSections = [
  {
    sectionKey: 'personalInfo',
    displayName: 'Personal Information',
    order: 0,
    isVisible: true,
  },
  {
    sectionKey: 'experiences',
    displayName: 'Experience',
    order: 1,
    isVisible: true,
  },
  {
    sectionKey: 'educations',
    displayName: 'Education',
    order: 2,
    isVisible: true,
  },
  {
    sectionKey: 'skills',
    displayName: 'Skills',
    order: 3,
    isVisible: true,
  },
  {
    sectionKey: 'projects',
    displayName: 'Projects',
    order: 4,
    isVisible: true,
  },
  {
    sectionKey: 'certifications',
    displayName: 'Certifications',
    order: 5,
    isVisible: true,
  },
  {
    sectionKey: 'languages',
    displayName: 'Languages',
    order: 6,
    isVisible: true,
  },
];

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
        cvTitle: 'Dummy CV',
        templateId: 'modern-focus',
        status: 'draft',
        personalInfo: {
          fullName: 'Dummy User',
          email: 'dummy@example.com',
          jobTitle: 'Backend Developer',
          socialLinks: [
            { platform: 'LinkedIn', url: 'https://linkedin.com/in/dummy' },
            { platform: 'GitHub', url: 'https://github.com/dummy' },
          ],
        },
        educations: [],
        experiences: [],
        skills: [],
        projects: [],
        certifications: [],
        languages: [],
        sections: defaultSections,
      },
      { upsert: true, runValidators: true },
    );
    console.log('Dummy CV inserted.');

    // 4. Seed dummy AiLog
    await AiLog.findOneAndUpdate(
      { userId: dummyUser._id, promptType: 'summary_generation' },
      {
        promptType: 'summary_generation',
        provider: 'gemini',
        inputText: 'Write a dummy summary',
        responseText: 'This is a dummy summary.',
        tokensUsed: 10,
      },
      { upsert: true },
    );
    console.log('Dummy AiLog inserted.');

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
