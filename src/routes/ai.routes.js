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
 *               cvId:
 *                 type: string
 *                 description: Optional CV id, used for logging the AI request
 *                 example: "69e6f4cfa2458e5c375ead20"
 *     responses:
 *       200:
 *         description: Suggestion generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AISuggestionResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         description: AI Service error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       503:
 *         description: AI provider not configured or API key invalid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/suggest', protect, validate(aiSuggestionSchema), getSuggestion);

export default router;
