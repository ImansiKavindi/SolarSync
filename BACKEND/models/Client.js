const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  employee_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Employeelist', required: true },
  client_name: String,
  address: String,
  contact_number: String,
  email: String,
  utility_company: String, // CEB / LECO
  date: Date,
  system_type: { type: String, enum: ['on grid', 'off grid', 'hybrid'] },
  grid_connectivity: { type: String, enum: ['net accounting', 'net metering', 'net plus'] },
  system_capacity: String,
  project_status: { 
    type: String, 
    enum: ['pending', 'accepted', 'declined', 'ongoing', 'completed'], 
    default: 'pending' 
  },
   project_cost: Number,
}, { timestamps: true });

module.exports = mongoose.model('Client', clientSchema);
