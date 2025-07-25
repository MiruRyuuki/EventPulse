// controllers/attendanceController.js

const Attendance = require('../models/Attendance');
const QRCode = require('qrcode');

// ✅ 1. QR Code Generator
const generateQR = async (req, res) => {
  const { userId, eventId } = req.query;

  if (!userId || !eventId) {
    return res.status(400).json({ message: 'Missing userId or eventId' });
  }

  const qrData = JSON.stringify({ userId, eventId });

  try {
    const qrCodeImageUrl = await QRCode.toDataURL(qrData);
    res.status(200).json({ qrCodeImageUrl });
  } catch (error) {
    console.error('QR code generation failed:', error);
    res.status(500).json({ message: 'Failed to generate QR code' });
  }
};

// ✅ 2. Attendance Marker
const markAttendance = async (req, res) => {
  try {
    const { userId, eventId } = req.body;

    if (!userId || !eventId) {
      return res.status(400).json({ message: 'Missing userId or eventId' });
    }

    const newAttendance = new Attendance({
      user: userId,
      event: eventId
    });

    await newAttendance.save();

    res.status(201).json({ message: 'Attendance marked successfully' });
  } catch (err) {
    console.error('Attendance error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  markAttendance,
  generateQR // ✅ Don't forget to export this!
};
