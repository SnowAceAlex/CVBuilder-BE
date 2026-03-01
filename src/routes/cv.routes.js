const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/auth.middleware");

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
router.get("/", protect, async (req, res) => {
  res.json({ success: true, message: "CV routes working" });
});

module.exports = router;
