import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/EmployeeDashboard.css';
import {
  getEmployeeDashboard,
  getEmployeeProfile,
  getAttendanceRecords,
  markArrival, 
  markLeave
} from '../../shared/api';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [profile, setProfile] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const [arrivalMarked, setArrivalMarked] = useState(false);
  const [leaveMarked, setLeaveMarked] = useState(false);

  useEffect(() => {
    fetchProfileAndStats();
    fetchAttendance();
  }, []);

  const fetchProfileAndStats = async () => {
    try {
      const res = await getEmployeeProfile(token);
      setProfile(res.data.employee);
      setDashboardData(res.data.stats);
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  const fetchAttendance = async () => {
    try {
      const res = await getAttendanceRecords(token);
      const today = new Date().toISOString().split('T')[0];
      const todayRecord = res.data.find(record => record.date === today);

      if (todayRecord) {
        setAttendance(todayRecord);
        setArrivalMarked(!!todayRecord.arrivalTime);
        setLeaveMarked(!!todayRecord.leaveTime);
      } else {
        setAttendance(null);
        setArrivalMarked(false);
        setLeaveMarked(false);
      }
    } catch (err) {
      console.error('Error fetching attendance:', err);
    }
  };

  const handleMarkArrival = async () => {
    try {
      await markArrival(token);
      await fetchAttendance();
    } catch (err) {
      console.error('Error marking arrival:', err);
    }
  };

  const handleMarkLeave = async () => {
    try {
      await markLeave(token);
      await fetchAttendance();
    } catch (err) {
      console.error('Error marking leave:', err);
    }
  };

  if (!profile || !dashboardData) return <p>Loading...</p>;

  return (
    <div className="employee-dashboard">
      <h2>Welcome, {profile.name}</h2>

      <div className="profile-section">
        <img src={`http://localhost:8090/${profile.profileImage}`} alt="Profile" className="profile-img" />
        <div className="profile-details">
          <p><strong>Address:</strong> {profile.address}</p>
          <p><strong>Personal Email:</strong> {profile.personalEmail}</p>
          <p><strong>Work Email:</strong> {profile.workEmail}</p>
          <p><strong>Department:</strong> {profile.department}</p>
          <p><strong>Position:</strong> {profile.position}</p>
        </div>
      </div>

      <div className="attendance-section">
        <h3>Attendance</h3>
        {!arrivalMarked && (
          <button onClick={handleMarkArrival}>Mark Arrival</button>
        )}
        {arrivalMarked && !leaveMarked && (
          <button onClick={handleMarkLeave}>Mark Leave</button>
        )}
        {arrivalMarked && leaveMarked && (
          <p>✅ Attendance completed for today.</p>
        )}
        {attendance && (
          <div>
            <p>🕘 Arrival Time: {attendance.arrivalTime ? new Date(attendance.arrivalTime).toLocaleTimeString() : 'Not marked'}</p>
            <p>🕔 Leave Time: {attendance.leaveTime ? new Date(attendance.leaveTime).toLocaleTimeString() : 'Not marked'}</p>
          </div>
        )}
      </div>

      <div className="dashboard-charts">
        <Bar
          data={{
            labels: ['Clients Added', 'Total Commission'],
            datasets: [
              {
                label: 'Stats',
                data: [dashboardData.totalClients, dashboardData.totalCommission],
                backgroundColor: ['#4caf50', '#2196f3']
              }
            ]
          }}
          options={{
            responsive: true,
            plugins: {
              legend: { display: false },
              title: {
                display: true,
                text: 'Your Performance Overview'
              }
            }
          }}
        />
      </div>

      <div className="btn-section">
        <button onClick={() => navigate('/employee/clients')}>
          Client Management
        </button>
        <button className="calculator">
          Go to Calculator
        </button>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
