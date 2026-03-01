const { requireAuth, getAuth } = require("@clerk/express");

// Use this on any route you want to protect
const protect = requireAuth();

// Helper to get the current user's Clerk ID inside a controller
const getCurrentUserId = (req) => getAuth(req).userId;

module.exports = { protect, getCurrentUserId };
