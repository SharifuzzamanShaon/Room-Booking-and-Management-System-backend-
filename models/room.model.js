const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    rent: {
      type: Number,
      required: true,
      min: 0,
    },
    facilities: {
      type: [String], // Array of strings
      required: true,
    },
    picture: {
      type: String, // URL or path to the uploaded image
    },
  },
  { timestamps: true }
);

const Room = mongoose.model("Room", roomSchema);
module.exports = Room;
