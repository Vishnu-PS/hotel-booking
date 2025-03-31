const express = require("express");
const router = express.Router();
const bookingService = require("../services/booking.service");
const createBookingController = require("../controller/booking.controller");

const bookingController = createBookingController(bookingService);

router.post("/book-room", bookingController.bookRoom);
router.get("/booking/:email", bookingController.getBooking);
router.get("/guests", bookingController.getAllGuests);
router.delete("/cancel/:email/:bookingId", bookingController.cancelBooking);
router.put("/modify/:bookingId", bookingController.modifyBooking);

module.exports = router;
