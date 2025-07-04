import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Calculator from '../Calculator.js';


import '../../styles/EmployeeDashboard.css';
import {
  getEmployeeProfile,
  getAttendanceRecords,
  markArrival,
  markLeave,
  updateEmployeeProfile,
  getStatsForCharts,
 createLeaveRequest,
  submitLeaveRequest,
   getMyLeaveRequests

   // Make sure this exists in your API
} from '../../shared/api';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const emptyEmployee = {
  name: '',
  address: '',
  personalEmail: '',
  personalMobileNumber: '',
  position: '',
  department: '',
  workEmail: '',
  workMobileNumber: '',
  username: '',
  password: '',
  bankDetails: {
    bankName: '',
    branch: '',
    accountNumber: '',
    accountHolderName: '',
  },
};

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [profile, setProfile] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const [arrivalMarked, setArrivalMarked] = useState(false);
  const [leaveMarked, setLeaveMarked] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editEmployee, setEditEmployee] = useState(null);

    const [leaveRequests, setLeaveRequests] = useState([]);
  const [leaveReason, setLeaveReason] = useState('');
  const [leaveDate, setLeaveDate] = useState('');
  const [loadingLeaves, setLoadingLeaves] = useState(false);
  const [submittingLeave, setSubmittingLeave] = useState(false);
const [showLeavePage, setShowLeavePage] = useState(false);
const [fromDate, setFromDate] = useState('');
const [toDate, setToDate] = useState('');

const [arrivalAddress, setArrivalAddress] = useState('');
const [leaveAddress, setLeaveAddress] = useState('');


  useEffect(() => {
    fetchLeaves();
  }, []);

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

  const handleLeaveSubmit = async (e) => {
  e.preventDefault();

  if (!fromDate || !toDate || !leaveReason) {
    alert('Please fill From Date, To Date, and Reason');
    return;
  }

  setSubmittingLeave(true);

  try {
    await submitLeaveRequest({ fromDate, toDate, reason: leaveReason }, token);

    // Clear form
    setFromDate('');
    setToDate('');
    setLeaveReason('');

    await fetchLeaves(); // refresh leaves
  } catch (error) {
    console.error('Error submitting leave request', error);
  } finally {
    setSubmittingLeave(false);
  }
};


  const latestLeave = leaveRequests.length > 0 ? leaveRequests[0] : null;

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
    const todayRecord = res.data.find((record) => record.date === today);

    if (todayRecord) {
      setAttendance(todayRecord);
      setArrivalMarked(!!todayRecord.arrivalTime);
      setLeaveMarked(!!todayRecord.leaveTime);

      if (todayRecord.arrivalLocation) {
        const addr = await getAddressFromCoords(
          todayRecord.arrivalLocation.latitude,
          todayRecord.arrivalLocation.longitude
        );
        setArrivalAddress(addr);
      }

      if (todayRecord.leaveLocation) {
        const addr = await getAddressFromCoords(
          todayRecord.leaveLocation.latitude,
          todayRecord.leaveLocation.longitude
        );
        setLeaveAddress(addr);
      }
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
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;

      // ✅ Add this to debug
      console.log("Arrival Location -> Latitude:", latitude, "Longitude:", longitude);



      try {
        await markArrival(token, { latitude, longitude });
        await fetchAttendance();
      } catch (err) {
        console.error('Error marking arrival:', err);
      }
    },
    (error) => {
      console.error('Geolocation error:', error);
      alert("Unable to get your location for arrival.");
    }
  );
};

const handleMarkLeave = async () => {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;

      try {
        await markLeave(token, { latitude, longitude });
        await fetchAttendance();
      } catch (err) {
        console.error('Error marking leave:', err);
      }
    },
    (error) => {
      console.error('Geolocation error:', error);
      alert("Unable to get your location for leave.");
    }
  );
};


  const openEditModal = (employee) => {
    setEditEmployee(employee);
    setShowEditModal(true);
  };

  const handleUpdateEmployee = async (formData) => {
    try {
    await updateEmployeeProfile(token, formData);
      setShowEditModal(false);
      fetchProfileAndStats();
    } catch (err) {
      console.error('Error updating employee:', err);
    }
  };


  const [chartData, setChartData] = useState(null);

