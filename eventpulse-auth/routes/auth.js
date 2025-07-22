const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Login Route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username, password });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    res.json({ message: 'Login successful', role: user.role });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Register Route
router.post('/register', async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const newUser = new User({ username, email, password, role });
    await newUser.save();
    res.status(201).json({ message: 'User registered', role });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
