import User from "../../models/userModel.js";
import { validationResult } from "express-validator";
import CustomError from "../../utils/CustomError.js";

/**
 * @desc User login
 * @route POST /api/auth/login
 * @access Public
 */
export const loginUser = async (req, res, next) => {
  // Check for validation errors (this part doesn't change)
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new CustomError(errors.array()));
  }
  // Extract email and password from request body
  const { email, password } = req.body;

  // Check if email and password are provided
  // This is a simple check to ensure both fields are present
  if (!email || !password) {
    return next(new CustomError("Email and password are required", 400));
  }

  try {
    // Find user by email
    const user = await User.findOne({ email }).select("+password"); // Include password in the query to compare later
    // If user is not found, return an error
    if (!user) {
      return next(new CustomError("User not found", 404));
    }

    // Compare provided password with stored password in the database
    const isPasswordValid = await User.comparePassword(password);
    if (!isPasswordValid) {
      return next(new CustomError("Invalid credentials", 401));
    }

    // Generate access and refresh tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Set refresh token in cookies
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true, // Use true if your site is served over HTTPS
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Send response with user details and tokens
    res.status(200).json({
      message: "User logged in successfully",
      user: user.toJSON(), // Send user details without password
      accessToken: accessToken,
    });
  } catch (error) {
    console.error("Error during user login:", error.message);
    return next(new CustomError("User login failed", 500));
  }
};
