// backend/models/Payment.js

const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  method: {
    type: String,
    enum: ["stripe", "cash", "manual"],
    default: "cash"
  },
  reference: {
    type: String
  },
  status: {
    type: String,
    enum: ["paid", "pending", "awaiting-verification"],
    default: "pending"
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Payment", paymentSchema);
