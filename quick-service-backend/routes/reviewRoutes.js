const express = require("express");
const router = express.Router();
const {
  createReview,
  getServiceReviews,
  updateReview,
  deleteReview
} = require("../controllers/reviewController");
const authMiddleware = require("../middleware/authMiddleware");

// Public route
router.get("/service/:serviceId", getServiceReviews);

// Protected routes
router.post("/", authMiddleware, createReview);
router.put("/:id", authMiddleware, updateReview);
router.delete("/:id", authMiddleware, deleteReview);

module.exports = router;
