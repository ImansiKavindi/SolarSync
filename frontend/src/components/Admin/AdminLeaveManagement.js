import React, { useEffect, useState } from 'react';
import { getAllLeaveRequests, updateLeaveStatus } from '../../shared/api';
import '../../styles/AdminLeaveManagement.css'; // optional styling
import { FaCheckCircle, FaTimesCircle,FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';


const AdminLeaveManagement = () => {

   const navigate = useNavigate();

  const [leaves, setLeaves] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const res = await getAllLeaveRequests(token);
      setLeaves(res.data);
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
       <div className="back-arroww" onClick={() => navigate('/admin')}>
                  <FaArrowLeft /> <span>Back to Dashboard</span>
                </div>
      <h2>All Leave Requests</h2>
      {leaves.length === 0 ? (
        <p>No leave requests found.</p>
      ) : (
        <table className="admin-leave-table">
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
                <td>{leave.employee?.name || 'N/A'}</td>
                <td>{leave.fromDate?.split('T')[0]}</td>
                <td>{leave.toDate ? leave.toDate.split('T')[0] : '-'}</td>
                <td>{leave.reason}</td>
                <td>
                  {leave.leaveType}
                  {leave.leaveType === 'Half Day' && ` (${leave.halfDayType})`}
                </td>
                <td>{leave.status}</td>
                <td>
                  {leave.status === 'Pending' ? (
                    <>
                      <button
                        className="approve-btn"
                        onClick={() => handleStatusChange(leave._id, 'Approved')}
                      >
                        <FaCheckCircle /> Approve
                      </button>
                      <button
                        className="reject-btn"
                        onClick={() => handleStatusChange(leave._id, 'Rejected')}
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
