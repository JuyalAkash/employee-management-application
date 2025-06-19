import User from "../../models/userModel.js";
import CustomError from "../../utils/CustomError.js";

/**
 * @desc    Get Admin Dashboard
 * @route   GET /api/admin/admin-dashboard
 * @access  Private (Admin only)
 */
export const getAdminDasboard = async (req, res, next) => {
  try {
    // Optional: check again to ensure only admins can access (if not handled by middleware)
    if (req?.user?.role !== "admin") {
      return next(new CustomError("Access denied: Admins only", 403));
    }

    // Get total users count
    const totalUsers = await User.countDocuments();

    // Get counts by role
    const roleCounts = await User.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 },
        },
      },
    ]);

    const stats = {
      totalUsers,
      roles: roleCounts.reduce((acc, role) => {
        acc[role._id] = role.count;
        return acc;
      }, {}),
    };

    // Send response with get admin dashboard details
    res.status(200).json({
      success: true,
      message: "Admin dashboard stats fetched successfully",
      stats,
    });
  } catch (error) {
    console.error("Error during get admin dashboard:", error.message);
    return next(
      new CustomError(`Get admin dashboard failed: ${error.message}`, 500)
    );
  }
};
