const User = require("../models/User");
const Event = require("../models/Event");
const Attendance = require("../models/Attendance");
const Payment = require("../models/Payment");

exports.getAdminReport = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const attendees = await User.countDocuments({ role: "attendee" });
    const organizers = await User.countDocuments({ role: "organizer" });
    const speakers = await User.countDocuments({ role: "speaker" });

    const totalEvents = await Event.countDocuments();
    const totalAttendance = await Attendance.countDocuments();

    const payments = await Payment.find({});
    const totalTransactions = payments.length;
    const totalCollected = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

    res.status(200).json({
      users: {
        total: totalUsers,
        attendees,
        organizers,
        speakers
      },
      events: totalEvents,
      attendance: totalAttendance,
      payments: {
        totalTransactions,
        totalCollected: totalCollected.toFixed(2)
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error generating report", error: error.message });
  }
};
exports.getEventPayments = async (req, res) => {
  const eventId = req.params.eventId;

  try {
    const payments = await Payment.find({ event: eventId });

    const completedPayments = payments.filter(payment => payment.status === 'paid');
    const pendingPayments = payments.filter(payment => payment.status === 'pending');
    const awaitingVerification = payments.filter(payment => payment.status === 'awaiting-verification');

    res.json({
      completedPayments,
      pendingPayments,
      awaitingVerification
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
