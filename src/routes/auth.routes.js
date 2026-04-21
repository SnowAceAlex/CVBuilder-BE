import express from 'express';
import passport from 'passport';
import { protect } from '../middlewares/auth.middleware.js';
import {
  register,
  login,
  refresh,
  logout,
  googleCallback,
  githubCallback,
} from '../controllers/auth.controller.js';

const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - fullName
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               fullName:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *             example:
 *               success: true
 *               accessToken: "eyJhbGciOiJIUzI1Ni..."
 *               user:
 *                 id: "65f1a2b3c4d5e6f7a8b9c0d1"
 *                 email: "jane.doe@example.com"
 *                 firstName: "Jane"
 *                 lastName: "Doe"
 *       400:
 *         $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/register', register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/login', login);

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *       401:
 *         $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/refresh', refresh);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: User logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               success: true
 *               message: "Logged out successfully"
 */
router.post('/logout', logout);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current authenticated user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user data
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 */
router.get('/me', protect, async (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

// OAuth Placeholders
/**
 * @swagger
 * /api/auth/google:
 *   get:
 *     summary: Initiate Google OAuth login
 *     tags: [Auth]
 *     description: Redirects the user to Google for authentication.
 *     responses:
 *       302:
 *         description: Redirects to Google OAuth consent screen
 */
//OAuth google
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
    prompt: 'select_account',
  }),
);

/**
 * @swagger
 * /api/auth/google/callback:
 *   get:
 *     summary: Google OAuth callback
 *     tags: [Auth]
 *     description: |
 *       Handles the callback from Google after user authentication.
 *       On success, redirects to the frontend with a JWT access token in the `token` query parameter.
 *     responses:
 *       302:
 *         description: Redirects to frontend with JWT access token
 */
router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/login?error=google_failed`,
  }),
  googleCallback,
);

/**
 * @swagger
 * /api/auth/github:
 *   get:
 *     summary: Start github login
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirect user to github o-auth page
 */
//OAuth github
router.get(
  '/github',
  passport.authenticate('github', {
    scope: ['user:email'],
    session: false,
  }),
);

/**
 * @swagger
 * /api/auth/github/callback:
 *   get:
 *     summary: callback process after gitHub oauth
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Return user information
 *       302:
 *         description: Redirect to Frontend
 */

router.get(
  '/github/callback',
  passport.authenticate('github', {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/login?error=github_failed`,
  }),
  githubCallback,
);

export default router;
