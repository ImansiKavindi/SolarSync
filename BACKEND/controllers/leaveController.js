const LeaveRequest = require('../models/LeaveRequest');

// ✅ Employee submits leave request
exports.submitLeave = async (req, res) => {
  try {
    const { reason, fromDate, toDate } = req.body;
    const employeeId = req.user.id;

    const leave = new LeaveRequest({
      employee: employeeId,
      reason,
      fromDate,
      toDate
    });

    await leave.save();
    res.status(201).json({ message: 'Leave request submitted', leave });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ✅ Admin updates leave status
exports.updateLeaveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const leave = await LeaveRequest.findByIdAndUpdate(id, { status }, { new: true }).populate('employee', 'name');

    if (!leave) return res.status(404).json({ message: 'Leave not found' });

    res.json({ message: `Leave ${status.toLowerCase()}`, leave });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ✅ Employee views their own leave requests
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
