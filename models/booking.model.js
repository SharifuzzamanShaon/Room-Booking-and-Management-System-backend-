const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["booked", "expired", "cancelled"],
      default: "booked",
    },
  },
  { timestamps: true }
);

// Prevent double booking (date conflict validation)
// bookingSchema.index({ room: 1, startDate: 1, endDate: 1 }, { unique: true }); // Setting { unique: true } ensures that no two documents in the Booking collection can have the same room, startDate, and endDate combination.

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;
