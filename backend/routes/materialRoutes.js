// backend/routes/materialRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { uploadMaterial, getMaterials } = require("../controllers/materialController");
const { protect, isSpeaker } = require("../middleware/authMiddleware");

// Create folder if not exists
const materialDir = path.join(__dirname, "../uploads/materials");
if (!fs.existsSync(materialDir)) {
  fs.mkdirSync(materialDir, { recursive: true });
}

// Multer config for conference materials
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, materialDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// Routes
// Apply `isSpeaker` middleware to ensure only speakers can upload conference materials
router.post("/upload", protect, isSpeaker, upload.single("file"), uploadMaterial); // Conference materials upload
router.get("/", getMaterials); // Retrieve all uploaded materials

module.exports = router;
