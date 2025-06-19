import express from "express";
import { getAdminDasboard } from "../../controllers/admin/adminDashboardController.js";
import protect from "../../middleware/isAuth.js";
import { authorizeRoles } from "../../middleware/authorizeRoles.js";

// Create an Express Router instance
const router = express.Router();

// All routes in this file will be protected by protect middleware and authorizeRoles('admin')
// This means only authenticated users with the 'admin' role can access these endpoints.

// -----------------------------------------------------------
// Admin User Management Routes
// -----------------------------------------------------------

// @route   GET /api/admin/admin-dashboard
// @desc    Get all information
// @access  Private (Admin only)
router.get(
  "/admin-dashboard",
  protect,
  authorizeRoles("admin"),
  getAdminDasboard
);

export default router;
