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
  updatePersonalInfo,
  addProject,
  editProject,
  deleteProject,
  addCertification,
  editCertification,
  deleteCertification,
  addLanguage,
  editLanguage,
  deleteLanguage,
  updateSections,
  uploadCVAvatar,
  deleteCVAvatar,
} from '../controllers/cv.controller.js';
import { uploadSingle } from '../middlewares/upload.middleware.js';
import {
  createCVSchema,
  educationSchema,
  experienceSchema,
  skillSchema,
  educationUpdateSchema,
  experienceUpdateSchema,
  skillUpdateSchema,
  updateCVSchema,
  personalInfoUpdateSchema,
  projectSchema,
  projectUpdateSchema,
  certificationSchema,
  certificationUpdateSchema,
  languageSchema,
  languageUpdateSchema,
  sectionsUpdateSchema,
  validate,
} from '../validations/cv.validation.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: CV
 *     description: Core CV management (CRUD)
 *   - name: Personal Info
 *     description: CV Personal Information section
 *   - name: Avatar
 *     description: CV Avatar image upload and management
 *   - name: Educations
 *     description: CV Educations section
 *   - name: Experiences
 *     description: CV Experiences section
 *   - name: Skills
 *     description: CV Skills section
 *   - name: Projects
 *     description: CV Projects section
 *   - name: Certifications
 *     description: CV Certifications section
 *   - name: Languages
 *     description: CV Languages section
 *   - name: Sections
 *     description: CV Sections ordering and visibility
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
 *               - templateId
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
 *                   socialLinks:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         platform:
 *                           type: string
 *                         url:
 *                           type: string
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
 *               languages:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     languageName:
 *                       type: string
 *                     level:
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
 *               socialLinks:
 *                 - platform: LinkedIn
 *                   url: https://linkedin.com/in/janedoe
 *                 - platform: GitHub
 *                   url: https://github.com/janedoe
 *             languages:
 *               - languageName: English
 *                 level: Native
 *               - languageName: Spanish
 *                 level: Intermediate
 *     responses:
 *       201:
 *         description: CV created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/CV'
 *             example:
 *               success: true
 *               data:
 *                 _id: "65f1a2b3c4d5e6f7a8b9c0d1"
 *                 cvTitle: "Web Developer Fresher CV"
 *                 status: "draft"
 *                 personalInfo:
 *                   fullName: "Jane Doe"
 *                   email: "jane.doe@example.com"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "\"cvTitle\" is required"
 *       401:
 *         description: Not authorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Not authorized to access this route"
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
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/PaginatedResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/CV'
 *             example:
 *               success: true
 *               count: 1
 *               data:
 *                 - _id: "65f1a2b3c4d5e6f7a8b9c0d1"
 *                   cvTitle: "Web Developer CV"
 *                   templateId:
 *                     _id: "65f1a2b3c4d5e6f7a8b9c0d2"
 *                     name: "Modern Professional"
 *                     category: "professional"
 *                     thumbnailUrl: "/templates/modern.png"
 *                   status: "draft"
 *                   updatedAt: "2024-03-13T10:00:00Z"
 *       401:
 *         description: Not authorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Not authorized"
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
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/CV'
 *             example:
 *               success: true
 *               data:
 *                 _id: "65f1a2b3c4d5e6f7a8b9c0d1"
 *                 cvTitle: "Web Developer CV"
 *                 personalInfo:
 *                   fullName: "Jane Doe"
 *                 educations: []
 *                 experiences: []
 *                 skills: []
 *       401:
 *         description: Not authorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: CV not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "CV not found"
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
 *               languages:
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
 *               socialLinks:
 *                 - platform: LinkedIn
 *                   url: https://linkedin.com/in/janedoe
 *             languages:
 *               - languageName: English
 *                 level: Native
 *     responses:
 *       200:
 *         description: CV updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/CV'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               success: true
 *               message: "CV deleted successfully"
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
 *     tags: [Educations]
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
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Education'
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
 *     tags: [Educations]
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
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Education'
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
 *     tags: [Educations]
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
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
 *     tags: [Experiences]
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
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Experience'
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
 *     tags: [Experiences]
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
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Experience'
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
 *     tags: [Experiences]
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
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
 *     tags: [Skills]
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
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Skill'
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
 *     tags: [Skills]
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
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Skill'
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
 *     tags: [Skills]
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Not authorized
 *       404:
 *         description: CV or Skill not found
 */
