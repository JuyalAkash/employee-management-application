import User from "../../models/userModel.js";

/**
 * Logout Controller
 * Handles user logout functionality.
 * @desc Logout user
 * @route POST /api/auth/logout
 * @access Public
 */
export const logoutUser = async (req, res, next) => {
  try {
    // Check if the user is authenticated
    if (!req.user) {
      return next(new Error("User not authenticated", 401));
    }

    // Remove the refresh token from the user's tokens array in the database
    // This step is optional, depending on your application's requirements.
    // You can choose to keep the refresh token for future use or remove it.
    // Note: req.user should be populated by a middleware that verifies the JWT token
    const user = await User.findById(req.user._id);
    if (user) {
      user.tokens = user.tokens.filter(
        (token) => token.refreshToken !== req.cookies.refreshToken
      );
      await user.save();
    }

    // Clear the refresh token cookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: "None",
    });

    // Send response indicating successful logout
    res.status(200).json({
      message: "User logged out successfully",
    });
  } catch (error) {
    console.error("Error during user logout:", error.message);
    return next(new Error("User logout failed", 500));
  }
};
