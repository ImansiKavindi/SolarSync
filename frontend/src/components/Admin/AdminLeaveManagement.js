import React, { useEffect, useState } from 'react';
import { getAllLeaveRequests, updateLeaveStatus } from '../../shared/api';
import '../../styles/AdminLeaveManagement.css'; // optional
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const AdminLeaveManagement = () => {
  const [leaves, setLeaves] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchLeaves();
  }, []);  // run once when component mounts

  const fetchLeaves = async () => {
    try {
      const res = await getAllLeaveRequests(token);
      setLeaves(res.data);  // <-- fix here
      setLoading(false);
    } catch (err) {
      setError('Failed to load leave requests.');
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateLeaveStatus(id, newStatus, token);
      fetchLeaves(); // refresh the list
    } catch (err) {
      setError('Failed to update status.');
    }
  };

  if (loading) return <div>Loading leave requests...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-leave-container">
      <h2>All Leave Requests</h2>
      {leaves.length === 0 ? (
        <p>No leave requests found.</p>
      ) : (
        <table className="leave-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>From</th>
              <th>To</th>
              <th>Reason</th>
              <th>Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map((leave) => (
              <tr key={leave._id}>
                <td>{leave.employeeName}</td>
                <td>{leave.fromDate}</td>
                <td>{leave.toDate}</td>
                <td>{leave.reason}</td>
                <td>{leave.type}</td>
                <td>{leave.status}</td>
                <td>
                  {leave.status === 'pending' ? (
                    <>
                      <button
                        className="approve-btn"
                        onClick={() => handleStatusChange(leave._id, 'approved')}
                      >
                        <FaCheckCircle /> Approve
                      </button>
                      <button
                        className="reject-btn"
                        onClick={() => handleStatusChange(leave._id, 'rejected')}
                      >
                        <FaTimesCircle /> Reject
                      </button>
                    </>
                  ) : (
                    <span>—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminLeaveManagement;