const fetchChartData = async () => {
  try {
    const res = await getStatsForCharts(token);
    setChartData(res.data);
  } catch (err) {
    console.error('Error loading chart data:', err);
  }
};

useEffect(() => {
  fetchChartData();
}, []);

// ✅ Move this to the top of the file (after imports, before any component)
const getAddressFromCoords = async (lat, lon) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
    );
    const data = await response.json();
    return data.display_name;
  } catch (error) {
    console.error('Error fetching address:', error);
    return null;
  }
};



  if (!profile || !dashboardData) return <p>Loading...</p>;


  

  return (
    <div className="employee-dashboard">
      <h2>Welcome, {profile.name}</h2>

      <div className="profile-section">
        <img
          src={`http://localhost:8090/${profile.profileImage}`}
          alt="Profile"
          className="profile-img"
        />
        <div className="profile-details">
          
                          <h3>Personal Details</h3>
                          <div><strong>Name:</strong> {profile.name}</div>
                          <div><strong>Address:</strong> {profile.address}</div>
                          <div><strong>Personal Email:</strong> {profile.personalEmail}</div>
                          <div><strong>Mobile:</strong> {profile.personalMobileNumber}</div>
                         
        </div>

        <div className="profile-details">
          <h3>Professional Details</h3>
          <div>
            <strong>Position:</strong> {profile.position}
          </div>
          <div>
            <strong>Department:</strong> {profile.department}
          </div>
          <div>
            <strong>Work Email:</strong> {profile.workEmail}
          </div>
          <div>
            <strong>Work Mobile:</strong> {profile.workMobileNumber}
          </div>
          <div>
                            <strong>CV:</strong>{' '}
                            {profile.cv ? (
                              <a href={`http://localhost:8090/${profile.cv.replace(/\\/g, '/')}`} target="_blank" rel="noreferrer">View CV</a>
                            ) : 'N/A'}
                          </div>
        </div>

       <div className="profile-details">
          <h3>Bank Details</h3>
          <div>
            <strong>Bank:</strong> {profile.bankDetails?.bankName || 'N/A'}
          </div>
          <div>
            <strong>Branch:</strong> {profile.bankDetails?.branch || 'N/A'}
          </div>
          <div>
            <strong>Acc No:</strong> {profile.bankDetails?.accountNumber || 'N/A'}
          </div>
          <div>
            <strong>Holder:</strong> {profile.bankDetails?.accountHolderName || 'N/A'}
          </div>
        </div>

        <div className="profile-details">
          <h3>Login Info</h3>
          <div>
            <strong>Username:</strong> {profile.username}
          </div>
          <div>
            <strong>Password:</strong> ****** {/* Never show actual password */}
          </div>
        
          </div>
        <button className="btn-edit" onClick={() => openEditModal(profile)}>
          Update
        </button>
      </div>


     
      <div className="leave -section">
      <h2>Leaves </h2>

      {/* Leave Request Form */}
      <form onSubmit={handleLeaveSubmit}>
        <h3>Request Leave</h3>
        <label>
  From Date:
  <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} required />
</label>
<br />
<label>
  To Date:
  <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} required />
