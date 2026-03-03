import { requireAuth, getAuth } from '@clerk/express';

// Use this on any route you want to protect
const protect = requireAuth();

// Helper to get the current user's Clerk ID inside a controller
const getCurrentUserId = (req) => getAuth(req).userId;

export { protect, getCurrentUserId };
