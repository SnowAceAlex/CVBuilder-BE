import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

/**
 * @swagger
 * /api/cv:
 *   get:
 *     summary: Get all CVs for current user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of CVs
 */
router.get('/', protect, async (req, res) => {
  res.json({ success: true, message: 'CV routes working' });
});

export default router;
