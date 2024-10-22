const express = require("express");
const router = express.Router();
const authRouter = require("./auth.router");
const adminRouter = require("./adminRouter/admin.router");
const manageBookRoomByUser = require("./manageBookRoomByUser.router");
const authMiddleware = require("../middleware/authenticate");
const authorize = require("../middleware/authorizeByRole/authorize");
const {
  getAllRoom,
  getRoomDetailsAndBookingStatus,
  checkPreviousBookingStatus,
} = require("../controller/manageRoom");

router.get("/get-all-rooms", getAllRoom);
router.get("/get-room-details-&-status/:id", getRoomDetailsAndBookingStatus);
router.get("/check-booking-status/:room", checkPreviousBookingStatus); //avoid conflict booking
router.use("/auth", authRouter);
router.use("/book-room-by-use",  manageBookRoomByUser);
router.use("/admin", adminRouter);

module.exports = router;
