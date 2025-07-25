// controllers/qrController.js

const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');

exports.generateQRCode = async (req, res) => {
  const { userId, eventId } = req.body;

  if (!userId || !eventId) {
    return res.status(400).json({ message: 'Missing userId or eventId' });
  }

  try {
    // Combine userId + eventId into a payload
    const qrData = JSON.stringify({ userId, eventId });

    // File name and path
    const fileName = `${userId}-${eventId}-qr.png`;
    const filePath = path.join(__dirname, '../uploads', fileName);

    // Generate QR code and write to file
    await QRCode.toFile(filePath, qrData);

    res.status(200).json({
      message: 'QR code generated',
      fileName: fileName,
      qrUrl: `/uploads/${fileName}`
    });
  } catch (err) {
    console.error('QR Generation Error:', err);
    res.status(500).json({ message: 'Failed to generate QR code' });
  }
};
