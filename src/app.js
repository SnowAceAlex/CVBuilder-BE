import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import cookieParser from 'cookie-parser';
import swaggerSpec from '../swagger.js';
import authRoutes from './routes/auth.routes.js';
import cvRoutes from './routes/cv.routes.js';
import passport from './config/passport.js';

const app = express();

app.set('trust proxy', 1);

// Security & parsing
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Passport
app.use(passport.initialize());

// Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cv', cvRoutes);

// Health check
app.get('/', (req, res) => res.json({ status: 'CVBuilder API is running' }));

// Global error handler
app.use((err, req, res, _next) => {
  const status = err.status || 500;
  res
    .status(status)
    .json({ success: false, message: err.message || 'Server Error' });
});

export default app;
