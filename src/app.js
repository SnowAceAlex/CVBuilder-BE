import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import { clerkMiddleware } from '@clerk/express';
import swaggerSpec from '../swagger.js';
import webhookRoutes from './routes/webhook.routes.js';
import authRoutes from './routes/auth.routes.js';
import cvRoutes from './routes/cv.routes.js';

const app = express();

app.set('trust proxy', 1);

// Webhook route MUST come before express.json() — needs raw body
app.use('/api/webhooks', webhookRoutes);

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
app.use('/api/auth', authRoutes);
app.use('/api/cv', cvRoutes);

// Health check
app.get('/', (req, res) => res.json({ status: 'CVBuilder API is running' }));

// Global error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res
    .status(status)
    .json({ success: false, message: err.message || 'Server Error' });
});

export default app;
