import React from 'react';
import { useNavigate } from 'react-router-dom';

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  return (
    <div style={{ padding: '20px' }}>
      <h1>Employee Dashboard</h1>
      <p>Welcome, Employee!</p>
      <p>You can see your tasks or assigned clients here.</p>
      {/* You can add more functionality later */}
       <button onClick={() => navigate('/employee/clients')}>
          Client Management
        </button>
    </div>
  );
};

export default EmployeeDashboard;
