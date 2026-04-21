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
        // ── Generic envelopes ──────────────────────────────────────────────
        SuccessMessage: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Operation completed successfully' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Something went wrong' },
          },
        },
        ValidationErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Validation failed' },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string', example: 'email' },
                  message: { type: 'string', example: 'email must be a valid email' },
                },
              },
            },
          },
        },
        AuthErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            code: {
              type: 'string',
              enum: [
                'NO_TOKEN',
                'TOKEN_EXPIRED',
                'TOKEN_INVALID',
                'USER_NOT_FOUND',
                'AUTH_ERROR',
              ],
              example: 'TOKEN_EXPIRED',
            },
            message: {
              type: 'string',
              example: 'Access token has expired, please refresh',
            },
            expiredAt: {
              type: 'string',
              format: 'date-time',
              nullable: true,
              description: 'Only present when code = TOKEN_EXPIRED',
              example: '2026-04-21T12:39:34.000Z',
            },
          },
        },

        // ── User / Auth ────────────────────────────────────────────────────
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '69e6f4cfa2458e5c375ead1f' },
            id: { type: 'string', example: '69e6f4cfa2458e5c375ead1f' },
            email: { type: 'string', format: 'email', example: 'jane.doe@example.com' },
            fullName: { type: 'string', example: 'Jane Doe' },
            role: { type: 'string', enum: ['user', 'admin'], example: 'user' },
            phone: { type: 'string', nullable: true, example: '0901234567' },
            address: { type: 'string', nullable: true, example: 'Ho Chi Minh City' },
            jobTitle: { type: 'string', nullable: true, example: 'Software Engineer' },
            summary: { type: 'string', nullable: true },
            googleId: { type: 'string', nullable: true, example: null },
            githubId: { type: 'string', nullable: true, example: null },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            accessToken: {
              type: 'string',
              description: 'JWT access token (valid 45 minutes)',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
            user: {
              type: 'object',
              properties: {
                id: { type: 'string', example: '69e6f4cfa2458e5c375ead1f' },
                email: { type: 'string', format: 'email', example: 'jane.doe@example.com' },
                fullName: { type: 'string', example: 'Jane Doe' },
              },
            },
          },
        },
        RefreshResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            accessToken: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
          },
        },
        MeResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            user: { $ref: '#/components/schemas/User' },
          },
        },

        // ── CV nested pieces ───────────────────────────────────────────────
        SocialLink: {
          type: 'object',
          required: ['platform', 'url'],
          properties: {
            _id: { type: 'string', example: '69aa83f4ccd97e2226dc4ec1' },
            platform: { type: 'string', example: 'LinkedIn' },
            url: { type: 'string', example: 'https://linkedin.com/in/janedoe' },
          },
        },
        PersonalInfo: {
          type: 'object',
          properties: {
            fullName: { type: 'string', example: 'Jane Doe' },
            email: { type: 'string', format: 'email', example: 'jane.doe@example.com' },
            phone: { type: 'string', example: '0901234567' },
            address: { type: 'string', example: '123 Sample Street, Ho Chi Minh City' },
            jobTitle: { type: 'string', example: 'Software Engineer' },
            summary: { type: 'string' },
            avatarUrl: { type: 'string', nullable: true },
            avatarPublicId: { type: 'string', nullable: true },
            socialLinks: {
              type: 'array',
              items: { $ref: '#/components/schemas/SocialLink' },
            },
          },
        },
        Education: {
          type: 'object',
          required: ['schoolName'],
          properties: {
            _id: { type: 'string', example: '69aa83f4ccd97e2226dc4ec2' },
            schoolName: { type: 'string', example: 'University of Technology' },
            major: { type: 'string', example: 'Computer Science' },
            startDate: { type: 'string', format: 'date-time', nullable: true },
            endDate: { type: 'string', format: 'date-time', nullable: true },
            description: { type: 'string', nullable: true },
          },
        },
        Experience: {
          type: 'object',
          required: ['companyName', 'position'],
          properties: {
            _id: { type: 'string', example: '69aa83f4ccd97e2226dc4ec3' },
            companyName: { type: 'string', example: 'Acme Corp' },
            position: { type: 'string', example: 'Full-stack Developer' },
            startDate: { type: 'string', format: 'date-time', nullable: true },
            endDate: { type: 'string', format: 'date-time', nullable: true },
            description: { type: 'string', nullable: true },
          },
        },
        Skill: {
          type: 'object',
          required: ['skillName'],
          properties: {
            _id: { type: 'string', example: '69aa83f4ccd97e2226dc4ec4' },
            skillName: { type: 'string', example: 'JavaScript' },
            level: {
              type: 'string',
              enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
              example: 'Advanced',
            },
          },
        },
        Project: {
          type: 'object',
          required: ['projectName'],
          properties: {
            _id: { type: 'string', example: '69aa83f4ccd97e2226dc4ec5' },
            projectName: { type: 'string', example: 'Portfolio Site' },
            description: { type: 'string', nullable: true },
            url: { type: 'string', nullable: true, example: 'https://portfolio.example.com' },
            startDate: { type: 'string', format: 'date-time', nullable: true },
            endDate: { type: 'string', format: 'date-time', nullable: true },
          },
        },
        Certification: {
          type: 'object',
          required: ['name'],
          properties: {
            _id: { type: 'string', example: '69aa83f4ccd97e2226dc4ec6' },
            name: { type: 'string', example: 'AWS Certified Developer' },
            issuer: { type: 'string', example: 'Amazon Web Services' },
            issueDate: { type: 'string', format: 'date-time', nullable: true },
            expiryDate: { type: 'string', format: 'date-time', nullable: true },
            url: { type: 'string', nullable: true },
          },
        },
        Language: {
          type: 'object',
          required: ['languageName'],
          properties: {
            _id: { type: 'string', example: '69aa83f4ccd97e2226dc4ec7' },
            languageName: { type: 'string', example: 'English' },
            level: { type: 'string', example: 'Native' },
          },
        },
        Section: {
          type: 'object',
          required: ['sectionKey', 'displayName', 'order'],
          properties: {
            sectionKey: {
              type: 'string',
              enum: [
                'personalInfo',
                'educations',
                'experiences',
                'skills',
                'projects',
                'certifications',
                'languages',
              ],
              example: 'experiences',
            },
            displayName: { type: 'string', example: 'Work Experience' },
            order: { type: 'integer', example: 2 },
            isVisible: { type: 'boolean', example: true },
          },
        },

        // ── CV (full document) ─────────────────────────────────────────────
        CV: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '69e6f4cfa2458e5c375ead20' },
            userId: { type: 'string', example: '69e6f4cfa2458e5c375ead1f' },
            templateId: { type: 'string', example: '69aa83f4ccd97e2226dc4ebe' },
            cvTitle: { type: 'string', example: 'Web Developer Fresher CV' },
            status: {
              type: 'string',
              enum: ['draft', 'completed', 'published'],
              example: 'draft',
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
            languages: {
              type: 'array',
              items: { $ref: '#/components/schemas/Language' },
            },
            sections: {
              type: 'array',
              items: { $ref: '#/components/schemas/Section' },
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },

        // ── CV response envelopes ──────────────────────────────────────────
        CVResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: { $ref: '#/components/schemas/CV' },
          },
        },
        CVListResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            count: { type: 'integer', example: 2 },
            data: {
              type: 'array',
              items: { $ref: '#/components/schemas/CV' },
            },
          },
        },
        PersonalInfoResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: { $ref: '#/components/schemas/PersonalInfo' },
          },
        },
        EducationResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: { $ref: '#/components/schemas/Education' },
          },
        },
        ExperienceResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: { $ref: '#/components/schemas/Experience' },
          },
        },
        SkillResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: { $ref: '#/components/schemas/Skill' },
          },
        },
        ProjectResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: { $ref: '#/components/schemas/Project' },
          },
        },
        CertificationResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: { $ref: '#/components/schemas/Certification' },
          },
        },
        LanguageResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: { $ref: '#/components/schemas/Language' },
          },
        },
        SectionsResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: {
              type: 'array',
              items: { $ref: '#/components/schemas/Section' },
            },
          },
        },

        // ── AI ────────────────────────────────────────────────────────────
        AISuggestionResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: {
              type: 'object',
              properties: {
                suggestion: {
                  type: 'string',
                  example:
                    'Results-driven software engineer with 3+ years of experience building scalable web applications...',
                },
              },
            },
          },
        },
      },
      responses: {
        Unauthorized: {
          description: 'Not authorized (missing / expired / invalid token)',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/AuthErrorResponse' },
              examples: {
                TokenExpired: {
                  summary: 'Access token expired',
                  value: {
                    success: false,
                    code: 'TOKEN_EXPIRED',
                    message: 'Access token has expired, please refresh',
                    expiredAt: '2026-04-21T12:39:34.000Z',
                  },
                },
                NoToken: {
                  summary: 'No Authorization header',
                  value: {
                    success: false,
                    code: 'NO_TOKEN',
                    message: 'Not authorized, no access token provided',
                  },
                },
                TokenInvalid: {
                  summary: 'Invalid signature / malformed',
                  value: {
                    success: false,
                    code: 'TOKEN_INVALID',
                    message: 'Invalid access token',
                  },
                },
              },
            },
          },
        },
        NotFound: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
              example: { success: false, message: 'CV not found' },
            },
          },
        },
        BadRequest: {
          description: 'Validation error',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ValidationErrorResponse' },
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

export default swaggerJsdoc(options);
