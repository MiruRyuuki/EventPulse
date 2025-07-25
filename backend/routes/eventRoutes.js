// backend/routes/eventRoutes.js

const express = require("express");
const router = express.Router();
const {
  getAllEvents,
  createEvent,
  registerForEvent,
  getRegisteredEvents,
  deleteEvent,
  getRegisteredVsAttended // ✅ New function for Registered vs Attended
} = require("../controllers/eventController");

const { protect, isOrganizer, isAdmin } = require("../middleware/authMiddleware");

// Public routes
router.get("/", getAllEvents);

// Protected routes
router.post("/", protect, isOrganizer, createEvent);  // Only organizers and admins can create events
router.post("/register/:id", protect, registerForEvent); // Allow attendees to register for events
router.get("/registered", protect, getRegisteredEvents); // Allow attendees to view their registered events
router.delete("/:id", protect, isOrganizer, deleteEvent); // Only organizers and admins can delete events

// New route for admin to view Registered vs Attended
router.get("/attendance/:eventId", protect, isAdmin, getRegisteredVsAttended); // Admin route

module.exports = router;
