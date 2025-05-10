// controllers/employeeController.js
const Employeelist = require('../models/Employeelist');

// Add Employee (Admin only)
const addEmployee = async (req, res) => {
  const { name, address, workEmail, personalEmail, workMobileNumber, personalMobileNumber, position, department, cv, profileImage } = req.body;

  try {
    const newEmployee = new Employeelist({
      name,
      address,
      workEmail,
      personalEmail,
      workMobileNumber,
      personalMobileNumber,
      position,
      department,
      cv,
      profileImage,
    });

    await newEmployee.save();
    res.status(201).json(newEmployee);
  } catch (err) {
    console.error('Error adding employee:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// View Employee Profile
const viewEmployee = async (req, res) => {
  const { id } = req.params;

  try {
    const employee = await Employeelist.findById(id);

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json(employee);
  } catch (err) {
    console.error('Error fetching employee:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Edit Employee Profile
const editEmployee = async (req, res) => {
  const { id } = req.params;
  const { name, address, workEmail, personalEmail, workMobileNumber, personalMobileNumber, position, department, cv, profileImage } = req.body;

  try {
    const updatedEmployee = await Employeelist.findByIdAndUpdate(
      id,
      {
        name,
        address,
        workEmail,
        personalEmail,
        workMobileNumber,
        personalMobileNumber,
        position,
        department,
        cv,
        profileImage,
      },
      { new: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json(updatedEmployee);
  } catch (err) {
    console.error('Error updating employee:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete Employee Profile
const deleteEmployee = async (req, res) => {
  const { id } = req.params;

  try {
    const employee = await Employeelist.findByIdAndDelete(id);

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (err) {
    console.error('Error deleting employee:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { addEmployee, viewEmployee, editEmployee, deleteEmployee };
