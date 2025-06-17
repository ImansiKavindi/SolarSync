import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '20px' }}>
      <h1>Admin Dashboard</h1>
      <p>Welcome, Admin!</p>
      
      <div style={{ marginTop: '20px' }}>
        <button onClick={() => navigate('/admin/employees')} style={{ marginRight: '10px' }}>
          Employee Management
        </button>

        <button onClick={() => navigate('/admin/clients')}>
          Client Management
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
