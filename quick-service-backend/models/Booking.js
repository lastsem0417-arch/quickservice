const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  serviceName: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Booking", bookingSchema);