
const Employee = require('../models/Employee');
const Client = require('../models/Client');
const Attendance = require('../models/Attendance');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');



exports.getDashboardInfo = async (req, res) => {
  try {
    const employee = await Employee.findById(req.user.id).select('-password');
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    const clients = await Client.find({ employee_id: req.user.id });
    const totalClients = clients.length;
    const totalCommission = clients.reduce((sum, c) => sum + (c.project_cost || 0) * 0.04, 0);

    res.status(200).json({
      employee,
      stats: {
        totalClients,
        totalCommission
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Edit Employee
const updateProfile = async (req, res) => {
  console.log('--- Incoming updateProfile request ---');
  console.log('req.body:', req.body);
  console.log('req.files:', req.files);

  const id = req.user.id;
  const {
    username,
    password,
    name,
    address,
    workEmail,
    personalEmail,
    workMobileNumber,
    personalMobileNumber,
    position,
    department,
    bankDetails
  } = req.body;

  const updateData = {};
  if (username) updateData.username = username;
  if (name) updateData.name = name;
  if (address) updateData.address = address;
  if (workEmail) updateData.workEmail = workEmail;
  if (personalEmail) updateData.personalEmail = personalEmail;
  if (workMobileNumber) updateData.workMobileNumber = workMobileNumber;
  if (personalMobileNumber) updateData.personalMobileNumber = personalMobileNumber;
  if (position) updateData.position = position;
  if (department) updateData.department = department;

  if (password) {
    updateData.password = await bcrypt.hash(password, 10);
  }

  if (req.files?.cv) {
    updateData.cv = req.files.cv[0].path;
  }

  if (req.files?.profileImage) {
    updateData.profileImage = req.files.profileImage[0].path;
  }

  if (bankDetails) {
    try {
      const parsed = typeof bankDetails === 'string' ? JSON.parse(bankDetails) : bankDetails;
      updateData.bankDetails = parsed;
    } catch (e) {
      return res.status(400).json({ message: 'Invalid bank details format' });
    }
  }

  console.log('🔁 Final updateData:', updateData);

  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedEmployee) return res.status(404).json({ message: 'Employee not found' });
    res.status(200).json(updatedEmployee);
  } catch (err) {
    console.error('❌ Error updating employee:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.updateProfile = updateProfile;


/*exports.markAttendance = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const alreadyMarked = await Attendance.findOne({ employee: req.user.id, date: today });
    if (alreadyMarked) return res.status(400).json({ message: 'Attendance already marked for today' });

    const record = new Attendance({ employee: req.user.id, date: today });
    await record.save();
    res.status(201).json({ message: 'Attendance marked successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};*/

exports.markArrival = async (req, res) => {
  const employeeId = req.user.id;
  const today = new Date().toISOString().split('T')[0];
  const nowTime = new Date().toISOString(); // Or just time part if you prefer

  try {
    const attendance = await Attendance.findOne({ employee: employeeId, date: today });
    if (attendance) {
      return res.status(400).json({ message: 'Arrival already marked for today' });
    }

    await Attendance.create({
      employee: employeeId,
      date: today,
      arrivalTime: nowTime
    });

    res.status(200).json({ message: 'Arrival time marked', arrivalTime: nowTime });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.markLeave = async (req, res) => {
  const employeeId = req.user.id;
  const today = new Date().toISOString().split('T')[0];
  const nowTime = new Date().toISOString();

  try {
    const attendance = await Attendance.findOne({ employee: employeeId, date: today });
    if (!attendance) {
      return res.status(400).json({ message: 'Arrival not marked yet' });
    }
    if (attendance.leaveTime) {
      return res.status(400).json({ message: 'Leave already marked for today' });
    }

    attendance.leaveTime = nowTime;
    await attendance.save();

    res.status(200).json({ message: 'Leave time marked', leaveTime: nowTime });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAttendance = async (req, res) => {
  try {
    const records = await Attendance.find({ employee: req.user.id }).sort({ date: -1 });
    res.status(200).json(records);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


exports.getStatsForCharts = async (req, res) => {
  try {
    const clients = await Client.find({ employee_id: req.user.id });

    const monthlyStats = {};

    clients.forEach(client => {
      const date = new Date(client.createdAt);
      const key = `${date.getFullYear()}-${date.getMonth() + 1}`; // e.g., "2025-6"
      if (!monthlyStats[key]) {
        monthlyStats[key] = { count: 0, commission: 0, date };
      }
      monthlyStats[key].count += 1;
      monthlyStats[key].commission += (client.project_cost || 0) * 0.04;
    });

    // Sort keys by date
    const sortedKeys = Object.keys(monthlyStats).sort(
      (a, b) => new Date(monthlyStats[a].date) - new Date(monthlyStats[b].date)
    );

    const months = [];
    const clientCounts = [];
    const commissions = [];

    sortedKeys.forEach(key => {
      const entry = monthlyStats[key];
      const monthLabel = entry.date.toLocaleString('default', { month: 'short', year: 'numeric' }); // "Jun 2025"
      months.push(monthLabel);
      clientCounts.push(entry.count);
      commissions.push(parseFloat(entry.commission.toFixed(2)));
    });

    res.json({ months, clientCounts, commissions });
  } catch (err) {
    res.status(500).json({ message: 'Failed to get chart data', error: err.message });
  }
};



exports.calculateSolarEstimate = async (req, res) => {
  try {
    const { dailyUsageKWh, sunHoursPerDay, panelWattage } = req.body;

    if (!dailyUsageKWh || !sunHoursPerDay || !panelWattage) {
      return res.status(400).json({ message: 'Missing required inputs' });
    }

    // Example logic
    const requiredKW = dailyUsageKWh / sunHoursPerDay;
    const numberOfPanels = Math.ceil((requiredKW * 1000) / panelWattage);

    res.json({
      requiredKW: requiredKW.toFixed(2),
      numberOfPanels,
    });
  } catch (err) {
    res.status(500).json({ message: 'Calculation error', error: err.message });
  }
};
