const express = require("express");
const router = express.Router();

const {
  createBooking,
  getBookings,deleteBooking,getUserBookings
} = require("../controllers/bookingController");

router.post("/add", createBooking);
router.get("/", getBookings);
router.delete("/:id", deleteBooking);
router.get("/user/:userId", getUserBookings);
module.exports = router;