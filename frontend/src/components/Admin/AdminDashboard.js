import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '20px' }}>
      <h1>Admin Dashboard</h1>
      <p>Welcome, Admin!</p>
      
      <div >
        <div>
        <button onClick={() => navigate('/admin/employees')}>
          Employee Management
        </button>
</div> <div >
        <button onClick={() => navigate('/admin/clients')}>
          Client Management
        </button>
</div> <div >
         <button onClick={() => navigate('/admin/leaves')}>
          Employee Leaves Management
        </button>
      </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
