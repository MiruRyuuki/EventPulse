// backend/controllers/authController.js

const User = require("../models/User");
const generateToken = require("../utils/generateToken");

exports.register = async (req, res) => {
  const { name, email, password, role, number } = req.body; // Accepting 'number' in the request body

  // Check if role is valid
  if (!role || !['attendee', 'organizer', 'speaker', 'admin'].includes(role)) {
    return res.status(400).json({ message: "Invalid role selected" }); // Validate role
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    // Create a new user with the provided role and number
    const user = await User.create({ name, email, password, role, number });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,  // Include role in response
      number: user.number,  // Include number in response
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,  // Include role in response
        number: user.number,  // Include number in response
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET: View user profile by ID
exports.getProfile = async (req, res) => {
  const userId = req.params.id;  // User ID from the URL parameter

  try {
    const user = await User.findById(userId).select("-password");  // Fetch user without password

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,  // User role (attendee, organizer, speaker, admin, reviewer)
      number: user.number,  // User number
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
