import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CVBuilder API',
      version: '1.0.0',
      description: 'API documentation for CVBuilder backend',
    },
    servers: [
      { url: 'http://localhost:5000' },
      { url: 'https://cvbuilder-be-p5yh.onrender.com/' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
      schemas: {
        PersonalInfo: {
          type: 'object',
          properties: {
            fullName: { type: 'string' },
            email: { type: 'string' },
            phone: { type: 'string' },
            address: { type: 'string' },
            jobTitle: { type: 'string' },
            summary: { type: 'string' },
          },
        },
        Education: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            schoolName: { type: 'string' },
            major: { type: 'string' },
            startDate: { type: 'string', format: 'date-time' },
            endDate: { type: 'string', format: 'date-time' },
            description: { type: 'string' },
          },
        },
        Experience: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            companyName: { type: 'string' },
            position: { type: 'string' },
            startDate: { type: 'string', format: 'date-time' },
            endDate: { type: 'string', format: 'date-time' },
            description: { type: 'string' },
          },
        },
        Skill: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            skillName: { type: 'string' },
            level: {
              type: 'string',
              enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
            },
          },
        },
        Project: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            projectName: { type: 'string' },
            description: { type: 'string' },
            url: { type: 'string' },
            startDate: { type: 'string', format: 'date-time' },
            endDate: { type: 'string', format: 'date-time' },
          },
        },
        Certification: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            issuer: { type: 'string' },
            issueDate: { type: 'string', format: 'date-time' },
            expiryDate: { type: 'string', format: 'date-time' },
            url: { type: 'string' },
          },
        },
        Section: {
          type: 'object',
          properties: {
            sectionKey: { type: 'string' },
            displayName: { type: 'string' },
            order: { type: 'integer' },
            isVisible: { type: 'boolean' },
          },
        },
        Template: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            thumbnailUrl: { type: 'string' },
            category: { type: 'string' },
            sections: {
              type: 'array',
              items: { $ref: '#/components/schemas/Section' },
            },
          },
        },
        CV: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            cvTitle: { type: 'string' },
            templateId: {
              oneOf: [{ type: 'string' }, { $ref: '#/components/schemas/Template' }],
            },
            status: {
              type: 'string',
              enum: ['draft', 'completed', 'published'],
            },
            personalInfo: { $ref: '#/components/schemas/PersonalInfo' },
            educations: {
              type: 'array',
              items: { $ref: '#/components/schemas/Education' },
            },
            experiences: {
              type: 'array',
              items: { $ref: '#/components/schemas/Experience' },
            },
            skills: {
              type: 'array',
              items: { $ref: '#/components/schemas/Skill' },
            },
            projects: {
              type: 'array',
              items: { $ref: '#/components/schemas/Project' },
            },
            certifications: {
              type: 'array',
              items: { $ref: '#/components/schemas/Certification' },
            },
            sections: {
              type: 'array',
              items: { $ref: '#/components/schemas/Section' },
            },
            updatedAt: { type: 'string', format: 'date-time' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
          },
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: { type: 'object' },
          },
        },
        PaginatedResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            count: { type: 'integer' },
            data: { type: 'array', items: { type: 'object' } },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

export default swaggerJsdoc(options);
