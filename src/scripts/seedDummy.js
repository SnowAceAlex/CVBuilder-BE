import dotenv from 'dotenv';
import connectDB from '../config/db.js';

// Import all models
import { User, CV, Template, AiLog, Subscription } from '../models/index.js';

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
];

const templateSeedData = [
  {
    name: 'Professional Clean',
    thumbnailUrl: 'https://example.com/templates/professional-clean.png',
    category: 'professional',
    isActive: true,
    schemaVersion: 2,
    sections: defaultSections,
    layout: { sections: defaultSections },
    fieldConfig: [
      {
        sectionKey: 'personalInfo',
        fields: [
          {
            key: 'fullName',
            label: 'Full Name',
            placeholder: 'Nguyen Van A',
            required: true,
            defaultValue: 'Dummy User',
          },
          {
            key: 'email',
            label: 'Email',
            inputType: 'email',
            placeholder: 'name@example.com',
            required: true,
            defaultValue: 'dummy@example.com',
          },
          {
            key: 'jobTitle',
            label: 'Job Title',
            placeholder: 'Backend Developer',
            defaultValue: 'Backend Developer',
          },
          {
            key: 'summary',
            label: 'Summary',
            inputType: 'textarea',
            placeholder: 'Write a concise career summary...',
          },
        ],
      },
      {
        sectionKey: 'skills',
        fields: [
          { key: 'skillName', label: 'Skill', required: true },
          {
            key: 'level',
            label: 'Level',
            inputType: 'select',
            options: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
            defaultValue: 'Intermediate',
          },
        ],
      },
    ],
    renderMeta: {
      variant: 'clean',
      supportsPhoto: true,
      tokens: {
        primaryColor: '#1f2937',
        accentColor: '#0ea5e9',
      },
    },
  },
  {
    name: 'Modern Focus',
    thumbnailUrl: 'https://example.com/templates/modern-focus.png',
    category: 'modern',
    isActive: true,
    schemaVersion: 2,
    sections: defaultSections,
    layout: { sections: defaultSections },
    fieldConfig: [
      {
        sectionKey: 'experiences',
        fields: [
          { key: 'companyName', label: 'Company', required: true },
          { key: 'position', label: 'Position', required: true },
          {
            key: 'description',
            label: 'Responsibilities',
            inputType: 'textarea',
            placeholder: 'Describe outcomes and impact...',
          },
        ],
      },
      {
        sectionKey: 'projects',
        fields: [
          { key: 'projectName', label: 'Project Name', required: true },
          {
            key: 'url',
            label: 'Project URL',
            inputType: 'url',
            placeholder: 'https://github.com/...',
          },
        ],
      },
    ],
    renderMeta: {
      variant: 'modern-grid',
      supportsPhoto: false,
      tokens: {
        primaryColor: '#111827',
        accentColor: '#6366f1',
      },
    },
  },
  {
    name: 'Minimal Academic',
    thumbnailUrl: 'https://example.com/templates/minimal-academic.png',
    category: 'academic',
    isActive: true,
    schemaVersion: 2,
    sections: defaultSections,
    layout: { sections: defaultSections },
    fieldConfig: [
      {
        sectionKey: 'educations',
        fields: [
          { key: 'schoolName', label: 'School', required: true },
          { key: 'major', label: 'Major' },
          { key: 'description', label: 'Achievements', inputType: 'textarea' },
        ],
      },
      {
        sectionKey: 'certifications',
        fields: [
          { key: 'name', label: 'Certification Name', required: true },
          { key: 'issuer', label: 'Issuer' },
          { key: 'url', label: 'Credential URL', inputType: 'url' },
        ],
      },
    ],
    renderMeta: {
      variant: 'minimal',
      supportsPhoto: false,
      tokens: {
        primaryColor: '#111111',
        accentColor: '#374151',
      },
    },
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

    // 2. Seed templates (at least 3 active defaults)
    const seededTemplates = [];
    for (const templatePayload of templateSeedData) {
      const template = await Template.findOneAndUpdate(
        { name: templatePayload.name },
        templatePayload,
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
          runValidators: true,
        },
      );
      seededTemplates.push(template);
    }

    console.log(`Seeded ${seededTemplates.length} templates.`);

    // 3. Seed dummy CV
    const selectedTemplate = seededTemplates[0];
    await CV.findOneAndUpdate(
      { userId: dummyUser._id },
      {
        cvTitle: 'Dummy CV',
        templateId: selectedTemplate._id,
        status: 'draft',
        personalInfo: {
          fullName: 'Dummy User',
          email: 'dummy@example.com',
          jobTitle: 'Backend Developer',
        },
        educations: [],
        experiences: [],
        skills: [],
        projects: [],
        certifications: [],
        sections:
          selectedTemplate.layout?.sections?.length > 0
            ? selectedTemplate.layout.sections
            : selectedTemplate.sections,
        templateSnapshot: {
          templateId: selectedTemplate._id,
          name: selectedTemplate.name,
          category: selectedTemplate.category,
          thumbnailUrl: selectedTemplate.thumbnailUrl,
          schemaVersion: selectedTemplate.schemaVersion,
          layout: {
            sections:
              selectedTemplate.layout?.sections?.length > 0
                ? selectedTemplate.layout.sections
                : selectedTemplate.sections,
          },
          fieldConfig: selectedTemplate.fieldConfig,
          renderMeta: selectedTemplate.renderMeta,
        },
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

    // 5. Seed dummy Subscription
    await Subscription.findOneAndUpdate(
      { userId: dummyUser._id },
      {
        plan: 'free',
        status: 'active',
        aiRequestLimit: 5,
        startDate: new Date(),
        endDate: null,
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
