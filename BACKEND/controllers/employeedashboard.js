// controllers/dashboardController.js
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

exports.updateProfile = async (req, res) => {
  try {
    const { username, password, ...otherDetails } = req.body;
    const updates = { ...otherDetails };

    if (username) updates.username = username;
    if (password) updates.password = await bcrypt.hash(password, 10);

    // Handle file uploads if present
    if (req.files) {
      if (req.files.cv && req.files.cv[0]) {
        updates.cv = req.files.cv[0].path;
      }
      if (req.files.profileImage && req.files.profileImage[0]) {
        updates.profileImage = req.files.profileImage[0].path;
      }
    }

    const updated = await Employee.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({ message: 'Profile updated successfully', updated });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.markAttendance = async (req, res) => {
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
      const month = new Date(client.createdAt).toLocaleString('default', { month: 'short', year: 'numeric' });
      if (!monthlyStats[month]) {
        monthlyStats[month] = { count: 0, commission: 0 };
      }
      monthlyStats[month].count += 1;
      monthlyStats[month].commission += (client.project_cost || 0) * 0.04;
    });

    res.json(monthlyStats);
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
