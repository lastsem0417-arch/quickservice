const express = require("express");
const router = express.Router();
const {
  getServices,
  getServiceById,
  addService,
  updateService,
  deleteService,
  searchServices,
  getServicesByCategory
} = require("../controllers/serviceController");
const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");

// Public routes
router.get("/", getServices);
router.get("/search", searchServices);
router.get("/category/:category", getServicesByCategory);
router.get("/:id", getServiceById);

// Admin only routes
router.post("/", authMiddleware, authorize("admin"), addService);
router.put("/:id", authMiddleware, authorize("admin"), updateService);
router.delete("/:id", authMiddleware, authorize("admin"), deleteService);

module.exports = router;