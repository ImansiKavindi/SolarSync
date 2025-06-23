const Client = require('../models/Client');
const Employee = require('../models/Employee'); // Your full profile model

exports.getEmployeeDashboardData = async (req, res) => {
  try {
    const employeeId = req.user.id;

    const profile = await Employee.findOne({ employee_id: employeeId }).select('-__v');
    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    const clients = await Client.find({ employee_id: employeeId });

    const totalClients = clients.length;
    const totalProjectCost = clients.reduce((sum, client) => sum + parseFloat(client.project_cost || 0), 0);
    const totalCommission = totalProjectCost * 0.04;

    // Monthly project cost breakdown
    const monthlyProjectData = {};
    clients.forEach(client => {
      const month = new Date(client.date).toLocaleString('default', { month: 'short', year: 'numeric' });
      monthlyProjectData[month] = (monthlyProjectData[month] || 0) + parseFloat(client.project_cost || 0);
    });

    res.status(200).json({
      profile,
      totalClients,
      totalCommission,
      monthlyProjectData,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch dashboard data', error: err.message });
  }
};

exports.getEmployeeProfile = async (req, res) => {
  try {
    const employeeId = req.user.id;
    const profile = await EmployeeList.findOne({ employee_id: employeeId }).select('-__v');
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.status(200).json({ profile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch profile', error: err.message });
  }
};

exports.updateEmployeeProfile = async (req, res) => {
  try {
    const employeeId = req.user.id;
    const updatedData = req.body;

    // If image uploaded, save the path
    if (req.file) {
      updatedData.profileImage = `/uploads/${req.file.filename}`;
    }

    const updatedProfile = await EmployeeList.findOneAndUpdate(
      { employee_id: employeeId },
      updatedData,
      { new: true, runValidators: true }
    ).select('-__v');

    if (!updatedProfile) return res.status(404).json({ message: 'Profile not found' });

    res.status(200).json({ message: 'Profile updated', profile: updatedProfile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update profile', error: err.message });
  }
};
