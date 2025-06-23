const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  name: { type: String, required: true },
  address: { type: String, required: true },
  workEmail: { type: String, required: true },
  personalEmail: { type: String, required: true },
  workMobileNumber: { type: String, required: true },
  personalMobileNumber: { type: String, required: true },
  position: { type: String, required: true },
  department: { type: String, required: true },

  cv: { type: String }, // file path to CV
  profileImage: { type: String }, // file path to profile image

  bankDetails: {
    bankName: { type: String },
    branch: { type: String },
    accountNumber: { type: String },
    accountHolderName: { type: String }
  }
}, { 
  timestamps: true,
  collection: 'employees' // specify collection name here
});

module.exports = mongoose.model('Employee', employeeSchema);
