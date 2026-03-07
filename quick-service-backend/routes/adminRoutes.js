const express = require("express");
const router = express.Router();
const {
  getDashboardStats,
  getAllUsers,
  deactivateUser,
  activateUser,
  getAnalytics
} = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");

// All admin routes require auth + admin role
router.use(authMiddleware, authorize("admin"));

// Dashboard & Stats
router.get("/dashboard", getDashboardStats);
router.get("/analytics", getAnalytics);

// User Management
router.get("/users", getAllUsers);
router.put("/users/:userId/deactivate", deactivateUser);
router.put("/users/:userId/activate", activateUser);

router.use(authMiddleware);
router.use(authorize("admin"));

module.exports = router;
