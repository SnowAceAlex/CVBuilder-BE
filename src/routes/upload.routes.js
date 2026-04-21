import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import { uploadSingle } from '../middlewares/upload.middleware.js';
import { uploadAvatar } from '../controllers/upload.controller.js';

const router = express.Router();

/**
 * @swagger
 * /api/upload/avatar:
 *   post:
 *     summary: Upload an avatar image (stateless)
 *     tags: [Upload]
 *     description: |
 *       Uploads an image to Cloudinary and returns the hosted URL. This endpoint
 *       is not bound to any CV or user record - nothing is persisted server-side.
 *       The frontend should take the returned `url` and use it directly in the UI
 *       or send it back in a subsequent request (e.g. a profile / CV update).
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [avatar]
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: Image file (JPEG, PNG, or WebP, max 2 MB)
 *     responses:
 *       200:
 *         description: Avatar uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message:
 *                   type: string
 *                   example: Avatar uploaded successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     url:
 *                       type: string
 *                       example: https://res.cloudinary.com/demo/image/upload/v123/cv-builder/avatars/abc.jpg
 *                     publicId:
 *                       type: string
 *                       example: cv-builder/avatars/66f.../abc
 *       400:
 *         description: No image file provided or invalid file type
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.post('/avatar', protect, uploadSingle, uploadAvatar);

export default router;
