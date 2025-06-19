import User from "../../models/userModel.js";
import { validationResult } from "express-validator";
import CustomError from "../../utils/CustomError.js";

/**
 * @desc Register a new user
 * @route POST /api/auth/register
 * @access Public
 */
export const registerUser = async (req, res, next) => {
  // Check for validation errors (this part doesn't change)
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new CustomError(errors.array()));
  }

  // Destructure the fields from req.body
  const { firstName, lastName, email, password, confirmPassword, roles } =
    req.body;

  // Check fields are not empty during the registration
  if (!firstName || !lastName || !email || !password || !confirmPassword) {
    return next(new CustomError("All fields are required", 400));
  }

  // Validate role assignment
  let OnlyAdmin = roles;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email }).exec();
    if (existingUser) {
      return next(new CustomError("User with this email already exists", 400));
    }

    // Create new user
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password, // Only the 'password' field is used for the user model
      roles: OnlyAdmin || "employee",
    });

    // Get Access and Refresh Tokens
    const accessToken = await newUser.generateAccessToken();
    const refreshToken = await newUser.generateRefreshToken();

    // Set Refresh Token in Cookies
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true, // Use true if your site is served over HTTPS
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Send response with user details and tokens
    if (newUser) {
      res.status(201).json({
        message: "User registered successfully",
        user: newUser.toJSON(), // Send user details without password
        accessToken: accessToken,
      });
    }
  } catch (error) {
    console.error("Error during user registration:", error.message);
    return next(new CustomError("User registration failed", 500));
  }
};
