import express from 'express';
import passport from 'passport';
import { protect } from '../middlewares/auth.middleware.js';
import {
  generateAccessToken,
  generateRefreshToken,
} from '../utils/token.util.js';
import {
  register,
  login,
  refresh,
  logout,
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
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
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
 */
router.get('/me', protect, async (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

// OAuth Placeholders
//OAuth google
// router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
// router.get('/google/callback', passport.authenticate('google', { session: false }), (req, res) => { ... });

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

//OAuth github
router.get(
  '/github',
  passport.authenticate('github', { scope: ['user:email'] }),
);
router.get(
  '/github/callback',
  passport.authenticate('github', { session: false }),
  async (req, res, next) => {
    try {
      const userId = req.user?._id ?? req.user?.id;

      const accessToken = generateAccessToken(userId);
      const refreshToken = generateRefreshToken(userId);

      req.user.refreshToken = refreshToken;
      await req.user.save();

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      // Chuyển hướng người dùng về lại Frontend React, kẹp accessToken lên thanh địa chỉ
      res.redirect(
        `${process.env.CLIENT_URL}/login-success?token=${accessToken}`,
      );
    } catch (error) {
      next(error);
    }
  },
);

export default router;