</label>
        <br />
        <label>
          Reason:
          <input type="text" value={leaveReason} onChange={e => setLeaveReason(e.target.value)} required />
        </label>
        <br />
        <button type="submit" disabled={submittingLeave}>
          {submittingLeave ? 'Submitting...' : 'Submit Leave Request'}
        </button>
      </form>

      {/* Show Latest Leave Request Status */}
      {latestLeave && (
        <div style={{ marginTop: '20px' }}>
          <h4>Latest Leave Request</h4>
          <p>Date: {latestLeave.date}</p>
          <p>Reason: {latestLeave.reason}</p>
          <p>Status: {latestLeave.status}</p>
        </div>
      )}

      {/* Button to view leave history */}
      <button onClick={() => navigate('/employee/leaves')} style={{ marginTop: '20px' }}>
        View My Leaves
      </button>
    </div>

       <div className="attendance-section">
  <h3>Attendance</h3>
  {!arrivalMarked && <button onClick={handleMarkArrival}>Mark Arrival</button>}
  {arrivalMarked && !leaveMarked && <button onClick={handleMarkLeave}>Mark Leave</button>}
  {arrivalMarked && leaveMarked && <p>✅ Attendance completed for today.</p>}
  {attendance && (
    <div>
      <p>
        🕘 Arrival Time:{' '}
        {attendance.arrivalTime
          ? new Date(attendance.arrivalTime).toLocaleTimeString()
          : 'Not marked'}
      </p>

     {attendance?.arrivalLocation?.latitude != null && (
  <p>
    📍 Arrival Address: {arrivalAddress || 'Loading address...'}
  </p>
)}

{attendance?.leaveLocation?.latitude != null && (
  <p>
    📍 Leave Address: {leaveAddress || 'Loading address...'}
  </p>
)}

      <p>
        🕔 Leave Time:{' '}
        {attendance.leaveTime
          ? new Date(attendance.leaveTime).toLocaleTimeString()
          : 'Not marked'}
      </p>
    </div>
  )}
