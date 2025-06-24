const Employee = require('../models/Employee');
const bcrypt = require('bcrypt');

// Add Employee (Admin only)
const addEmployee = async (req, res) => {
  console.log('BODY:', req.body);
console.log('FILES:', req.files);
  try {
    const {
      username,
      password, // make sure password is hashed before saving (use bcrypt or similar)
      name,
      address,
      workEmail,
      personalEmail,
      workMobileNumber,
      personalMobileNumber,
      position,
      department,
      bankDetails, // send as JSON object from frontend
    } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // ✅ Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Parse bankDetails safely
    let parsedBankDetails = {};
    try {
      parsedBankDetails = JSON.parse(bankDetails);
    } catch (err) {
      return res.status(400).json({ message: 'Invalid bank details format' });
    }

    const cv = req.files?.cv ? req.files.cv[0].path : undefined;
    const profileImage = req.files?.profileImage ? req.files.profileImage[0].path : undefined;

    const newEmployee = new Employee({
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
      bankDetails: parsedBankDetails,
      cv,
      profileImage,
    });

    await newEmployee.save();
    res.status(201).json(newEmployee);
  } catch (err) {
    console.error('Error adding employee:', err);
    res.status(500).json({ message: 'Server error' });
    res.status(500).json({ message: 'Server error', error: err.message });

  }
};

// View Employee Profile
const viewEmployee = async (req, res) => {
  const { id } = req.params;

  try {
    const employee = await Employee.findById(id);

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json(employee);
  } catch (err) {
    console.error('Error fetching employee:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Edit Employee
const editEmployee = async (req, res) => {
  const { id } = req.params;

  const {
    username,
    password, // handle password update carefully; hash if updated
    name,
    address,
    workEmail,
    personalEmail,
    workMobileNumber,
    personalMobileNumber,
    position,
    department,
    bankDetails,
  } = req.body;

  const updateData = {
    username,
    name,
    address,
    workEmail,
    personalEmail,
    workMobileNumber,
    personalMobileNumber,
    position,
    department,
    bankDetails,
  };

  // Only update password if provided
  if (password) {
    updateData.password = password; // Hash before saving in production
  }

  if (req.files?.cv) {
    updateData.cv = req.files.cv[0].path;
  }

  if (req.files?.profileImage) {
    updateData.profileImage = req.files.profileImage[0].path;
  }

  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json(updatedEmployee);
  } catch (err) {
    console.error('Error updating employee:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete Employee
const deleteEmployee = async (req, res) => {
  const { id } = req.params;

  try {
    const employee = await Employee.findByIdAndDelete(id);

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (err) {
    console.error('Error deleting employee:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get All Employees
const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (err) {
    console.error('Error fetching employees:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { addEmployee, viewEmployee, editEmployee, deleteEmployee, getAllEmployees };
