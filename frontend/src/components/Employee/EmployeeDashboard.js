// src/pages/EmployeeDashboard.jsx
/*import React, { useEffect, useState } from 'react';
import {
  getEmployeeDashboard,
  updateEmployeeProfile,
} from '../../shared/api';
import '../../styles/EmployeeDashboard.css';

const EmployeeDashboard = () => {
  const [data, setData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState({});
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await getEmployeeDashboard(token);
      setData(res.data);
      setUpdatedProfile(res.data.profile); // Pre-fill edit form
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setUpdatedProfile({
      ...updatedProfile,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    setProfileImageFile(e.target.files[0]);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(updatedProfile).forEach(([key, value]) => {
        formData.append(key, value);
      });
      if (profileImageFile) {
        formData.append('profileImage', profileImageFile);
      }
      await updateEmployeeProfile(token, formData);
      alert('Profile updated successfully!');
      setEditMode(false);
      fetchDashboard();
    } catch (err) {
      console.error('Failed to update profile:', err);
      alert('Failed to update profile.');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!data) return <p>Failed to load dashboard.</p>;

  const { profile, totalClients, totalCommission, monthlyProjectData } = data;

  return (
    <div className="dashboard-container">
      <h2>Welcome, {profile.name}</h2>

      <div className="profile-section">
        <img
          src={profile.profileImage ? `http://localhost:8090${profile.profileImage}` : '/default-profile.png'}
          alt="Profile"
          className="profile-img"
        />

        {!editMode ? (
          <div className="profile-info">
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Contact:</strong> {profile.contact}</p>
            <p><strong>Position:</strong> {profile.position}</p>
            <button className="update-btn" onClick={() => setEditMode(true)}>Edit Profile</button>
          </div>
        ) : (
          <form className="edit-form" onSubmit={handleUpdate}>
            <input
              type="text"
              name="name"
              value={updatedProfile.name || ''}
              onChange={handleChange}
              placeholder="Name"
              required
            />
            <input
              type="email"
              name="email"
              value={updatedProfile.email || ''}
              onChange={handleChange}
              placeholder="Email"
              required
            />
            <input
              type="text"
              name="contact"
              value={updatedProfile.contact || ''}
              onChange={handleChange}
              placeholder="Contact"
            />
            <input
              type="text"
              name="position"
              value={updatedProfile.position || ''}
              onChange={handleChange}
              placeholder="Position"
            />
            <input type="file" onChange={handleImageChange} />
            <button type="submit" className="update-btn">Save</button>
            <button type="button" className="cancel-btn" onClick={() => setEditMode(false)}>Cancel</button>
          </form>
        )}
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Clients Handled</h3>
          <p>{totalClients}</p>
        </div>
        <div className="stat-card">
          <h3>Total Commission</h3>
          <p>${totalCommission.toFixed(2)}</p>
        </div>
      </div>

      <div className="chart-section">
        <h3>Monthly Project Value</h3>
        <ul className="project-chart">
          {Object.entries(monthlyProjectData).map(([month, value]) => (
            <li key={month}>
              <strong>{month}</strong>: ${value.toFixed(2)}
            </li>
          ))}
        </ul>
      </div>

      <div className="actions">
        <button className="view-clients-btn" onClick={() => window.location.href = '/my-clients'}>
          View Your Clients
        </button>
      </div>
    </div>
  );
};

export default EmployeeDashboard;*/
