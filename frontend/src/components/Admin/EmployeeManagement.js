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

  const handleFormSubmit = async (formData) => {
    const token = localStorage.getItem('token');
    try {
      if (editEmployee) {
        await updateEmployee(editEmployee._id, formData, token);
      } else {
        await addEmployee(formData, token);
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

      <button className="btn-addemployee" onClick={openAddModal}>
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
                    Update
                  </button>
                  <button className="btn-delete" onClick={() => handleDelete(emp._id)}>
                    Delete
                  </button>
                </td>
              </tr>
              {expandedRows.includes(emp._id) && (
                <tr className="expanded-row">
                  <td colSpan="6">
                    <div className="expanded-content improved-layout">
                      <div className="top-section">
                        {/* Personal Details */}
                        <div className="info-column">
                          <h3>Personal Details</h3>
                          <div><strong>Name:</strong> {emp.name}</div>
                          <div><strong>Address:</strong> {emp.address}</div>
                          <div><strong>Personal Email:</strong> {emp.personalEmail}</div>
                          <div><strong>Mobile:</strong> {emp.personalMobileNumber}</div>
                        
                          <div>
                            <strong>Profile Image:</strong><br />
                            {emp.profileImage ? (
                              <img
                                src={`http://localhost:8090/${emp.profileImage.replace(/\\/g, '/')}`}
                                alt="Profile"
                                className="profile-img"
                              />
                            ) : (
                              'N/A'
                            )}
                          </div>
                        </div>

                        {/* Professional Details */}
                        <div className="info-column">
                          <h3>Professional Details</h3>
                          <div><strong>Position:</strong> {emp.position}</div>
                          <div><strong>Department:</strong> {emp.department}</div>
                          <div><strong>Work Email:</strong> {emp.workEmail}</div>
                          <div><strong>Work Mobile:</strong> {emp.workMobileNumber}</div>
                          <div>
                            <strong>CV:</strong>{' '}
                            {emp.cv ? (
                              <a href={`http://localhost:8090/${emp.cv.replace(/\\/g, '/')}`} target="_blank" rel="noreferrer">View CV</a>
                            ) : 'N/A'}
                          </div>
                        </div>

                        {/* Bank Details */}
                        <div className="info-column">
                          <h3>Bank Details</h3>
                          <div><strong>Bank:</strong> {emp.bankDetails?.bankName || 'N/A'}</div>
                          <div><strong>Branch:</strong> {emp.bankDetails?.branch || 'N/A'}</div>
                          <div><strong>Acc No:</strong> {emp.bankDetails?.accountNumber || 'N/A'}</div>
                          <div><strong>Holder:</strong> {emp.bankDetails?.accountHolderName || 'N/A'}</div>
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

const AddEditEmployeeModal = ({ employee, onClose, onSubmit }) => {
  const [formData, setFormData] = React.useState(emptyEmployee);
  const [cvFile, setCvFile] = React.useState(null);
  const [imageFile, setImageFile] = React.useState(null);

  React.useEffect(() => {
    if (employee) {
      setFormData({
        ...employee,
        bankDetails: {
          bankName: employee.bankDetails?.bankName || '',
          branch: employee.bankDetails?.branch || '',
          accountNumber: employee.bankDetails?.accountNumber || '',
          accountHolderName: employee.bankDetails?.accountHolderName || '',
        },
      });
    } else {
      setFormData(emptyEmployee);
    }
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
    const data = new FormData();
    const { bankDetails, ...rest } = formData;

    Object.entries(rest).forEach(([key, value]) => {
      data.append(key, value || '');
    });

    data.append('bankDetails', JSON.stringify(bankDetails));
    if (cvFile) data.append('cv', cvFile);
    if (imageFile) data.append('profileImage', imageFile);

    onSubmit(data);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal employee-modal">
        <h3>{employee ? 'Edit Employee' : 'Add New Employee'}</h3>
        <form onSubmit={handleSubmit} className="form-container two-column-form">

          <div className="columns">
            {/* Left column: Personal Details */}
            <div className="column personal">
              <h4>Personal Details</h4>
              <label>
                Full Name{' '}
                <input name="name" value={formData.name} onChange={handleChange} required />
              </label>
              <label>
                Address {' '}
                <input name="address" value={formData.address} onChange={handleChange} required />
              </label>
              <label>
                Personal Email-{' '}
                <input
                  type="email"
                  name="personalEmail"
                  value={formData.personalEmail}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Personal mobile number {' '}
                <input
                  name="personalMobileNumber"
                  value={formData.personalMobileNumber}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Profile image {' '}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                />
              </label>
            </div>

            {/* Right column: Professional Details */}
            <div className="column professional">
              <h4>Professional Details</h4>
              <label>
                Position {' '}
                <input name="position" value={formData.position} onChange={handleChange} required />
              </label>
              <label>
                Department {' '}
                <input name="department" value={formData.department} onChange={handleChange} required />
              </label>
              <label>
                Work Email{' '}
                <input
                  type="email"
                  name="workEmail"
                  value={formData.workEmail}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Work Mobile Number {' '}
                <input
                  name="workMobileNumber"
                  value={formData.workMobileNumber}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Resume {' '}
                <input type="file" accept=".pdf" onChange={(e) => setCvFile(e.target.files[0])} />
              </label>
            </div>
          </div>

          {/* Bank Details row */}
          <h4>Bank Details</h4>
          <div className="bank-details-row">
            <label>
              Bank Name {' '}
              <input
                name="bankDetails.bankName"
                value={formData.bankDetails.bankName}
                onChange={handleChange}
              />
            </label>
            <label>
              Branch {' '}
              <input
                name="bankDetails.branch"
                value={formData.bankDetails.branch}
                onChange={handleChange}
              />
            </label>
            <label>
              Account Number{' '}
              <input
                name="bankDetails.accountNumber"
                value={formData.bankDetails.accountNumber}
                onChange={handleChange}
              />
            </label>
            <label>
              Account Holder Name {' '}
              <input
                name="bankDetails.accountHolderName"
                value={formData.bankDetails.accountHolderName}
                onChange={handleChange}
              />
            </label>
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
