const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/auth.middleware");

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
router.get("/me", protect, async (req, res) => {
  res.json({ success: true, message: "Auth is working" });
});

module.exports = router;
