// backend/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const { register, login, getProfile } = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);

// GET: View user profile by ID (protected route)
router.get("/profile/:id", getProfile); // Allow users to view their profile by user ID

module.exports = router;
