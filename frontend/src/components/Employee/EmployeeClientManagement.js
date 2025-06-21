import React, { useEffect, useState } from 'react';
import '../../styles/EmployeeManagement.css'; // Reusing styles
import { getMyClients, addClient, updateClient } from '../../shared/api';

const emptyClient = {
  client_name: '',
  address: '',
  contact_number: '',
  email: '',
  utility_company: '',
  date: '',
  system_type: '',
  grid_connectivity: '',
  system_capacity: '',
  project_cost: '',
};

const EmployeeClientManagement = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editClient, setEditClient] = useState(null);
  const [expandedRows, setExpandedRows] = useState([]);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await getMyClients(token);
      setClients(res.data);
      setError('');
    } catch {
      setError('Failed to fetch clients');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const toggleRow = (id) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const openAddModal = () => {
    setEditClient(null);
    setShowModal(true);
  };

  const openEditModal = (client) => {
    setEditClient(client);
    setShowModal(true);
  };

  const handleFormSubmit = async (formData) => {
    const token = localStorage.getItem('token');
    try {
      if (editClient) {
        await updateClient(editClient._id, formData, token);
      } else {
        await addClient(formData, token);
      }
      setShowModal(false);
      fetchClients();
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to save client');
    }
  };

  return (
    <div className="employee-management-container">
      <h2>Client Management</h2>
      <button className="btn-addemployee" onClick={openAddModal}>
        Add New Client
      </button>

      {loading && <p>Loading clients...</p>}
      {error && <p className="error">{error}</p>}

      <table className="employee-table">
        <thead>
          <tr>
            <th></th>
            <th>Client Name</th>
            <th>Contact</th>
            <th>Email</th>
            <th>System Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <React.Fragment key={client._id}>
              <tr>
                <td>
                  <button className="expand-btn" onClick={() => toggleRow(client._id)}>
                    {expandedRows.includes(client._id) ? '-' : '+'}
                  </button>
                </td>
                <td>{client.client_name}</td>
                <td>{client.contact_number}</td>
                <td>{client.email}</td>
                <td>{client.system_type}</td>
                <td>
                  <button className="btn-edit" onClick={() => openEditModal(client)}>
                    Update
                  </button>
                </td>
              </tr>
              {expandedRows.includes(client._id) && (
                <tr className="expanded-row">
                  <td colSpan="6">
                    <div className="expanded-content improved-layout">
                      <div className="top-section">
                        {/* Client Info */}
                        <div className="info-column">
                          <h3>Client Info</h3>
                          <div><strong>Name:</strong> {client.client_name}</div>
                          <div><strong>Address:</strong> {client.address}</div>
                          <div><strong>Contact:</strong> {client.contact_number}</div>
                          <div><strong>Email:</strong> {client.email}</div>
                          <div><strong>Date:</strong> {client.date?.substring(0,10)}</div>
                        </div>

                        {/* System Info */}
                        <div className="info-column">
                          <h3>System Info</h3>
                          <div><strong>System Type:</strong> {client.system_type}</div>
                          <div><strong>Grid Connectivity:</strong> {client.grid_connectivity}</div>
                          <div><strong>Capacity:</strong> {client.system_capacity} kW</div>
                          <div><strong>Project Cost:</strong> ${client.project_cost}</div>
                          <div><strong>Utility Company:</strong> {client.utility_company}</div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {showModal && (
        <AddEditClientModal
          client={editClient}
          onClose={() => setShowModal(false)}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
};

export default EmployeeClientManagement;

// =====================
// Add/Edit Client Modal
// =====================

const AddEditClientModal = ({ client, onClose, onSubmit }) => {
  const emptyClient = {
    client_name: '',
    address: '',
    contact_number: '',
    email: '',
    utility_company: '',
    date: '',
    system_type: '',
    grid_connectivity: '',
    system_capacity: '',
    project_cost: '',
  };

  const [formData, setFormData] = useState(emptyClient);

  useEffect(() => {
    if (client) {
      setFormData({ ...emptyClient, ...client });
    }
  }, [client]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal employee-modal">
        <h3>{client ? 'Edit Client' : 'Add New Client'}</h3>
        <form onSubmit={handleSubmit} className="form-container two-column-form">
          <div className="columns">
            {/* Left column */}
            <div className="column personal">
              <h4>Client Details</h4>
              <label>
                Client Name
                <input
                  name="client_name"
                  value={formData.client_name}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Address
                <input
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Contact Number
                <input
                  name="contact_number"
                  value={formData.contact_number}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Email
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Date
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                />
              </label>
            </div>

            {/* Right column */}
            <div className="column professional">
              <h4>System Information</h4>
              <label>
                System Type
                <input
                  name="system_type"
                  value={formData.system_type}
                  onChange={handleChange}
                />
              </label>
              <label>
                Grid Connectivity
                <input
                  name="grid_connectivity"
                  value={formData.grid_connectivity}
                  onChange={handleChange}
                />
              </label>
              <label>
                System Capacity (kW)
                <input
                  name="system_capacity"
                  value={formData.system_capacity}
                  onChange={handleChange}
                />
              </label>
              <label>
                Project Cost ($)
                <input
                  name="project_cost"
                  value={formData.project_cost}
                  onChange={handleChange}
                />
              </label>
              <label>
                Utility Company
                <input
                  name="utility_company"
                  value={formData.utility_company}
                  onChange={handleChange}
                />
              </label>
            </div>
          </div>

          <div className="modal-buttons">
            <button type="submit" className="btn-primary">
              Save
            </button>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
