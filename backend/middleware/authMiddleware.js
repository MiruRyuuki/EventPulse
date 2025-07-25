// backend/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      next(); // If user is authenticated, proceed with the route
    } catch (err) {
      res.status(401).json({ message: "Invalid token" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

// Role-based access control for organizer routes
const isOrganizer = (req, res, next) => {
  if (req.user.role !== "organizer") {
    return res.status(403).json({ message: "Not authorized as an organizer" });
  }
  next();
};

// Role-based access control for speaker routes
const isSpeaker = (req, res, next) => {
  if (req.user.role !== "speaker") {
    return res.status(403).json({ message: "Not authorized as a speaker" });
  }
  next();
};

// Check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Not authorized as admin" });
  }
  next();
};

module.exports = { protect, isOrganizer, isSpeaker, isAdmin};


