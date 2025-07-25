const express = require("express");
const router = express.Router();
const {
  getNotifications,
  createNotification,
  markAsRead,
  markNotificationAsRead
} = require("../controllers/notificationController");

const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getNotifications);
router.post("/", createNotification); // Only organizer/admin should call
router.patch("/:id/read", protect, markAsRead);
router.patch('/:id', protect, markNotificationAsRead);


module.exports = router;
