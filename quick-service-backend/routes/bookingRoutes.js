const express = require("express");
const router = express.Router();
const {
  createBooking,
  getBookings,
  getBookingById,
  getUserBookings,
  updateBookingStatus,
  approveBooking,
  cancelBooking,
  deleteBooking
} = require("../controllers/bookingController");
const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");

// Protected routes - User
router.post("/", authMiddleware, createBooking);
router.get("/user/:userId", authMiddleware, getUserBookings);
router.get("/:id", authMiddleware, getBookingById);
router.put("/:id/cancel", authMiddleware, cancelBooking);

// Add route for legacy endpoint
router.post("/add", authMiddleware, createBooking);

// Protected routes - Admin only
router.get("/", authMiddleware, authorize("admin"), getBookings);
router.put("/:id/status", authMiddleware, authorize("admin"), updateBookingStatus);
router.put("/:id/approve", authMiddleware, authorize("admin"), approveBooking);
router.delete("/:id", authMiddleware, authorize("admin"), deleteBooking);

module.exports = router;