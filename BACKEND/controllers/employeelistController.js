
const Employeelist = require('../models/Employeelist');

// Add Employee (Admin only)
const addEmployee = async (req, res) => {
  try {
    const {
      name,
      address,
      workEmail,
      personalEmail,
      workMobileNumber,
      personalMobileNumber,
      position,
      department,
    } = req.body;

    let bankDetails = {};
    if (req.body.bankDetails) {
      try {
        bankDetails = JSON.parse(req.body.bankDetails);
      } catch (err) {
        console.error('Error parsing bankDetails JSON:', err);
      }
    }

    const cv = req.files?.cv ? req.files.cv[0].path : undefined;
    const profileImage = req.files?.profileImage ? req.files.profileImage[0].path : undefined;

    const newEmployee = new Employeelist({
      name,
      address,
      workEmail,
      personalEmail,
      workMobileNumber,
      personalMobileNumber,
      position,
      department,
      bankDetails,  // correctly parsed object here
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

const editEmployee = async (req, res) => {
  const { id } = req.params;

  const {
    name,
    address,
    workEmail,
    personalEmail,
    workMobileNumber,
    personalMobileNumber,
    position,
    department,
  } = req.body;

  let bankDetails = {};
  if (req.body.bankDetails) {
    try {
      bankDetails = JSON.parse(req.body.bankDetails);
    } catch (error) {
      console.error('Failed to parse bankDetails JSON:', error);
    }
  }

  const updateData = {
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

  if (req.files?.cv) {
    updateData.cv = req.files.cv[0].path;
  }

  if (req.files?.profileImage) {
    updateData.profileImage = req.files.profileImage[0].path;
  }

  try {
    const updatedEmployee = await Employeelist.findByIdAndUpdate(id, updateData, {
      new: true,
    });

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


// Get All Employees (Admin only)
const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employeelist.find(); // You can add filters if needed
    res.status(200).json(employees);
  } catch (err) {
    console.error('Error fetching employees:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = { addEmployee, viewEmployee, editEmployee, deleteEmployee, getAllEmployees };