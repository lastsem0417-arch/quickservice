const Booking = require("../models/Booking");
const Service = require("../models/Service");

// CREATE BOOKING
exports.createBooking = async (req, res) => {
  try {
    const { serviceId, bookingDate, startTime, address, notes } = req.body;
    const userId = req.userId;

    // Validation
    if (!serviceId || !bookingDate || !startTime || !address) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields"
      });
    }

    // Get service details
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found"
      });
    }

    // Create booking
    const booking = new Booking({
      serviceId,
      userId,
      serviceName: service.name,
      bookingDate: new Date(bookingDate),
      startTime,
      address,
      notes,
      totalAmount: service.price,
      date: bookingDate, // Keep for backward compatibility
      status: "pending"
    });

    await booking.save();

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: booking
    });
  } catch (error) {
    console.error("BOOKING ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Booking failed",
      error: error.message
    });
  }
};

// GET ALL BOOKINGS (ADMIN)
exports.getBookings = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, userId } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (userId) filter.userId = userId;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const bookings = await Booking.find(filter)
      .populate("userId", "name email phone")
      .populate("serviceId", "name price category")
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Booking.countDocuments(filter);

    res.json({
      success: true,
      data: bookings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (err) {
    console.error("GET BOOKINGS ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings"
    });
  }
};

// GET BOOKING BY ID
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("userId", "name email phone address")
      .populate("serviceId");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    res.json({
      success: true,
      data: booking
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch booking"
    });
  }
};

// GET USER BOOKINGS
exports.getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10, status } = req.query;

    const filter = { userId };
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const bookings = await Booking.find(filter)
      .populate("serviceId", "name price category image rating")
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ bookingDate: -1 });

    const total = await Booking.countDocuments(filter);

    res.json({
      success: true,
      data: bookings,
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
      message: "Failed to fetch bookings"
    });
  }
};

// UPDATE BOOKING STATUS
exports.updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending", "confirmed", "in-progress", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status"
      });
    }

    const booking = await Booking.findByIdAndUpdate(
      id,
      {
        status,
        ...(status === "confirmed" && { approvedAt: new Date() }),
        ...(status === "completed" && { completedAt: new Date() }),
        ...(status === "cancelled" && { cancelledAt: new Date() })
      },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    res.json({
      success: true,
      message: "Booking status updated",
      data: booking
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to update booking"
    });
  }
};

// APPROVE BOOKING
exports.approveBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findByIdAndUpdate(
      id,
      {
        status: "confirmed",
        approvedAt: new Date()
      },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    res.json({
      success: true,
      message: "Booking approved",
      data: booking
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to approve booking"
    });
  }
};

// CANCEL BOOKING
exports.cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      id,
      {
        status: "cancelled",
        cancelledAt: new Date(),
        cancellationReason: reason
      },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    res.json({
      success: true,
      message: "Booking cancelled",
      data: booking
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to cancel booking"
    });
  }
};

// DELETE BOOKING
exports.deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    await Booking.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Booking deleted"
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to delete booking"
    });
  }
};