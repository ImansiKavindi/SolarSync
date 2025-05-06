const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true },   // Added email field
  password: { type: String, required: true },
  role: { type: String, required: true }      // Added role field
}, { collection: 'admin' });   // Explicitly pointing to 'admin' collection

module.exports = mongoose.model('Admin', adminSchema);