router.delete('/:id/skills/:skillId', protect, deleteSkill);

/**
 * @swagger
 * /api/cv/{id}/personal-info:
 *   put:
 *     summary: Update personal info in CV
 *     tags: [Personal Info]
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
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               jobTitle:
 *                 type: string
 *               summary:
 *                 type: string
 *               socialLinks:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - platform
 *                     - url
 *                   properties:
 *                     platform:
 *                       type: string
 *                       example: LinkedIn
 *                     url:
 *                       type: string
 *                       example: https://linkedin.com/in/janedoe
 *     responses:
 *       200:
 *         description: Personal info updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/PersonalInfo'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authorized
 *       404:
 *         description: CV not found
 */
router.put(
  '/:id/personal-info',
  protect,
  validate(personalInfoUpdateSchema),
  updatePersonalInfo,
);

/**
 * @swagger
 * /api/cv/{id}/projects:
 *   post:
 *     summary: Add a project entry to CV
 *     tags: [Projects]
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
 *             required:
 *               - projectName
 *             properties:
 *               projectName:
 *                 type: string
 *               description:
 *                 type: string
 *               url:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Project added successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Project'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authorized
 *       404:
 *         description: CV not found
 */
router.post('/:id/projects', protect, validate(projectSchema), addProject);

/**
 * @swagger
 * /api/cv/{id}/projects/{projectId}:
 *   put:
 *     summary: Update a project entry in CV
 *     tags: [Projects]
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
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: The Project entry ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               projectName:
 *                 type: string
 *               description:
 *                 type: string
 *               url:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Project updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Project'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authorized
 *       404:
 *         description: CV or Project not found
 */
router.put(
  '/:id/projects/:projectId',
  protect,
  validate(projectUpdateSchema),
  editProject,
);

/**
 * @swagger
 * /api/cv/{id}/projects/{projectId}:
 *   delete:
 *     summary: Delete a project entry from CV
 *     tags: [Projects]
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
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: The Project entry ID
 *     responses:
 *       200:
 *         description: Project deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Not authorized
 *       404:
 *         description: CV or Project not found
 */
router.delete('/:id/projects/:projectId', protect, deleteProject);

/**
 * @swagger
 * /api/cv/{id}/certifications:
 *   post:
 *     summary: Add a certification entry to CV
 *     tags: [Certifications]
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
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               issuer:
 *                 type: string
 *               issueDate:
 *                 type: string
 *                 format: date-time
 *               expiryDate:
 *                 type: string
 *                 format: date-time
 *               url:
 *                 type: string
 *     responses:
 *       201:
 *         description: Certification added successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Certification'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authorized
 *       404:
 *         description: CV not found
 */
router.post(
  '/:id/certifications',
  protect,
  validate(certificationSchema),
  addCertification,
);

/**
 * @swagger
 * /api/cv/{id}/certifications/{certId}:
 *   put:
 *     summary: Update a certification entry in CV
 *     tags: [Certifications]
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
 *         name: certId
 *         required: true
 *         schema:
 *           type: string
 *         description: The Certification entry ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               issuer:
 *                 type: string
 *               issueDate:
 *                 type: string
 *                 format: date-time
 *               expiryDate:
 *                 type: string
 *                 format: date-time
 *               url:
 *                 type: string
 *     responses:
 *       200:
 *         description: Certification updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Certification'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authorized
 *       404:
 *         description: CV or Certification not found
 */
