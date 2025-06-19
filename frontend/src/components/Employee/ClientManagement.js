import React, { useEffect, useState } from 'react';
import '../../styles/ClientManagement.css';

import {
  getMyClients,
  addClient,
  updateClient,
  updateProjectStatus,
} from '../../shared/api';

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
  project_status: 'pending',
};

const ClientManagement = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editClient, setEditClient] = useState(null);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await getMyClients(token);
      setClients(res.data);
    } catch (err) {
      setError('Failed to fetch clients');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const openAddModal = () => {
    setEditClient(null);
    setShowModal(true);
  };

  const openEditModal = (client) => {
    setEditClient(client);
    setShowModal(true);
  };

  const handleSubmit = async (formData) => {
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
      alert('Failed to save client');
    }
  };

  const handleStatusChange = async (id, status) => {
    const token = localStorage.getItem('token');
    try {
      await updateProjectStatus(id, { status }, token);
      fetchClients();
    } catch {
      alert('Failed to update status');
    }
  };

  return (
    <div className="client-management-container">
      <h2>Client Projects</h2>
      <button className="btn-add" onClick={openAddModal}>
        Add New Client
      </button>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      <table className="client-table">
        <thead>
          <tr>
            <th>Client Name</th>
            <th>Email</th>
            <th>System Type</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client._id}>
              <td>{client.client_name}</td>
              <td>{client.email}</td>
              <td>{client.system_type}</td>
              <td>
                <select
                  value={client.project_status}
                  onChange={(e) =>
                    handleStatusChange(client._id, e.target.value)
                  }
                >
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="declined">Declined</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                </select>
              </td>
              <td>
                <button className="btn-edit" onClick={() => openEditModal(client)}>
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <ClientModal
          client={editClient}
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default ClientManagement;
const ClientModal = ({ client, onClose, onSubmit }) => {
  const [formData, setFormData] = useState(emptyClient);

  useEffect(() => {
    if (client) {
      setFormData({ ...emptyClient, ...client });
    } else {
      setFormData(emptyClient);
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
      <div className="modal">
        <h3>{client ? 'Edit Client' : 'Add New Client'}</h3>
        <form onSubmit={handleSubmit} className="modal-form">
          {Object.keys(emptyClient).map((field) => (
            field !== 'project_status' && (
              <label key={field}>
                {field.replace(/_/g, ' ')}
                <input
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  required
                />
              </label>
            )
          ))}
          <div className="modal-buttons">
            <button type="submit" className="btn-primary">Save</button>
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};
