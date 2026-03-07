const Review = require("../models/Review");
const Service = require("../models/Service");
const Booking = require("../models/Booking");

// CREATE REVIEW
exports.createReview = async (req, res) => {
  try {
    const { bookingId, serviceId, rating, comment } = req.body;
    const userId = req.userId;

    if (!bookingId || !serviceId || !rating) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields"
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5"
      });
    }

    // Check if booking exists and is completed
    const booking = await Booking.findById(bookingId);
    if (!booking || booking.status !== "completed") {
      return res.status(400).json({
        success: false,
        message: "Can only review completed bookings"
      });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({ bookingId });
    if (existingReview) {
      return res.status(409).json({
        success: false,
        message: "Review already exists for this booking"
      });
    }

    // Create review
    const review = await Review.create({
      serviceId,
      bookingId,
      userId,
      rating,
      comment: comment || ""
    });

    // Update service rating
    const allReviews = await Review.find({ serviceId });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await Service.findByIdAndUpdate(serviceId, {
      rating: parseFloat(avgRating.toFixed(1)),
      reviewCount: allReviews.length
    });

    res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: review
    });
  } catch (err) {
    console.error("REVIEW ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Failed to create review"
    });
  }
};

// GET SERVICE REVIEWS
exports.getServiceReviews = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const reviews = await Review.find({ serviceId })
      .populate("userId", "name profilePicture")
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Review.countDocuments({ serviceId });

    res.json({
      success: true,
      data: reviews,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch reviews"
    });
  }
};

// UPDATE REVIEW
exports.updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found"
      });
    }

    // Check if user owns the review
    if (review.userId.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this review"
      });
    }

    const updated = await Review.findByIdAndUpdate(
      id,
      { rating, comment },
      { new: true }
    );

    // Recalculate service rating
    const allReviews = await Review.find({ serviceId: review.serviceId });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await Service.findByIdAndUpdate(review.serviceId, {
      rating: parseFloat(avgRating.toFixed(1))
    });

    res.json({
      success: true,
      message: "Review updated",
      data: updated
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to update review"
    });
  }
};

// DELETE REVIEW
exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found"
      });
    }

    // Check if user owns the review or is admin
    if (review.userId.toString() !== req.userId && req.userRole !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this review"
      });
    }

    await Review.findByIdAndDelete(id);

    // Recalculate rating
    const allReviews = await Review.find({ serviceId: review.serviceId });
    if (allReviews.length > 0) {
      const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
      await Service.findByIdAndUpdate(review.serviceId, {
        rating: parseFloat(avgRating.toFixed(1)),
        reviewCount: allReviews.length
      });
    } else {
      await Service.findByIdAndUpdate(review.serviceId, {
        rating: 0,
        reviewCount: 0
      });
    }

    res.json({
      success: true,
      message: "Review deleted"
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to delete review"
    });
  }
};