</div>


      {chartData && (
  <div className="dashboard-charts">
    <div className="chart-container">
      <h4>📈 Clients Added Per Month</h4>
      <Bar
        data={{
          labels: chartData.months,
          datasets: [
            {
              label: 'Clients',
              data: chartData.clientCounts,
              backgroundColor: '#4caf50',
              borderRadius: 6,
               barThickness: 30,
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: {
            legend: { display: false },
            title: {
              display: true,
              text: 'Clients per Month',
              font: { size: 15 },
            },
          },
        }}
      />
    </div>

    <div className="chart-container">
      <h4>💰 Monthly Commission Earned</h4>
      <Bar
        data={{
          labels: chartData.months,
          datasets: [
            {
              label: 'Commission (LKR)',
              data: chartData.commissions,
              backgroundColor: '#2196f3',
              borderRadius: 6,
              barThickness: 70,
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: {
            legend: { display: false },
            title: {
              display: true,
              text: 'Monthly Commission',
              font: { size: 16 },
            },
          },
        }}
      />
    </div>
  </div>
)}



<div className="calculator-panel">
  <h3>Calculator</h3>
  <Calculator/>
</div>

      <div className="btn-section">
        <button onClick={() => navigate('/employee/clients')}>Client Management</button>
       
      






      </div>

      {/* Modal */}
      {showEditModal && (
        <AddEditEmployeeModal
          employee={editEmployee}
          onClose={() => setShowEditModal(false)}
          onSubmit={handleUpdateEmployee}
        />
      )}
    </div>
  );
};

export default EmployeeDashboard;

// ================= AddEditEmployeeModal Component =================

const AddEditEmployeeModal = ({ employee, onClose, onSubmit }) => {
  const [formData, setFormData] = useState(emptyEmployee);
  const [cvFile, setCvFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (employee) {
      setFormData({
        ...employee,
        password: '', // Clear password field on edit (leave blank to keep existing)
        bankDetails: {
          bankName: employee.bankDetails?.bankName || '',
          branch: employee.bankDetails?.branch || '',
          accountNumber: employee.bankDetails?.accountNumber || '',
          accountHolderName: employee.bankDetails?.accountHolderName || '',
        },
      });
    } else {
      setFormData(emptyEmployee);
    }
  }, [employee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('bankDetails.')) {
      const key = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        bankDetails: {
          ...prev.bankDetails,
          [key]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  /*const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    const { bankDetails, ...rest } = formData;

    // Append all top-level fields
    Object.entries(rest).forEach(([key, value]) => {
      if (value !== undefined && value !== null) data.append(key, value);
    });

    // Append bankDetails as JSON string
    data.append('bankDetails', JSON.stringify(bankDetails));

    if (cvFile) data.append('cv', cvFile);
    if (imageFile) data.append('profileImage', imageFile);

    onSubmit(data);
  };*/

  const handleSubmit = (e) => {
  e.preventDefault();
  const data = new FormData();
  const { bankDetails, ...rest } = formData;

  // ✅ Only append fields with actual values
  Object.entries(rest).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      data.append(key, value);
    }
  });

  // ✅ Append bank details only if not empty
  if (
    bankDetails.bankName ||
    bankDetails.branch ||
    bankDetails.accountNumber ||
    bankDetails.accountHolderName
  ) {
    data.append('bankDetails', JSON.stringify(bankDetails));
  }

  // ✅ Append files only if selected
  if (cvFile) data.append('cv', cvFile);
  if (imageFile) data.append('profileImage', imageFile);

  onSubmit(data);
};


  return (
    <div className="modal-backdrop">
      <div className="modal employee-modal">
        <h3>{employee ? 'Edit Employee' : 'Add New Employee'}</h3>
        <form onSubmit={handleSubmit} className="form-container two-column-form">
          <div className="columns">
            {/* Left column: Personal Details */}
            <div className="column personal">
              <h4>Personal Details</h4>
              <label>
                Full Name{' '}
                <input name="name" value={formData.name} onChange={handleChange} required />
              </label>
              <label>
                Address{' '}
                <input name="address" value={formData.address} onChange={handleChange} required />
              </label>
              <label>
                Personal Email{' '}
                <input
                  type="email"
                  name="personalEmail"
                  value={formData.personalEmail}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Personal Mobile Number{' '}
                <input
                  name="personalMobileNumber"
                  value={formData.personalMobileNumber}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Profile Image{' '}
                <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
              </label>
            </div>

            {/* Right column: Professional Details */}
            <div className="column professional">
              <h4>Professional Details</h4>
              <label>
                Position{' '}
                <input name="position" value={formData.position} onChange={handleChange} required />
              </label>
              <label>
                Department{' '}
                <input name="department" value={formData.department} onChange={handleChange} required />
              </label>
              <label>
                Work Email{' '}
                <input
                  type="email"
                  name="workEmail"
                  value={formData.workEmail}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Work Mobile Number{' '}
                <input
                  name="workMobileNumber"
                  value={formData.workMobileNumber}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Resume{' '}
                <input type="file" accept=".pdf" onChange={(e) => setCvFile(e.target.files[0])} />
              </label>
            </div>
          </div>

          <h4>Login Information</h4>
          <div className="login-details-row">
            <label>
              Username{' '}
              <input name="username" value={formData.username} onChange={handleChange} required={!employee} />
            </label>
            <div className="password-field">
              <label htmlFor="password">Password</label>
              <div className="password-input-wrapper">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={employee ? 'Leave blank to keep existing' : ''}
                  className="password-input"
                />
                <button
                  type="button"
                  className="toggle-eye"
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex={-1}
                >
                  <i className={showPassword ? 'fa fa-eye-slash' : 'fa fa-eye'}></i>
                </button>
              </div>
            </div>
          </div>

          <h4>Bank Details</h4>
          <div className="bank-details-row">
            <label>
              Bank Name{' '}
              <input
                name="bankDetails.bankName"
                value={formData.bankDetails.bankName}
                onChange={handleChange}
              />
            </label>
            <label>
              Branch{' '}
              <input
                name="bankDetails.branch"
                value={formData.bankDetails.branch}
                onChange={handleChange}
              />
            </label>
            <label>
              Account Number{' '}
              <input
                name="bankDetails.accountNumber"
                value={formData.bankDetails.accountNumber}
                onChange={handleChange}
              />
            </label>
            <label>
              Account Holder Name{' '}
              <input
                name="bankDetails.accountHolderName"
                value={formData.bankDetails.accountHolderName}
                onChange={handleChange}
              />
            </label>
          </div>

          <div className="modal-buttons">
            <button type="submit" className="btn-primary">
              Save
            </button>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
