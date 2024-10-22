const Room = require("../models/room.model");
const Booking = require("../models/booking.model");
const fs = require("fs");
const { uploadOnCloudinary } = require("../utils/uploadFiles");
// Create a new room
const createRoom = async (req, res, next) => {
  const { title, rent, facilities, picture } = req.body;

  try {
    const requiredFields = [
      { value: title, field: "Title" },
      { value: rent, field: "Rent" },
      { value: facilities, field: "Facilities" },
      { value: picture, field: "Picture" },
    ];

    for (const { value, field } of requiredFields) {
      if (!value) throw new Error(`${field} is required.`);
    }

    if (rent <= 0) {
      throw new Error("Rent must be a positive number.");
    }
    // Decode Base64 String
    const buffer = Buffer.from(picture, "base64");
    fs.writeFileSync("outputfile", buffer); // Adjust according to your image type
    const response = await uploadOnCloudinary(picture);
    const newRoom = new Room({
      title,
      rent,
      facilities,
      picture: response.secure_url,
    });
    await newRoom.save();
    res.status(201).json({
      success: true,
      message: "Room created successfully",
      room: newRoom,
    });
  } catch (error) {
    next(error);
  }
};

// // Update an existing room
const updateRoom = async (req, res, next) => {
  const { roomId } = req.params;
  const { title, rent, facilities } = req.body;

  try {
    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: "Room not found" });

    // Update room details
    room.title = title || room.title;
    room.rent = rent || room.rent;
    room.facilities = facilities || room.facilities;

    await room.save();
    res
      .status(200)
      .json({ success: true, message: "Room updated successfully", room });
  } catch (error) {
    next(error);
  }
};

// Delete a room
const deleteRoom = async (req, res, next) => {
  const { roomId } = req.params; // Room ID from the URL

  try {
    await Room.findByIdAndDelete(roomId);
    res
      .status(200)
      .json({ success: true, message: "Room deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// View all bookings
const viewBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find().populate("user room");

    const formattedBookings = bookings.map((booking) => {
      return {
        ...booking.toObject(), //  get object
        startDateGMT: booking.startDate.toUTCString(),
        endDateGMT: booking.endDate.toUTCString(),
      };
    });

    res.status(200).json(formattedBookings);
  } catch (error) {
    next(error);
  }
};

const modifyBooking = async (req, res, next) => {
  const { roomId } = req.params;
  const { startDate, endDate } = req.body;

  try {
    const booking = await Booking.findById(roomId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.startDate = startDate || booking.startDate;
    booking.endDate = endDate || booking.endDate;

    await booking.save();
    res.status(200).json({ message: "Booking modified successfully", booking });
  } catch (error) {
    next(error);
  }
};
const updateBookingStatus = async (req, res, next) => {
  const { bookingId } = req.params;
  const { status } = req.body;
  const allowedStatuses = ["booked", "expired", "cancelled"];

  try {
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed values are: ${allowedStatuses.join(
          ", "
        )}`,
      });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = status;
    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking status updated successfully",
      booking,
    });
  } catch (error) {
    next(error);
  }
};
const deleteBooking = async (req, res, next) => {
  const { bookingId } = req.params;

  try {
    const booking = await Booking.findByIdAndDelete(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Booking deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRoom,
  updateRoom,
  deleteRoom,
  viewBookings,
  modifyBooking,
  updateBookingStatus,
  deleteBooking,
};
