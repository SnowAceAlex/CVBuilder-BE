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
  getProfile,
  updateProfile,
  addExperience,
  updateExperience,
  deleteExperience,
  addEducation,
  updateEducation,
  deleteEducation,
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
 *                 format: email
 *                 example: jane.doe@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: StrongPass123!
 *               fullName:
 *                 type: string
 *                 example: Jane Doe
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Validation error or email already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
 *                 format: email
 *                 example: jane.doe@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: StrongPass123!
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Missing email or password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Invalid credentials
 */
router.post('/login', login);

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh access token (reads httpOnly cookie `refreshToken`)
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RefreshResponse'
 *       401:
 *         description: Missing or invalid refresh token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/refresh', refresh);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user (clears refreshToken cookie)
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: User logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessMessage'
 *             example:
 *               success: true
 *               message: Logged out successfully
 */
router.post('/logout', logout);

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Get current authenticated user's profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       Returns the authenticated user's profile. Optional scalar fields that are
 *       empty will be returned as the string `"Not provided"`. Empty arrays
 *       (`experiences`, `educations`) are returned as `[]`.
 *     responses:
 *       200:
 *         description: Current user's profile
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *   put:
 *     summary: Update current authenticated user's profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: Jane Doe
 *               phone:
 *                 type: string
 *                 example: "+84 912 345 678"
 *               address:
 *                 type: string
 *                 example: Ho Chi Minh City, Vietnam
 *               jobTitle:
 *                 type: string
 *                 example: Full-stack Developer
 *               summary:
 *                 type: string
 *                 example: Short bio about the user.
 *               website:
 *                 type: string
 *                 example: https://janedoe.dev
 *               birthday:
 *                 type: string
 *                 format: date
 *                 example: "1998-07-21"
 *               gender:
 *                 type: string
 *                 enum: [Male, Female, Other, Prefer not to say]
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

/**
 * @swagger
 * /api/auth/profile/experiences:
 *   post:
 *     summary: Add a new experience entry
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [companyName, position]
 *             properties:
 *               companyName: { type: string, example: Acme Corp }
 *               position: { type: string, example: Software Engineer }
 *               startDate: { type: string, format: date, example: "2023-01-01" }
 *               endDate: { type: string, format: date, example: "2024-06-01" }
 *     responses:
 *       201:
 *         description: Experience added successfully
 *       400:
 *         description: Validation error
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.post('/profile/experiences', protect, addExperience);

/**
 * @swagger
 * /api/auth/profile/experiences/{id}:
 *   put:
 *     summary: Update an experience entry by id
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyName: { type: string }
 *               position: { type: string }
 *               startDate: { type: string, format: date }
 *               endDate: { type: string, format: date }
 *     responses:
 *       200:
 *         description: Experience updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Experience not found
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *   delete:
 *     summary: Delete an experience entry by id
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Experience deleted successfully
 *       404:
 *         description: Experience not found
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.put('/profile/experiences/:id', protect, updateExperience);
router.delete('/profile/experiences/:id', protect, deleteExperience);

/**
 * @swagger
 * /api/auth/profile/educations:
 *   post:
 *     summary: Add a new education entry
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [schoolName]
 *             properties:
 *               schoolName: { type: string, example: HCMUT }
 *               major: { type: string, example: Computer Science }
 *               startDate: { type: string, format: date, example: "2018-09-01" }
 *               endDate: { type: string, format: date, example: "2022-06-01" }
 *     responses:
 *       201:
 *         description: Education added successfully
 *       400:
 *         description: Validation error
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.post('/profile/educations', protect, addEducation);

/**
 * @swagger
 * /api/auth/profile/educations/{id}:
 *   put:
 *     summary: Update an education entry by id
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               schoolName: { type: string }
 *               major: { type: string }
 *               startDate: { type: string, format: date }
 *               endDate: { type: string, format: date }
 *     responses:
 *       200:
 *         description: Education updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Education not found
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *   delete:
 *     summary: Delete an education entry by id
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Education deleted successfully
 *       404:
 *         description: Education not found
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.put('/profile/educations/:id', protect, updateEducation);
router.delete('/profile/educations/:id', protect, deleteEducation);

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
 *       On success, redirects to `${CLIENT_URL}/login-success` with an httpOnly `accessToken` cookie set.
 *     responses:
 *       302:
 *         description: Redirects to frontend login-success page
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
 *     summary: Start GitHub OAuth login
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirect user to GitHub OAuth page
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
 *     summary: GitHub OAuth callback
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       302:
 *         description: |
 *           Redirects to `${CLIENT_URL}/login-success?token=<JWT>`.
 *           The JWT is a 45-minute access token that the FE should store and send as `Authorization: Bearer <token>`.
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
