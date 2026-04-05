import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import {
  getTemplateById,
  getTemplates,
} from '../controllers/template.controller.js';
import {
  validateTemplateIdParam,
  validateTemplateListQuery,
} from '../validations/template.validation.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Templates
 *     description: CV templates for template-first CV creation
 */

/**
 * @swagger
 * /api/templates:
 *   get:
 *     summary: List active CV templates
 *     tags: [Templates]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 12
 *     responses:
 *       200:
 *         description: Active template list
 *       400:
 *         description: Validation error
 */
router.get('/', protect, validateTemplateListQuery, getTemplates);

/**
 * @swagger
 * /api/templates/{id}:
 *   get:
 *     summary: Get active template details by ID
 *     tags: [Templates]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Template ID
 *     responses:
 *       200:
 *         description: Template details
 *       400:
 *         description: Validation error
 *       404:
 *         description: Template not found
 */
router.get('/:id', protect, validateTemplateIdParam, getTemplateById);

export default router;
