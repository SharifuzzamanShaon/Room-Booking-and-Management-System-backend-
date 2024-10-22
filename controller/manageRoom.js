const Booking = require("../models/booking.model");
const Room = require("../models/room.model");

const getAllRoom = async (req, res, next) => {
  try {
    // Fetch all rooms from the database
    const rooms = await Room.find();
    res
      .status(200)
      .json({ success: true, message: "all available rooms", rooms });
  } catch (error) {
    next(error);
  }
};
const getRoomDetailsAndBookingStatus = async (req, res, next) => {
  const { id } = req.params; // Room ID from the URL

  try {
    const room = await Room.findById(id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    // Check the most recent booking for the room where the status is "booked"
    const currentBooking = await Booking.findOne({ room: id, status: "booked" })
      .sort({ endDate: -1 }) // Sort by endDate in descending order (most recent first)
      .exec();

    // Prepare the booking status response
    let bookingStatus = "The room is available.";
    let bookingDetails = null;

    if (currentBooking) {
      bookingStatus = "The room is currently booked.";
      bookingDetails = {
        startDate: currentBooking.startDate.toUTCString(),
        endDate: currentBooking.endDate.toUTCString(),
        status: currentBooking.status,
      };
    }

    // Combine the room details and booking status in the response
    res.status(200).json({
      room, // Room details
      bookingStatus,
      bookingDetails, // Booking details (null if not booked)
    });
  } catch (error) {
    console.error("Error fetching room details or booking status:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
const checkPreviousBookingStatus = async (req, res, next) => {
  const { room } = req.params; // Room ID from the URL

  try {
    // Find the most recent booking for the room where status is "booked"
    const currentBooking = await Booking.findOne({ room, status: "booked" })
      .sort({ endDate: -1 }) // Sort by endDate in descending order (most recent first)
      .exec();

    if (currentBooking) {
      // If the room is currently booked, return the booking dates
      return res.status(200).json({
        message: "The room is currently booked.",
        booking: {
          startDate: currentBooking.startDate.toUTCString(),
          endDate: currentBooking.endDate.toUTCString(),
          status: currentBooking.status,
        },
      });
    }

    // If no active bookings found, return that the room is available
    return res.status(200).json({ message: "The room is available." });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  getAllRoom,
  getRoomDetailsAndBookingStatus,
  checkPreviousBookingStatus,
};
