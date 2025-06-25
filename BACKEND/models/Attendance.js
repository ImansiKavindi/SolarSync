const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
  },
  date: {
    type: String, // YYYY-MM-DD
    required: true,
  },
  arrivalTime: {
    type: String, // store time as "HH:mm:ss" or full ISO string if you prefer
    required: false,
  },
  leaveTime: {
    type: String,
    required: false,
  }
}, {
  timestamps: true,
});

attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
