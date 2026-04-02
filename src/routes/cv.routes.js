import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import {
  createCV,
  getAllCVs,
  getCVById,
  updateCV,
  deleteCV,
  addEducation,
  addExperience,
  addSkill,
  editEducation,
  editExperience,
  editSkill,
  deleteEducation,
  deleteExperience,
  deleteSkill,
} from '../controllers/cv.controller.js';
import {
  createCVSchema,
  educationSchema,
  experienceSchema,
  skillSchema,
  educationUpdateSchema,
  experienceUpdateSchema,
  skillUpdateSchema,
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
 *                 example: Web Developer Fresher CV
 *               templateId:
 *                 type: string
 *                 example: 69aa83f4ccd97e2226dc4ebe
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
 *           example:
 *             cvTitle: Web Developer Fresher CV
 *             templateId: 69aa83f4ccd97e2226dc4ebe
 *             status: draft
 *             personalInfo:
 *               fullName: Jane Doe
 *               email: jane.doe@example.com
 *               phone: "0901234567"
 *               address: 123 Sample Street, Ho Chi Minh City
 *               jobTitle: Software Engineer
 *               summary: Building modern web applications with JavaScript, React, and Node.js
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
 *               templateId:
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
 *               sections:
 *                 type: array
 *           example:
 *             cvTitle: Web Developer Fresher CV
 *             templateId: 69aa83f4ccd97e2226dc4ebe
 *             status: draft
 *             personalInfo:
 *               fullName: Jane Doe
 *               email: jane.doe@example.com
 *               phone: "0901234567"
 *               address: 123 Sample Street, Ho Chi Minh City
 *               jobTitle: Software Engineer
 *               summary: Building modern web applications with JavaScript, React, and Node.js
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

/**
 * @swagger
 * /api/cv/{id}/educations:
 *   post:
 *     summary: Add an education entry to CV
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
 *               schoolName:
 *                 type: string
 *               major:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Education added successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authorized
 *       404:
 *         description: CV not found
 */
router.post(
  '/:id/educations',
  protect,
  validate(educationSchema),
  addEducation,
);

/**
 * @swagger
 * /api/cv/{id}/educations/{eduId}:
 *   put:
 *     summary: Update an education entry in CV
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
 *       - in: path
 *         name: eduId
 *         required: true
 *         schema:
 *           type: string
 *         description: The Education entry ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - schoolName
 *             properties:
 *               schoolName:
 *                 type: string
 *               major:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Education updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authorized
 *       404:
 *         description: CV or Education not found
 */
router.put(
  '/:id/educations/:eduId',
  protect,
  validate(educationUpdateSchema),
  editEducation,
);

/**
 * @swagger
 * /api/cv/{id}/educations/{eduId}:
 *   delete:
 *     summary: Delete an education entry from CV
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
 *       - in: path
 *         name: eduId
 *         required: true
 *         schema:
 *           type: string
 *         description: The Education entry ID
 *     responses:
 *       200:
 *         description: Education deleted successfully
 *       401:
 *         description: Not authorized
 *       404:
 *         description: CV or Education not found
 */
router.delete('/:id/educations/:eduId', protect, deleteEducation);

/**
 * @swagger
 * /api/cv/{id}/experiences:
 *   post:
 *     summary: Add an experience entry to CV
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
 *               companyName:
 *                 type: string
 *               position:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Experience added successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authorized
 *       404:
 *         description: CV not found
 */
router.post(
  '/:id/experiences',
  protect,
  validate(experienceSchema),
  addExperience,
);

/**
 * @swagger
 * /api/cv/{id}/experiences/{expId}:
 *   put:
 *     summary: Update an experience entry in CV
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
 *       - in: path
 *         name: expId
 *         required: true
 *         schema:
 *           type: string
 *         description: The Experience entry ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - companyName
 *               - position
 *             properties:
 *               companyName:
 *                 type: string
 *               position:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Experience updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authorized
 *       404:
 *         description: CV or Experience not found
 */
router.put(
  '/:id/experiences/:expId',
  protect,
  validate(experienceUpdateSchema),
  editExperience,
);

/**
 * @swagger
 * /api/cv/{id}/experiences/{expId}:
 *   delete:
 *     summary: Delete an experience entry from CV
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
 *       - in: path
 *         name: expId
 *         required: true
 *         schema:
 *           type: string
 *         description: The Experience entry ID
 *     responses:
 *       200:
 *         description: Experience deleted successfully
 *       401:
 *         description: Not authorized
 *       404:
 *         description: CV or Experience not found
 */
router.delete('/:id/experiences/:expId', protect, deleteExperience);

/**
 * @swagger
 * /api/cv/{id}/skills:
 *   post:
 *     summary: Add a skill entry to CV
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
 *               skillName:
 *                 type: string
 *               level:
 *                 type: string
 *                 enum: [Beginner, Intermediate, Advanced, Expert]
 *                 default: Intermediate
 *     responses:
 *       201:
 *         description: Skill added successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authorized
 *       404:
 *         description: CV not found
 */
router.post('/:id/skills', protect, validate(skillSchema), addSkill);

/**
 * @swagger
 * /api/cv/{id}/skills/{skillId}:
 *   put:
 *     summary: Update a skill entry in CV
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
 *       - in: path
 *         name: skillId
 *         required: true
 *         schema:
 *           type: string
 *         description: The Skill entry ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - skillName
 *             properties:
 *               skillName:
 *                 type: string
 *               level:
 *                 type: string
 *                 enum: [Beginner, Intermediate, Advanced, Expert]
 *                 default: Intermediate
 *     responses:
 *       200:
 *         description: Skill updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authorized
 *       404:
 *         description: CV or Skill not found
 */
router.put(
  '/:id/skills/:skillId',
  protect,
  validate(skillUpdateSchema),
  editSkill,
);

/**
 * @swagger
 * /api/cv/{id}/skills/{skillId}:
 *   delete:
 *     summary: Delete a skill entry from CV
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
 *       - in: path
 *         name: skillId
 *         required: true
 *         schema:
 *           type: string
 *         description: The Skill entry ID
 *     responses:
 *       200:
 *         description: Skill deleted successfully
 *       401:
 *         description: Not authorized
 *       404:
 *         description: CV or Skill not found
 */
router.delete('/:id/skills/:skillId', protect, deleteSkill);

export default router;
