const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({

  name: {
    type: String,
    required: [true, "Service name is required"],
    unique: true,
    trim: true
  },

  description: {
    type: String,
    required: [true, "Description is required"],
    minlength: 50
  },

  category: {
    type: String,
    required: true,
    enum: [
      "Cleaning",
      "Plumbing",
      "Electrical",
      "Carpentry",
      "Painting",
      "Gardening",
      "AC Repair",
      "Appliance Repair",
      "Beauty",
      "Tutoring",
      "Other"
    ]
  },

  price: {
    type: Number,
    required: true,
    min: 0
  },

  basePrice: Number,
  discountedPrice: Number,

  image: String,

  images: {
    type: [String],
    default: []
  },

  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },

  reviewCount: {
    type: Number,
    default: 0
  },

  estimatedDuration: {
    type: Number,
    default: 60
  },

  serviceArea: {
    type: [String],
    default: []
  },

  isActive: {
    type: Boolean,
    default: true
  },

  isFeatured: {
    type: Boolean,
    default: false
  },

  availability: {
    monday: { type: Boolean, default: true },
    tuesday: { type: Boolean, default: true },
    wednesday: { type: Boolean, default: true },
    thursday: { type: Boolean, default: true },
    friday: { type: Boolean, default: true },
    saturday: { type: Boolean, default: true },
    sunday: { type: Boolean, default: false }
  }

}, { timestamps: true });


// Indexes for faster queries
serviceSchema.index({ category: 1 });
serviceSchema.index({ price: 1 });
serviceSchema.index({ rating: -1 });

module.exports = mongoose.model("Service", serviceSchema);