import React, { useEffect, useState } from 'react';
import { getMyLeaveRequests, submitLeaveRequest } from '../../shared/api';
import '../../styles/EmployeeLeavePage.css';


const EmployeeLeavePage = () => {
  const token = localStorage.getItem('token');

  // State hooks inside component
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [leaveReason, setLeaveReason] = useState('');
  const [loadingLeaves, setLoadingLeaves] = useState(false);
  const [submittingLeave, setSubmittingLeave] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [leaveType, setLeaveType] = useState('Full Day');
  const [halfDayType, setHalfDayType] = useState('');

  // Fetch leave requests
  const fetchLeaves = async () => {
    setLoadingLeaves(true);
    try {
      const res = await getMyLeaveRequests(token);
      setLeaveRequests(res.data);
    } catch (error) {
      console.error('Error fetching leaves', error);
    } finally {
      setLoadingLeaves(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, [token]);

  // Handle form submit
  const handleLeaveSubmit = async (e) => {
    e.preventDefault();

    if (!fromDate || !leaveReason) {
      alert('Please fill From Date and Reason');
      return;
    }

    if (leaveType === 'Half Day' && !halfDayType) {
      alert('Please select Morning or Afternoon for Half Day leave');
      return;
    }

    setSubmittingLeave(true);

    try {
      const data = {
        fromDate,
        toDate,
        reason: leaveReason,
        leaveType,
        halfDayType: leaveType === 'Half Day' ? halfDayType : undefined,
      };

      await submitLeaveRequest(data, token);

      // Clear form
      setFromDate('');
      setToDate('');
      setLeaveReason('');
      setLeaveType('Full Day');
      setHalfDayType('');

      await fetchLeaves();
    } catch (error) {
      console.error('Error submitting leave request', error);
    } finally {
      setSubmittingLeave(false);
    }
  };

  if (loadingLeaves) return <p>Loading leaves...</p>;

  return (
    <div className="leave-page-container1">
  <div className="leave-page-container2">

       <div className="leave-section">
      <h2>Request Leave</h2>

      <form className="leave-form" onSubmit={handleLeaveSubmit}>
       <label>
            From Date:
            <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} required />
          </label>
          <br />
          <label>
            To Date:
            <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} />
          </label>
          <br />
          
           <label>
                  Reason:<textarea value={leaveReason} onChange={(e) => setLeaveReason(e.target.value)} required
            rows={4}
            placeholder="Enter your leave reason"/>
            </label>

          <br />
          <label>
            Leave Type:
            <select value={leaveType} onChange={e => setLeaveType(e.target.value)}>
              <option value="Full Day">Full Day</option>
              <option value="Half Day">Half Day</option>
            </select>
          </label>
          <br />
          {leaveType === 'Half Day' && (
            <>
              <label>
                Half Day Type:
                <select value={halfDayType} onChange={e => setHalfDayType(e.target.value)}>
                  <option value="">-- Select --</option>
                  <option value="Morning">Morning</option>
                  <option value="Afternoon">Afternoon</option>
                </select>
              </label>
              <br />
            </>
          )}
          <button type="submit" disabled={submittingLeave}>
            {submittingLeave ? 'Submitting...' : 'Submit Leave Request'}
          </button>
      </form>
    </div>
    </div>



     <div className="leave-page-container3">
    <h2>My Leave Requests</h2>

    {leaveRequests.length === 0 ? (
      <p>No leave requests found.</p>
    ) : (
      <table className="leave-table">
        <thead>
          <tr>
            <th>From Date</th>
            <th>To Date</th>
            <th>Reason</th>
            <th>Leave Type</th>
            <th>Half Day Type</th>
            <th>Status</th>
            
          </tr>
        </thead>
        <tbody>
          {leaveRequests.map((leave) => (
            <tr key={leave._id}>
              <td>{new Date(leave.fromDate).toLocaleDateString()}</td>
              <td>{leave.toDate ? new Date(leave.toDate).toLocaleDateString() : '-'}</td>
              <td>{leave.reason}</td>
              <td>{leave.leaveType}</td>
              <td>{leave.leaveType === 'Half Day' ? leave.halfDayType : '-'}</td>
              <td>{leave.status}</td>
              
            </tr>
          ))}
        </tbody>
      </table>
    )}

 </div>
  </div>
  
);

  
};

export default EmployeeLeavePage;
