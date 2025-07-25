const Notification = require("../models/Notification");

// GET: All notifications for a user
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST: Create a notification
exports.createNotification = async (req, res) => {
  try {
    const { user, title, message } = req.body;
    const notification = await Notification.create({ user, title, message });
    res.status(201).json(notification);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// PATCH: Mark as read
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification || notification.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: "Not found" });
    }
    notification.isRead = true;
    await notification.save();
    res.json(notification);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH: Mark notification as read
exports.markNotificationAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    // Optional: Check if it belongs to the logged-in user
    if (notification.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    notification.isRead = true;
    await notification.save();
    res.json({ message: "Notification marked as read" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
