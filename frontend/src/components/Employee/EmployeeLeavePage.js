import React, { useEffect, useState } from 'react';
import { getMyLeaveRequests } from '../../shared/api';

const EmployeeLeavePage = () => {
  const token = localStorage.getItem('token');
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLeaves = async () => {
      setLoading(true);
      try {
        const res = await getMyLeaveRequests(token);
        setLeaves(res.data);
      } catch (err) {
        console.error('Error fetching leaves:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaves();
  }, [token]);

  if (loading) return <p>Loading leaves...</p>;

  return (
    <div>
      <h2>My Leave Requests</h2>
      {leaves.length === 0 ? (
        <p>No leave requests found.</p>
      ) : (
        <table border="1" cellPadding="5">
          <thead>
            <tr>
              <th>Date</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Admin Comments</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map((leave) => (
              <tr key={leave._id}>
                <td>{leave.date}</td>
                <td>{leave.reason}</td>
                <td>{leave.status}</td>
                <td>{leave.adminComments || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EmployeeLeavePage;
