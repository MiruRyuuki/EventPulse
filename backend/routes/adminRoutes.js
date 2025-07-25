const express = require("express");
const router = express.Router();
const { protect, isAdmin } = require("../middleware/authMiddleware");
const { getAdminReport } = require("../controllers/adminController");
const { getEventPayments } = require("../controllers/adminController");

router.get("/report", protect, isAdmin, getAdminReport);
router.get("/payments/:eventId", getEventPayments);
module.exports = router;
