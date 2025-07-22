const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: String,
  password: { type: String, required: true },
  role: { type: String, enum: ['Organizer', 'Speaker', 'Attendee', 'Reviewer', 'Admin'] }
});

module.exports = mongoose.model('User', userSchema);
