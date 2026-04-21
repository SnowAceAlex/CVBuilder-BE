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
    },
  },
  apis: ['./src/routes/*.js'],
};

export default swaggerJsdoc(options);
