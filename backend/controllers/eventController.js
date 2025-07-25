// backend/controllers/eventController.js

const Event = require("../models/Event");
const Attendance = require("../models/Attendance");

// GET: All Events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().populate("registeredUsers", "name email");
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST: Create New Event (for testing only)
exports.createEvent = async (req, res) => {
  try {
    const { totalSeats } = req.body;

    // Calculate seats left when creating the event
    const seatsLeft = totalSeats;  // Initially, all seats are available

    // Create the new event with the calculated seatsLeft
    const event = await Event.create({ ...req.body, Seatsleft: seatsLeft });

    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// POST: Register for an event
exports.registerForEvent = async (req, res) => {
  const eventId = req.params.id;
  const userId = req.user._id;

  try {
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.registeredUsers.includes(userId)) {
      return res.status(400).json({ message: "Already registered" });
    }

    if (event.Seatsleft <= 0) {
      return res.status(400).json({ message: "No seats left" });
    }

    // Register the user and decrement the seats left
    event.registeredUsers.push(userId);
    event.Seatsleft -= 1;  // Decrease available seats by 1
    await event.save();

    res.json({ message: "Successfully registered", event });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET: Registered events for logged-in user
exports.getRegisteredEvents = async (req, res) => {
  const userId = req.user._id;

  try {
    const events = await Event.find({ registeredUsers: userId });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE: Delete an event by ID (Only accessible by organizers)
exports.deleteEvent = async (req, res) => {
  const eventId = req.params.id; // Get the event _id from params

  try {
    // Check if the event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Delete the event
    await event.deleteOne();
    
    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
  
};
// GET: Registered vs Attended for an event
exports.getRegisteredVsAttended = async (req, res) => {
  const { eventId } = req.params;  // Get the event ID from the URL params

  try {
    // Get total registered users for the event
    const event = await Event.findById(eventId).populate("registeredUsers");

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Count registered users
    const totalRegistered = event.registeredUsers.length;

    // Count attendees who have marked attendance
    const totalAttended = await Attendance.countDocuments({ event: eventId });

    const result = {
      totalRegistered,
      totalAttended,
      totalAbsentees: totalRegistered - totalAttended
    };

    res.status(200).json(result);
  } catch (err) {
    console.error('Error fetching event attendance data:', err);
    res.status(500).json({ message: 'Error fetching event attendance data' });
  }
};
// backend/controllers/eventController.js

exports.createEvent = async (req, res) => {
  try {
    const { totalSeats, price } = req.body;

    // Calculate seats left when creating the event
    const seatsLeft = totalSeats;  // Initially, all seats are available

    // Create the new event with the calculated seatsLeft and price
    const event = await Event.create({ ...req.body, Seatsleft: seatsLeft, price });

    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

