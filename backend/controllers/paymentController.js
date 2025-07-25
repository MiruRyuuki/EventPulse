const path = require("path");

// ========== [1] ONLINE PAYMENT ==========
exports.processOnlinePayment = async (req, res) => {
  const { userId, eventId, amount, paymentMethod } = req.body;

  if (!userId || !eventId || !amount || !paymentMethod) {
    return res.status(400).json({ message: "Missing payment details" });
  }

  // Simulate a successful payment (Stripe or similar)
  return res.status(200).json({
    message: "Online payment processed successfully",
    paymentId: `txn_${Date.now()}`
  });
};

// ========== [2] OFFLINE PAYMENT ==========
exports.recordOfflinePayment = async (req, res) => {
  const { userId, eventId, amount, reference } = req.body;

  if (!userId || !eventId || !amount || !reference) {
    return res.status(400).json({ message: "Missing offline payment details" });
  }

  const payment = {
    _id: Date.now().toString(),  // Simulated unique ID
    user: userId,
    event: eventId,
    amount,
    method: "cash",
    reference,
    status: "awaiting-verification"
  };

  // Simulate DB save by returning the payment object
  return res.status(201).json({
    message: "Offline payment recorded",
    payment
  });
};

// ========== [3] UPLOAD OFFLINE PROOF FILE ==========
exports.uploadProof = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    res.status(200).json({
      message: "File uploaded successfully",
      filename: req.file.filename,
      filePath: `/uploads/${req.file.filename}`
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// backend/controllers/paymentController.js

exports.processOnlinePayment = async (req, res) => {
  const { userId, eventId, amount, paymentMethod } = req.body;

  if (!userId || !eventId || !amount || !paymentMethod) {
    return res.status(400).json({ message: "Missing payment details" });
  }

  // Simulate a successful payment (Stripe or similar)
  return res.status(200).json({
    message: "Online payment processed successfully",
    paymentId: `txn_${Date.now()}`
  });
};

// backend/controllers/paymentController.js

exports.recordOfflinePayment = async (req, res) => {
  const { userId, eventId, amount, reference } = req.body;

  if (!userId || !eventId || !amount || !reference) {
    return res.status(400).json({ message: "Missing offline payment details" });
  }

  const payment = {
    _id: Date.now().toString(),  // Simulated unique ID
    user: userId,
    event: eventId,
    amount,
    method: "cash",
    reference,
    status: "awaiting-verification"
  };

  // Simulate DB save by returning the payment object
  return res.status(201).json({
    message: "Offline payment recorded",
    payment
  });
};
