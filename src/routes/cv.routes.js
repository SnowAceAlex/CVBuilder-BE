import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import {
  createCV,
  getAllCVs,
  getCVById,
  updateCV,
  deleteCV,
} from '../controllers/cv.controller.js';
import {
  createCVSchema,
  updateCVSchema,
  validate,
} from '../validations/cv.validation.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: CV
 *   description: CV management endpoints
 */

/**
 * @swagger
 * /api/cv:
 *   post:
 *     summary: Create a new CV
 *     tags: [CV]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cvTitle
 *             properties:
 *               cvTitle:
 *                 type: string
 *                 example: My Professional CV
 *               templateId:
 *                 type: string
 *                 example: 60d5ec49f1b2c72b9c8e4d3a
 *               status:
 *                 type: string
 *                 enum: [draft, completed, published]
 *                 default: draft
 *               personalInfo:
 *                 type: object
 *                 properties:
 *                   fullName:
 *                     type: string
 *                   email:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   address:
 *                     type: string
 *                   jobTitle:
 *                     type: string
 *                   summary:
 *                     type: string
 *               educations:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     schoolName:
 *                       type: string
 *                     major:
 *                       type: string
 *                     startDate:
 *                       type: string
 *                       format: date-time
 *                     endDate:
 *                       type: string
 *                       format: date-time
 *                     description:
 *                       type: string
 *               experiences:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     companyName:
 *                       type: string
 *                     position:
 *                       type: string
 *                     startDate:
 *                       type: string
 *                       format: date-time
 *                     endDate:
 *                       type: string
 *                       format: date-time
 *                     description:
 *                       type: string
 *               skills:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     skillName:
 *                       type: string
 *                     level:
 *                       type: string
 *                       enum: [Beginner, Intermediate, Advanced, Expert]
 *               projects:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     projectName:
 *                       type: string
 *                     description:
 *                       type: string
 *                     url:
 *                       type: string
 *                     startDate:
 *                       type: string
 *                       format: date-time
 *                     endDate:
 *                       type: string
 *                       format: date-time
 *               certifications:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     issuer:
 *                       type: string
 *                     issueDate:
 *                       type: string
 *                       format: date-time
 *                     expiryDate:
 *                       type: string
 *                       format: date-time
 *                     url:
 *                       type: string
 *     responses:
 *       201:
 *         description: CV created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authorized
 */
router.post('/', protect, validate(createCVSchema), createCV);

/**
 * @swagger
 * /api/cv:
 *   get:
 *     summary: Get all CVs for the authenticated user
 *     tags: [CV]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's CVs
 *       401:
 *         description: Not authorized
 */
router.get('/', protect, getAllCVs);

/**
 * @swagger
 * /api/cv/{id}:
 *   get:
 *     summary: Get a specific CV by ID
 *     tags: [CV]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The CV ID
 *     responses:
 *       200:
 *         description: CV details
 *       401:
 *         description: Not authorized
 *       404:
 *         description: CV not found
 */
router.get('/:id', protect, getCVById);

/**
 * @swagger
 * /api/cv/{id}:
 *   put:
 *     summary: Update a CV
 *     tags: [CV]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The CV ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cvTitle:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [draft, completed, published]
 *               personalInfo:
 *                 type: object
 *               educations:
 *                 type: array
 *               experiences:
 *                 type: array
 *               skills:
 *                 type: array
 *               projects:
 *                 type: array
 *               certifications:
 *                 type: array
 *     responses:
 *       200:
 *         description: CV updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authorized
 *       404:
 *         description: CV not found
 */
router.put('/:id', protect, validate(updateCVSchema), updateCV);

/**
 * @swagger
 * /api/cv/{id}:
 *   delete:
 *     summary: Delete a CV
 *     tags: [CV]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The CV ID
 *     responses:
 *       200:
 *         description: CV deleted successfully
 *       401:
 *         description: Not authorized
 *       404:
 *         description: CV not found
 */
router.delete('/:id', protect, deleteCV);

export default router;
