const Booking = require("../models/Booking");

exports.createBooking = async (req, res) => {
  try {
    console.log("BOOKING BODY 👉", req.body);

    const booking = new Booking({
      serviceName: req.body.serviceName,
      date: req.body.date,
      userId: req.body.userId
    });

    await booking.save();

    res.status(201).json({ message: "Booking saved", booking });
  } catch (error) {
    console.error("BOOKING ERROR ❌", error);
    res.status(500).json({ message: "Booking failed" });
  }
};

exports.getBookings = async (req, res) => {
  const bookings = await Booking.find();
  res.json(bookings);
};
exports.deleteBooking = async (req, res) => {
  await Booking.findByIdAndDelete(req.params.id);
  res.json({ message: "Booking deleted" });
};
// GET BOOKINGS BY USER
exports.getUserBookings = async (req, res) => {
  try {
    const userId = req.params.userId;

    const bookings = await Booking.find({ userId });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};