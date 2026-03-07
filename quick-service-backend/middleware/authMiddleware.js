const jwt = require("jsonwebtoken");

/**
 * Middleware to verify JWT token
 */
const authMiddleware = (req, res, next) => {
  try {

    // Get authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "No authentication token provided"
      });
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Invalid authorization format"
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user data
    req.user = decoded;
    req.userId = decoded.id;
    req.userRole = decoded.role;

    next();

  } catch (err) {

    console.error("JWT ERROR:", err.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });

  }
};

module.exports = authMiddleware;