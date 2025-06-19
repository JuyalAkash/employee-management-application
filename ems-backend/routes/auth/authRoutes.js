import express from "express";
import { authController } from "../../controllers/index.js";
import {
  registerValidation,
  loginValidation,
} from "../../middleware/validation/authValidation.js";

// Create an Express Router instance
const router = express.Router();

// Extracted the values from the authController
const { registerUser, loginUser, logoutUser, refreshToken } = authController;

// -----------------------------------------------------------
// 1. User Registration Route
// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
// -----------------------------------------------------------
router.post("/register", registerValidation, registerUser);

// -----------------------------------------------------------
// 2. User Login Route
// @route   POST /api/auth/login
// @desc    Authenticate user & get tokens
// @access  Public
// -----------------------------------------------------------
router.post("/login", loginValidation, loginUser);

// -----------------------------------------------------------
// 3. Refresh Token Route
// @route   POST /api/auth/refresh-token
// @desc    Refresh access token using refresh token
// @access  Public (sends refresh token, not access token)
// -----------------------------------------------------------
router.post("/refresh-token", refreshToken);

// -----------------------------------------------------------
// 4. Logout Route
// @route   POST /api/auth/logout
// @desc    Logout user (invalidate refresh token)
// @access  Public (or could be Private if you require current access token to perform logout)
// -----------------------------------------------------------
router.post("/logout", logoutUser);

export default router;
