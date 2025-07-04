const mongoose = require('mongoose');

const LeaveRequestSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  fromDate: {
    type: Date,
    required: true,
  },
  toDate: {
    type: Date,
  },
  leaveType: {
    type: String,
    enum: ['Full Day', 'Half Day'],
    default: 'Full Day',
  },
  halfDayType: {
    type: String,
    enum: ['Morning', 'Afternoon'],
    required: function () {
      return this.leaveType === 'Half Day';
    },
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected', 'CancelledByEmployee', 'CancelledByHR'],
    default: 'Pending',
  },
  cancelReason: {
    type: String,
  },
  cancelledAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update `updatedAt` automatically
LeaveRequestSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('LeaveRequest', LeaveRequestSchema);
