// backend/routes/paymentRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const {
  processOnlinePayment,
  recordOfflinePayment,
  uploadProof
} = require("../controllers/paymentController");

// Ensure upload folder exists
const proofDir = path.join(__dirname, "../uploads/payments");
const fs = require("fs");
if (!fs.existsSync(proofDir)) {
  fs.mkdirSync(proofDir, { recursive: true });
}

// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, proofDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
const upload = multer({ storage });

// -------- ROUTES --------

// 1. Online payment
router.post("/online", processOnlinePayment);

// 2. Offline payment
router.post("/offline", recordOfflinePayment);

// 3. Upload payment proof (offline)
router.post("/upload-proof", upload.single("proof"), uploadProof);

module.exports = router;
