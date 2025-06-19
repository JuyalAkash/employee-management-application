import CustomError from "../utils/CustomError.js";

/**
 * Middleware to check if the authenticated user has one of the allowed roles.
 * Usage: router.get('/admin-dashboard', authMiddleware, authorize('admin'), adminController.getDashboard);
 * Usage: router.get('/manager-report', authMiddleware, authorize('admin', 'manager'), managerController.getReport);
 *
 * @param {...string} allowedRoles - A list of roles that are allowed to access the route.
 */
export const authorizeRoles = (...allowedRoles) => {
  console.log("roles: ", authorizeRoles);
  return (req, res, next) => {
    if (!allowedRoles?.includes(req.user.role)) {
      return next(
        new CustomError(
          "Access denied: User role not found or not authenticated.",
          403
        )
      );
    }
    next(); // User has the required role, proceed to the next middleware/route handler
  };
};
