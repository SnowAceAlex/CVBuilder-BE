import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user data
 */
router.get('/me', protect, async (req, res) => {
  res.json({ success: true, message: 'Auth is working' });
});

export default router;
