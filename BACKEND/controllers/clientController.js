const Client = require('../models/Client');

// ✅ Add new client (accessible by both Admin and Employee)
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
      employee_id: req.user.id, // Automatically attach logged-in user's ID
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

// ✅ Get clients of logged-in employee only
exports.getMyClients = async (req, res) => {
  try {
    const clients = await Client.find({ employee_id: req.user.id });
    res.status(200).json(clients);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ✅ Get all clients (Admin only, defined in route middleware)
exports.getAllClients = async (req, res) => {
  try {
    const clients = await Client.find().populate('employee_id', 'name email');
    res.status(200).json(clients);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ✅ Admin only: Update project status
exports.updateProjectStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'accepted', 'declined', 'ongoing', 'completed'];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid or missing status' });
    }

    const client = await Client.findByIdAndUpdate(
      req.params.id,
      { project_status: status },
      { new: true }
    );

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    res.status(200).json({ message: 'Project status updated successfully', client });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ✅ Update client info
exports.updateClientInfo = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    // 🚫 Employee can only update their own clients
    if (req.user.role === 'employee' && client.employee_id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden: You can only update your own clients' });
    }

    // 🚫 Prevent employee from updating project_status directly
    if (req.user.role === 'employee' && 'project_status' in req.body) {
      return res.status(403).json({ message: 'Forbidden: Employees cannot update project status' });
    }

    // ✅ Allowed fields for updating
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

    let hasUpdates = false;
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        client[field] = req.body[field];
        hasUpdates = true;
      }
    });

    if (!hasUpdates) {
      return res.status(400).json({ message: 'No valid fields provided for update' });
    }

    await client.save();
    res.status(200).json({ message: 'Client updated successfully', client });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
