const Client = require('../models/Client');

exports.addClient = async (req, res) => {
  try {
    const {
      client_name,
      address,
      contact_number,
      email,
      utility_company,
      date,
      system_type,
      grid_connectivity,
      system_capacity,
       project_cost,
    } = req.body;

    const client = new Client({
      employee_id: req.user.id,
      client_name,
      address,
      contact_number,
      email,
      utility_company,
      date,
      system_type,
      grid_connectivity,
      system_capacity,
       project_cost,
    });

    await client.save();
    res.status(201).json({ message: 'Client project added successfully', client });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getMyClients = async (req, res) => {
  try {
    const clients = await Client.find({ employee_id: req.user.id });
    res.status(200).json(clients);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all clients - Admin only
exports.getAllClients = async (req, res) => {
  try {
    const clients = await Client.find().populate('employee_id', 'name email');
    res.status(200).json(clients);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};




exports.updateProjectStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'accepted', 'declined', 'ongoing', 'completed'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const client = await Client.findByIdAndUpdate(
      req.params.id,
      { project_status: status },
      { new: true }
    );

    if (!client) return res.status(404).json({ message: 'Client not found' });

    res.status(200).json({ message: 'Status updated', client });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};



exports.updateClientInfo = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    // If user is employee, check if this client belongs to them
    if (req.user.role === 'employee' && client.employee_id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden: You can only update your own clients' });
    }

    // Update allowed fields
    const allowedUpdates = [
      'client_name',
      'address',
      'contact_number',
      'email',
      'utility_company',
      'date',
      'system_type',
      'grid_connectivity',
      'system_capacity',
       'project_cost'
    ];

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        client[field] = req.body[field];
      }
    });

    await client.save();
    res.json({ message: 'Client updated successfully', client });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