router.put(
  '/:id/certifications/:certId',
  protect,
  validate(certificationUpdateSchema),
  editCertification,
);

/**
 * @swagger
 * /api/cv/{id}/certifications/{certId}:
 *   delete:
 *     summary: Delete a certification entry from CV
 *     tags: [Certifications]
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
 *         name: certId
 *         required: true
 *         schema:
 *           type: string
 *         description: The Certification entry ID
 *     responses:
 *       200:
 *         description: Certification deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Not authorized
 *       404:
 *         description: CV or Certification not found
 */
router.delete('/:id/certifications/:certId', protect, deleteCertification);

/**
 * @swagger
 * /api/cv/{id}/languages:
 *   post:
 *     summary: Add a language entry to CV
 *     tags: [Languages]
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
 *             required:
 *               - languageName
 *             properties:
 *               languageName:
 *                 type: string
 *                 example: English
 *               level:
 *                 type: string
 *                 example: Native
 *     responses:
 *       201:
 *         description: Language added successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authorized
 *       404:
 *         description: CV not found
 */
router.post('/:id/languages', protect, validate(languageSchema), addLanguage);

/**
 * @swagger
 * /api/cv/{id}/languages/{langId}:
 *   put:
 *     summary: Update a language entry in CV
 *     tags: [Languages]
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
 *         name: langId
 *         required: true
 *         schema:
 *           type: string
 *         description: The Language entry ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               languageName:
 *                 type: string
 *                 example: Spanish
 *               level:
 *                 type: string
 *                 example: Intermediate
 *     responses:
 *       200:
 *         description: Language updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authorized
 *       404:
 *         description: CV or Language not found
 */
router.put(
  '/:id/languages/:langId',
  protect,
  validate(languageUpdateSchema),
  editLanguage,
);

/**
 * @swagger
 * /api/cv/{id}/languages/{langId}:
 *   delete:
 *     summary: Delete a language entry from CV
 *     tags: [Languages]
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
 *         name: langId
 *         required: true
 *         schema:
 *           type: string
 *         description: The Language entry ID
 *     responses:
 *       200:
 *         description: Language deleted successfully
 *       401:
 *         description: Not authorized
 *       404:
 *         description: CV or Language not found
 */
router.delete('/:id/languages/:langId', protect, deleteLanguage);

/**
 * @swagger
 * /api/cv/{id}/sections:
 *   put:
 *     summary: Update CV sections ordering/visibility
 *     tags: [Sections]
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
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 sectionKey:
 *                   type: string
 *                   enum: [personalInfo, educations, experiences, skills, projects, certifications, languages]
 *                 displayName:
 *                   type: string
 *                 order:
 *                   type: integer
 *                 isVisible:
 *                   type: boolean
 *     responses:
 *       200:
 *         description: Sections updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Section'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authorized
 *       404:
 *         description: CV not found
 */
router.put(
  '/:id/sections',
  protect,
  validate(sectionsUpdateSchema),
  updateSections,
);

/**
 * @swagger
 * /api/cv/{id}/avatar:
 *   post:
 *     summary: Upload or replace avatar image
 *     tags: [Avatar]
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - avatar
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: Image file (JPEG, PNG, or WebP, max 2 MB)
 *     responses:
 *       200:
 *         description: Avatar uploaded successfully, returns updated personalInfo
 *       400:
 *         description: No file provided or invalid file type
 *       401:
 *         description: Not authorized
 *       404:
 *         description: CV not found
 */
router.post('/:id/avatar', protect, uploadSingle, uploadCVAvatar);

/**
 * @swagger
 * /api/cv/{id}/avatar:
 *   delete:
 *     summary: Delete avatar image
 *     tags: [Avatar]
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
 *         description: Avatar deleted successfully
 *       400:
 *         description: No avatar to delete
 *       401:
 *         description: Not authorized
 *       404:
 *         description: CV not found
 */
router.delete('/:id/avatar', protect, deleteCVAvatar);

export default router;
