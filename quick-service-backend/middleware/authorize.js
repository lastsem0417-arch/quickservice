/**
 * Middleware to check user role
 * Use with authMiddleware
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {

    // Check if authenticated
    if (!req.userRole) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    // Check role
    if (!allowedRoles.includes(req.userRole)) {
      return res.status(403).json({
        success: false,
        message: `Only ${allowedRoles.join(" or ")} can access this resource`
      });
    }

    next();
  };
};

module.exports = authorize;