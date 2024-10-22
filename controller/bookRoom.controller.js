const Booking = require("../models/booking.model");
const Room = require("../models/room.model");

const bookRoom = async (req, res, next) => {
  const { roomId, startDate, endDate } = req.body;

  try {
    // Check if the room exists
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Check for date conflicts and booking status
    const existingBooking = await Booking.findOne({
      room: roomId,
      status: "booked", // Only consider 'booked' status
      // Check for conflicts where the existing booking overlaps the new one
      $or: [
        // Case 1: Existing booking starts before the new one ends, and ends after the new one starts
        {
          startDate: { $lt: endDate },
          endDate: { $gt: startDate },
        },
      ],
    });

    // If there is a conflict, return an error
    if (existingBooking) {
      return res
        .status(400)
        .json({ message: "Booking conflicts with an existing booking." });
    }

    // If no conflict, create a new booking
    const booking = new Booking({
      user: req.user._id,
      room: roomId,
      startDate,
      endDate,
    });
    await booking.save();

    // Send success response
    res
      .status(201)
      .json({ success: true, message: "Room booked successfully", booking });
  } catch (error) {
    next(error);
  }
};

const modifyBookingByUser = async (req, res, next) => {
  const { room } = req.params;
  const { startDate, endDate } = req.body;
  const userId = req.user._id; // Assuming req.user contains the authenticated user's information

  try {
    // Fetch the booking by ID
    const booking = await Booking.findById(room);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check if the user modifying is the one who booked the room
    if (booking.user.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to modify this booking." });
    }

    // Check if the current booking status allows modification (only allow if it's booked)
    if (booking.status !== "booked") {
      return res
        .status(400)
        .json({ message: "Only 'booked' reservations can be modified." });
    }

    // Check for date conflicts with other bookings
    const conflictingBooking = await Booking.findOne({
      room: booking.room,
      _id: { $ne: room }, // Exclude current booking
      status: "booked", // Only consider active bookings
      $or: [
        { startDate: { $lt: endDate, $gt: startDate } },
        { endDate: { $gt: startDate, $lt: endDate } },
        {
          startDate: { $gte: startDate, $lte: endDate },
          endDate: { $gte: startDate, $lte: endDate },
        },
      ],
    });

    if (conflictingBooking) {
      return res.status(400).json({
        message: "Modified booking conflicts with an existing booking.",
      });
    }

    // Update the booking dates
    booking.startDate = startDate || booking.startDate;
    booking.endDate = endDate || booking.endDate;

    await booking.save();

    res.status(200).json({ message: "Booking modified successfully", booking });
  } catch (error) {
    next(error);
  }
};

const cancelBookingByUser = async (req, res, next) => {
  const { roomId } = req.params; // Booking ID from the URL
  try {
    // Find the booking by ID and update its status to 'cancelled'
    console.log("hit");
    
    const booking = await Booking.findByIdAndUpdate(
      roomId,
      { status: "cancelled" }, // Update the status field
      { new: true } // Return the updated booking document
    );
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res
      .status(200)
      .json({
        success: true,
        message: "Booking cancelled successfully",
        booking,
      });
  } catch (error) {
    next(error);
  }
};

// get the user's booking history
const getBookingHistory = async (req, res, next) => {
  try {
    const user = req.user._id; // Get the authenticated user ID
    const currentTime = new Date();

    // Fetch booking history for the user
    let bookings = await Booking.find({ user }).populate(
      "room",
      "picture title"
    );

    if (!bookings.length) {
      return res
        .status(404)
        .json({ message: "No booking history found for this user" });
    }

    // Update status for expired or completed bookings
    bookings = bookings.map((booking) => {
      // Assuming the booking has a "startDate" and an expiration period (e.g., endDate)
      if (booking.status === "booked" && booking.endDate < currentTime) {
        booking.status = "expired";
        booking.save(); // Save the updated status
      }

      // Convert the startDate and endDate to GMT using toISOString
      booking.startDateGMT = new Date(booking.startDate).toUTCString();
      booking.endDateGMT = new Date(booking.endDate).toUTCString();

      return booking;
    });

    // Return booking history with GMT times
    res.status(200).json({
      success: true,
      bookings: bookings.map((booking) => ({
        ...booking._doc, // Spread existing booking data
        startDateGMT: booking.startDateGMT, // Add the GMT version of startDate
        endDateGMT: booking.endDateGMT, // Add the GMT version of endDate
      })),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  bookRoom,
  modifyBookingByUser,
  cancelBookingByUser,
  getBookingHistory,
};
