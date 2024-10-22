const router = require("express").Router();
const {
  createRoom,
  updateRoom,
  deleteRoom,
  viewBookings,
  updateBookingStatus,
  deleteBooking,
} = require("../../controller/admin.controller");

router.post("/create-room", createRoom);
router.patch("/update-room/:roomId", updateRoom);
router.delete("/delete/:roomId", deleteRoom);
router.get("/get-all-booking", viewBookings);
router.patch("/booking-status/:bookingId", updateBookingStatus);
router.delete("/booking/delete/:bookingId", deleteBooking);
module.exports = router;
