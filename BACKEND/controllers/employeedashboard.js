

const Client = require('../models/Client');
const Employee = require('../models/Employee'); // Adjust path if needed

exports.getEmployeeDashboardData = async (req, res) => {
  try {
    const employeeId = req.user.id; // comes from the JWT middleware

    // Get employee basic info
    const employee = await Employee.findById(employeeId).select('name email role');

    // Get clients assigned to this employee
    const clients = await Client.find({ employee_id: employeeId });

    const totalClients = clients.length;

    const totalProjectCost = clients.reduce((sum, client) => {
      const cost = parseFloat(client.project_cost || 0);
      return sum + cost;
    }, 0);

    const totalCommission = totalProjectCost * 0.04;

    res.status(200).json({
      employee,
      totalClients,
      totalProjectCost,
      totalCommission,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch dashboard data', error: err.message });
  }
};
