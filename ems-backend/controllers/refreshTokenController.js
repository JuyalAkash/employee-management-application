import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import CustomError from "../utils/CustomError.js";

/**
 * @desc   Refresh Access Token
 * @route  POST /api/auth/refresh-token
 * @access Public (client sends refresh token)
 */
export const refreshToken = async (req, res, next) => {
  // Get the cookie from the req.cookies
  const cookie = req.cookies;

  // If the refreshtoken is not present in the cookie, return an error
  if (!cookie?.refreshToken) {
    return next(new CustomError("Unauthorized", 401));
  }

  // Store the refresh token in a variable
  const refreshToken = cookie.refreshToken;

  try {
    // Verify the refresh token
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET || "7d"
    ); // Verify the refreshtoken using the secret key

    if (!decoded || !decoded?.userInfo) {
      return res.status(403).json({ message: "Forbidden, invalid token" });
    }

    // Find user with this refresh token
    const foundUser = await User.findOne({ _id: decoded._id }).exec();

    // Check user found by decoded id
    if (!foundUser) {
      return next(new CustomError("Unauthorized", 401));
    }

    // Generate a new access token
    const newAccessToken = await User.generateAccessToken();

    // Send response with new access token
    res.status(200).json({ success: true, newAccessToken });
  } catch (error) {
    console.error("Error during user registration:", error.message);
    return next(new CustomError("User registration failed", 500));
  }
};
