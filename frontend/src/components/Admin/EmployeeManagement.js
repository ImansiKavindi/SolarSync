import React, { useEffect, useState } from 'react';
import '../../styles/EmployeeManagement.css';
import {
  getEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
} from '../../shared/api';

const emptyEmployee = {
  name: '',
  address: '',
  workEmail: '',
  personalEmail: '',
  workMobileNumber: '',
  personalMobileNumber: '',
  position: '',
  department: '',
  cv: '',
  profileImage: '',
  bankDetails: {
    bankName: '',
    branch: '',
    accountNumber: '',
    accountHolderName: '',
  },
};

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [editEmployee, setEditEmployee] = useState(null);
  const [expandedRows, setExpandedRows] = useState([]);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await getEmployees(token);
      setEmployees(res.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch employees');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const toggleRow = (id) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    try {
      const token = localStorage.getItem('token');
      await deleteEmployee(id, token);
      fetchEmployees();
    } catch {
      alert('Failed to delete employee');
    }
  };

  const openAddModal = () => {
    setEditEmployee(null);
    setShowAddEditModal(true);
  };

  const openEditModal = (employee) => {
    setEditEmployee(employee);
    setShowAddEditModal(true);
  };

  const handleFormSubmit = async (employeeData) => {
    const token = localStorage.getItem('token');
    try {
      if (editEmployee) {
        await updateEmployee(editEmployee._id, employeeData, token);
      } else {
        await addEmployee(employeeData, token);
      }
      setShowAddEditModal(false);
      fetchEmployees();
    } catch {
      alert('Failed to save employee');
    }
  };

  return (
    <div className="employee-management-container">
      <h2>Employee Management</h2>

      <button className="btn-primary" onClick={openAddModal}>
        Add New Employee
      </button>

      {loading && <p>Loading employees...</p>}
      {error && <p className="error">{error}</p>}

      <table className="employee-table">
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Position</th>
            <th>Department</th>
            <th>Work Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <React.Fragment key={emp._id}>
              <tr>
                <td>
                  <button className="expand-btn" onClick={() => toggleRow(emp._id)}>
                    {expandedRows.includes(emp._id) ? '-' : '+'}
                  </button>
                </td>
                <td>{emp.name}</td>
                <td>{emp.position}</td>
                <td>{emp.department}</td>
                <td>{emp.workEmail}</td>
                <td>
                  <button className="btn-edit" onClick={() => openEditModal(emp)}>
                    Edit
                  </button>
                  <button className="btn-delete" onClick={() => handleDelete(emp._id)}>
                    Delete
                  </button>
                </td>
              </tr>
              {expandedRows.includes(emp._id) && (
                <tr className="expanded-row">
                  <td colSpan="6">
                    <div className="expanded-content">
                      <p>
                        <strong>Address:</strong> {emp.address}
                      </p>
                      <p>
                        <strong>Personal Email:</strong> {emp.personalEmail}
                      </p>
                      <p>
                        <strong>Work Mobile:</strong> {emp.workMobileNumber}
                      </p>
                      <p>
                        <strong>Personal Mobile:</strong> {emp.personalMobileNumber}
                      </p>
                      <p>
                        <strong>CV:</strong>{' '}
                        {emp.cv ? (
                          <a href={emp.cv} target="_blank" rel="noreferrer">
                            View CV
                          </a>
                        ) : (
                          'N/A'
                        )}
                      </p>
                      <p>
                        <strong>Profile Image:</strong>{' '}
                        {emp.profileImage ? (
                          <img
                            src={emp.profileImage}
                            alt="Profile"
                            className="profile-image"
                          />
                        ) : (
                          'N/A'
                        )}
                      </p>
                      <p>
                        <strong>Bank Details:</strong>
                      </p>
                      <ul>
                        <li>
                          <strong>Bank Name:</strong> {emp.bankDetails?.bankName || 'N/A'}
                        </li>
                        <li>
                          <strong>Branch:</strong> {emp.bankDetails?.branch || 'N/A'}
                        </li>
                        <li>
                          <strong>Account Number:</strong>{' '}
                          {emp.bankDetails?.accountNumber || 'N/A'}
                        </li>
                        <li>
                          <strong>Account Holder Name:</strong>{' '}
                          {emp.bankDetails?.accountHolderName || 'N/A'}
                        </li>
                      </ul>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {showAddEditModal && (
        <AddEditEmployeeModal
          employee={editEmployee}
          onClose={() => setShowAddEditModal(false)}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
};

export default EmployeeManagement;

// Modal component — you can keep this unchanged or customize
const AddEditEmployeeModal = ({ employee, onClose, onSubmit }) => {
  const [formData, setFormData] = useState(employee || emptyEmployee);

  useEffect(() => {
    if (employee) setFormData(employee);
    else setFormData(emptyEmployee);
  }, [employee]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith('bankDetails.')) {
      const key = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        bankDetails: {
          ...prev.bankDetails,
          [key]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>{employee ? 'Edit Employee' : 'Add New Employee'}</h3>
        <form onSubmit={handleSubmit} className="form-container">
          <div className="form-row">
            <label>Name</label>
            <input name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-row">
            <label>Address</label>
            <input name="address" value={formData.address} onChange={handleChange} required />
          </div>
          <div className="form-row">
            <label>Work Email</label>
            <input
              name="workEmail"
              value={formData.workEmail}
              onChange={handleChange}
              type="email"
              required
            />
          </div>
          <div className="form-row">
            <label>Personal Email</label>
            <input
              name="personalEmail"
              value={formData.personalEmail}
              onChange={handleChange}
              type="email"
              required
            />
          </div>
          <div className="form-row">
            <label>Work Mobile Number</label>
            <input
              name="workMobileNumber"
              value={formData.workMobileNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-row">
            <label>Personal Mobile Number</label>
            <input
              name="personalMobileNumber"
              value={formData.personalMobileNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-row">
            <label>Position</label>
            <input name="position" value={formData.position} onChange={handleChange} required />
          </div>
          <div className="form-row">
            <label>Department</label>
            <input name="department" value={formData.department} onChange={handleChange} required />
          </div>
          <div className="form-row">
            <label>CV Link</label>
            <input name="cv" value={formData.cv} onChange={handleChange} />
          </div>
          <div className="form-row">
            <label>Profile Image URL</label>
            <input name="profileImage" value={formData.profileImage} onChange={handleChange} />
          </div>

          <h4>Bank Details</h4>
          <div className="form-row">
            <label>Bank Name</label>
            <input
              name="bankDetails.bankName"
              value={formData.bankDetails.bankName}
              onChange={handleChange}
            />
          </div>
          <div className="form-row">
            <label>Branch</label>
            <input
              name="bankDetails.branch"
              value={formData.bankDetails.branch}
              onChange={handleChange}
            />
          </div>
          <div className="form-row">
            <label>Account Number</label>
            <input
              name="bankDetails.accountNumber"
              value={formData.bankDetails.accountNumber}
              onChange={handleChange}
            />
          </div>
          <div className="form-row">
            <label>Account Holder Name</label>
            <input
              name="bankDetails.accountHolderName"
              value={formData.bankDetails.accountHolderName}
              onChange={handleChange}
            />
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
