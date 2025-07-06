import React, { useEffect, useState, useCallback } from 'react';
import {
  getAllLeaveRequests,
  updateLeaveStatus
} from '../../shared/api';
import { useLocation } from 'react-router-dom';

const AdminLeavePage = () => {
  const location = useLocation();
  const token = location.state?.token;

  // rest of your component





  const fetchLeaves = useCallback(async () => {
    console.log('Fetching leaves with token:', token);
    if (!token) return;
    try {
      const res = await getAllLeaveRequests(token);
      setLeaves(res.data);
    } catch (err) {
      console.error('Error fetching leaves:', err.response?.data || err.message);
    }
  }, [token]);

  const handleStatusUpdate = async (id, status) => {
    await updateLeaveStatus(id, status, token);
    fetchLeaves();
  };

  useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves]);

  return (
    <div>
      <h2>All Leave Requests</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Reason</th>
            <th>From</th>
            <th>To</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {leaves.map((leave) => (
            <tr key={leave._id}>
              <td>{leave.employee?.name}</td>
              <td>{leave.reason}</td>
              <td>{leave.fromDate.split('T')[0]}</td>
              <td>{leave.toDate.split('T')[0]}</td>
              <td>{leave.status}</td>
              <td>
                {leave.status === 'Pending' && (
                  <>
                    <button onClick={() => handleStatusUpdate(leave._id, 'Approved')}>Approve</button>
                    <button onClick={() => handleStatusUpdate(leave._id, 'Rejected')}>Reject</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminLeavePage;
