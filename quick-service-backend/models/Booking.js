const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: [true, "Service ID is required"]
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"]
    },
    serviceName: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "in-progress", "completed", "cancelled"],
      default: "pending"
    },
    bookingDate: {
      type: Date,
      required: [true, "Booking date is required"]
    },
    startTime: {
      type: String,
      required: [true, "Start time is required"]
    },
    endTime: String,
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String
    },
    totalAmount: {
      type: Number,
      required: true
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending"
    },
    notes: String,
    cancellationReason: String,
    cancelledAt: Date,
    completedAt: Date,
    approvedAt: Date,
    date: {
      type: String, // Keep for backward compatibility
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Indexes
bookingSchema.index({ userId: 1 });
bookingSchema.index({ serviceId: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ bookingDate: 1 });

module.exports = mongoose.model("Booking", bookingSchema);