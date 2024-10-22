const router = require("express").Router();

const {
  bookRoom,
  modifyBookingByUser,
  cancelBookingByUser,
  getBookingHistory,
} = require("../controller/bookRoom.controller");

router.post("/book", bookRoom); // Book a room
router.put("/modify/:room", modifyBookingByUser); // Modify a booking
router.get("/get-booking-hisotry", getBookingHistory); //booking
router.patch("/cancel/:roomId", cancelBookingByUser); // Cancel a booking

module.exports = router;
