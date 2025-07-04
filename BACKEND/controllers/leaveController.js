const LeaveRequest = require('../models/LeaveRequest');

// ✅ Employee submits leave request (supports Half Day)
exports.submitLeave = async (req, res) => {
  try {
    const { reason, fromDate, toDate, leaveType, halfDayType } = req.body;
    const employeeId = req.user.id;

    if (leaveType === 'Half Day' && !halfDayType) {
      return res.status(400).json({ message: 'halfDayType is required for Half Day leave' });
    }

    const leave = new LeaveRequest({
      employee: employeeId,
      reason,
      fromDate,
      toDate,
      leaveType: leaveType || 'Full Day',
      halfDayType: leaveType === 'Half Day' ? halfDayType : undefined,
    });

    await leave.save();
    res.status(201).json({ message: 'Leave request submitted', leave });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ✅ Admin updates leave status (Approve / Reject / Cancel by HR)
exports.updateLeaveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Approved', 'Rejected', 'CancelledByHR'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const update = { status };
    if (status === 'CancelledByHR') {
      update.cancelledAt = new Date();
    }

    const leave = await LeaveRequest.findByIdAndUpdate(id, update, { new: true }).populate('employee', 'name');

    if (!leave) return res.status(404).json({ message: 'Leave not found' });

    res.json({ message: `Leave ${status.toLowerCase()}`, leave });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ✅ Employee cancels their own approved/pending leave
exports.cancelLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const { cancelReason } = req.body;
    const employeeId = req.user.id;

    const leave = await LeaveRequest.findById(id);

    if (!leave) {
      return res.status(404).json({ message: 'Leave not found' });
    }

    if (leave.employee.toString() !== employeeId) {
      return res.status(403).json({ message: 'Unauthorized to cancel this leave' });
    }

    if (!['Pending', 'Approved'].includes(leave.status)) {
      return res.status(400).json({ message: 'Only pending or approved leaves can be cancelled' });
    }

    const today = new Date();
    if (new Date(leave.fromDate) <= today) {
      return res.status(400).json({ message: 'Cannot cancel past or ongoing leaves' });
    }

    leave.status = 'CancelledByEmployee';
    leave.cancelReason = cancelReason || 'No reason provided';
    leave.cancelledAt = new Date();

    await leave.save();
    res.json({ message: 'Leave cancelled successfully', leave });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ✅ Employee views their own leaves
exports.getMyLeaves = async (req, res) => {
  try {
    const leaves = await LeaveRequest.find({ employee: req.user.id }).sort({ createdAt: -1 });
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ✅ Admin views all leave requests
exports.getAllLeaves = async (req, res) => {
  try {
    const leaves = await LeaveRequest.find().populate('employee', 'name email').sort({ createdAt: -1 });
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
