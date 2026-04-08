import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import { validate } from '../validations/cv.validation.js';
import { aiSuggestionSchema } from '../validations/ai.validation.js';
import { getSuggestion } from '../controllers/ai.controller.js';

const router = express.Router();

/**
 * @swagger
 * /api/ai/suggest:
 *   post:
 *     summary: Generate an AI suggestion for a CV section
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - section
 *               - draftText
 *             properties:
 *               section:
 *                 type: string
 *                 example: "experiences"
 *               draftText:
 *                 type: string
 *                 example: "Final-year Computer Science student with hands-on experience in Node.js..."
 *               tone:
 *                 type: string
 *                 example: "professional"
 *     responses:
 *       200:
 *         description: Suggestion generated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authorized
 *       500:
 *         description: AI Service error
 */
router.post('/suggest', protect, validate(aiSuggestionSchema), getSuggestion);

export default router;
