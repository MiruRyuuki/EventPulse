// routes/attendanceRoutes.js

const express = require('express');
const router = express.Router();
const { markAttendance , generateQR } = require('../controllers/attendanceController');

router.post('/scan', markAttendance);
router.get('/generate-qr', generateQR);

module.exports = router;
