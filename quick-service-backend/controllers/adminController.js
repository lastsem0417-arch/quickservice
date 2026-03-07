const User = require("../models/User");
const Service = require("../models/Service");
const Booking = require("../models/Booking");
const Review = require("../models/Review");

// GET DASHBOARD STATS
exports.getDashboardStats = async (req, res) => {
  try {

    const totalUsers = await User.countDocuments({ role: "user" });

   const totalServices = await Service.countDocuments();

console.log("TOTAL SERVICES FROM DB:", totalServices);

    const totalBookings = await Booking.countDocuments();

    const totalReviews = await Review.countDocuments();

    const pendingBookings = await Booking.countDocuments({ status: "pending" });
    const confirmedBookings = await Booking.countDocuments({ status: "confirmed" });
    const completedBookings = await Booking.countDocuments({ status: "completed" });
    const cancelledBookings = await Booking.countDocuments({ status: "cancelled" });

    const revenue = await Booking.aggregate([
      { $match: { status: "completed", paymentStatus: "paid" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);

    const totalRevenue = revenue[0]?.total || 0;

    const topServices = await Service.find()
      .sort({ rating: -1, reviewCount: -1 })
      .limit(5);

    const recentBookings = await Booking.find()
      .populate("userId", "name email")
      .populate("serviceId", "name")
      .sort({ createdAt: -1 })
      .limit(10);

    const avgRatingResult = await Service.aggregate([
      { $group: { _id: null, avg: { $avg: "$rating" } } }
    ]);

    const averageRating = avgRatingResult[0]?.avg || 0;

    res.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalServices,
          totalBookings,
          totalReviews,
          totalRevenue,
          averageRating: parseFloat(averageRating.toFixed(1))
        },
        bookingBreakdown: {
          pending: pendingBookings,
          confirmed: confirmedBookings,
          completed: completedBookings,
          cancelled: cancelledBookings
        },
        topServices,
        recentBookings
      }
    });

  } catch (err) {

    console.error("DASHBOARD ERROR:", err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard stats"
    });

  }
};

// GET ALL USERS
exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;

    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const users = await User.find(filter)
      .skip(skip)
      .limit(parseInt(limit))
      .select("-password")
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(filter);

    res.json({
      success: true,
      data: users,
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
      message: "Failed to fetch users"
    });
  }
};

// DEACTIVATE USER
exports.deactivateUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndUpdate(userId, { isActive: false }, { new: true });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      message: "User deactivated",
      data: user
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to deactivate user"
    });
  }
};

// ACTIVATE USER
exports.activateUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndUpdate(userId, { isActive: true }, { new: true });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      message: "User activated",
      data: user
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to activate user"
    });
  }
};

// GET ANALYTICS
exports.getAnalytics = async (req, res) => {
  try {
    const { period = "month" } = req.query;

    // Determine date range
    const now = new Date();
    let startDate;

    if (period === "week") {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (period === "month") {
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    } else {
      startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    }

    // Bookings by date
    const bookingsTrend = await Booking.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
          revenue: { $sum: "$totalAmount" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Services by category
    const servicesByCategory = await Service.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 }, avgRating: { $avg: "$rating" } } }
    ]);

    // Booking status distribution
    const statusDistribution = await Booking.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        bookingsTrend,
        servicesByCategory,
        statusDistribution
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch analytics"
    });
  }
};
