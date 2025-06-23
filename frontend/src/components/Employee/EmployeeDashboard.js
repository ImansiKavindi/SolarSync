// pages/EmployeeDashboard.jsx

import React, { useEffect, useState } from 'react';
import { getEmployeeDashboard } from '../../shared/api';


const EmployeeDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await getEmployeeDashboard(token);
        setData(res.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!data) return <p>Unable to load dashboard.</p>;

  const { employee, totalClients, totalProjectCost, totalCommission } = data;

  return (
    <div className="dashboard-container">
      <h2>Welcome, {employee.name}</h2>
      <p><strong>Email:</strong> {employee.email}</p>
      <p><strong>Role:</strong> {employee.role}</p>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Clients Handled</h3>
          <p>{totalClients}</p>
        </div>
        <div className="stat-card">
          <h3>Total Project Value</h3>
          <p>${totalProjectCost.toFixed(2)}</p>
        </div>
        <div className="stat-card">
          <h3>Commission Earned</h3>
          <p>${totalCommission.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
