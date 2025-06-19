// models/Employee.js

const mongoose = require('mongoose');

const employeelistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  workEmail: { type: String, required: true },
  personalEmail: { type: String, required: true },
  workMobileNumber: { type: String, required: true },
  personalMobileNumber: { type: String, required: true },
  position: { type: String, required: true },
  department: { type: String, required: true },
  cv: { type: String }, 
  profileImage: { type: String }, 
  bankDetails: {
    bankName: { type: String },
    branch: { type: String },
    accountNumber: { type: String },
    accountHolderName: { type: String }
  },
}, { timestamps: true });

const Employeelist = mongoose.model('Employeelist', employeelistSchema);

module.exports = Employeelist;
