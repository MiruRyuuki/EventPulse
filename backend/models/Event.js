// backend/models/Event.js

const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String },
  organizers: { type: String },
  speakers: { type: String },
  photos: { type: String }, // store image URL
  totalSeats: { type: Number, required: true },
  registeredUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  Seatsleft: { type: Number, required: true },
  price: { type: Number, required: true }  // Add this field for event price
});

module.exports = mongoose.model("Event", eventSchema);
