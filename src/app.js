require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const { clerkMiddleware } = require('@clerk/express');
const swaggerSpec = require('../swagger');

const app = express();

app.set('trust proxy', 1);

// Webhook route MUST come before express.json() — needs raw body
app.use('/api/webhooks', require('./routes/webhook.routes'));

// Security & parsing
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Clerk auth context on every request
app.use(clerkMiddleware());

// Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/cv', require('./routes/cv.routes'));

// Health check
app.get('/', (req, res) => res.json({ status: 'CVBuilder API is running' }));

// Global error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res
    .status(status)
    .json({ success: false, message: err.message || 'Server Error' });
});

module.exports = app;
