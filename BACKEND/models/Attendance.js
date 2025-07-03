const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
  },
  date: {
    type: String, // Store date as YYYY-MM-DD
    required: true,
  },
  arrivalTime: {
    type: Date,
    required: false,
  },
  leaveTime: {
    type: Date,
    required: false,
  },
  arrivalLocation: {
    latitude: { type: Number },
    longitude: { type: Number },
  },
  leaveLocation: {
    latitude: { type: Number },
    longitude: { type: Number },
  }
}, {
  timestamps: true,
});

attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
