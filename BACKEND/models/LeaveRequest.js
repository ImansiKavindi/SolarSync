// models/LeaveRequest.js
const mongoose = require('mongoose');

const leaveRequestSchema = new mongoose.Schema({
  employeeId: String,
  fromDate: String,
  toDate: String,
  reason: String,
  status: { type: String, default: 'Pending' } // Pending | Accepted | Rejected
});

module.exports = mongoose.model('LeaveRequest', leaveRequestSchema);
