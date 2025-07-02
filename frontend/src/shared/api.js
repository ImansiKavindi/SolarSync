





import axios from 'axios';

const BASE_API = 'http://localhost:8090/api';

// ====================
// 🔐 AUTH
// ====================

export const loginUser = async (username, password) => {
  return await axios.post(`${BASE_API}/auth/login`, { username, password });
};

// ====================
// 👥 EMPLOYEES
// ====================

export const getEmployees = async (token) => {
  return await axios.get(`${BASE_API}/employees`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const addEmployee = async (employee, token) => {
  return await axios.post(`${BASE_API}/employees/add`, employee, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateEmployee = async (id, employee, token) => {
  return await axios.put(`${BASE_API}/employees/${id}`, employee, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deleteEmployee = async (id, token) => {
  return await axios.delete(`${BASE_API}/employees/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// ====================
// 🧾 CLIENTS
// ====================

// Get only the logged-in employee's clients
export const getMyClients = async (token) => {
  return await axios.get(`${BASE_API}/clients/my-projects`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Get all clients (Admin only)
export const getAllClients = async (token) => {
  return await axios.get(`${BASE_API}/clients`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Add new client (Employee or Admin)
export const addClient = async (data, token) => {
  return await axios.post(`${BASE_API}/clients`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Update client info
export const updateClient = async (id, data, token) => {
  return await axios.put(`${BASE_API}/clients/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Update client project status (Admin only)
export const updateProjectStatus = async (id, data, token) => {
  return await axios.patch(`${BASE_API}/clients/${id}/status`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Delete client project status (Admin only)
export const  deleteClient  = async (id, token) => {
  return await axios.delete(`${BASE_API}/clients/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};


// ====================
// 🧑‍💼 EMPLOYEE DASHBOARD
// ====================

// ✅ Get employee dashboard stats (e.g., client count, commission, etc.)
export const getEmployeeDashboard = async (token) => {
  return await axios.get(`${BASE_API}/employeedashboard/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// ✅ Get employee profile info (name, photo, emails, etc.)
export const getEmployeeProfile = async (token) => {
  return await axios.get(`${BASE_API}/employeedashboard/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateEmployeeProfile = async (token, formData) => {
  // Don't create new FormData here! Just send the one received.
  console.log('FormData being sent:');
  for (let pair of formData.entries()) {
    console.log(pair[0], pair[1]);
  }

  return await axios.patch(`${BASE_API}/employeedashboard/update`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      // Do NOT set Content-Type here; let axios handle it.
    },
  });
};





// ✅ Mark today's attendance
export const markAttendance = async (token) => {
  return await axios.post(`${BASE_API}/employeedashboard/attendance`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// ✅ Get all attendance records of the logged-in employee
export const getAttendanceRecords = async (token) => {
  return await axios.get(`${BASE_API}/employeedashboard/attendance`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const markArrival = async (token) => {
  return await axios.post(`${BASE_API}/employeedashboard/attendance/arrival`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const markLeave = async (token) => {
  return await axios.post(`${BASE_API}/employeedashboard/attendance/leave`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
};


// ✅ Estimate solar power based on inputs
export const calculateSolarEstimate = async (data, token) => {
  return await axios.post(`${BASE_API}/employeedashboard/solar-calc`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getStatsForCharts = (token) =>
  axios.get(`${BASE_API}/employeedashboard/charts`, {
    headers: { Authorization: `Bearer ${token}` },
  });



  // ====================
// 📆 LEAVE REQUESTS
// ====================

// Employee submits a leave
export const submitLeaveRequest = async (data, token) => {
  return await axios.post(`${BASE_API}/leaves/submit`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Employee views their own leave requests
export const getMyLeaveRequests = async (token) => {
  return await axios.get(`${BASE_API}/leaves/my`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Admin views all leave requests
export const getAllLeaveRequests = async (token) => {
  return await axios.get(`${BASE_API}/leaves/all`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Admin approves or rejects a leave
export const updateLeaveStatus = async (id, status, token) => {
  return await axios.patch(`${BASE_API}/leaves/${id}/status`, { status }, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const createLeaveRequest = async (token, data) => {
  return await axios.post(`${BASE_API}/leaves`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getMyLeaves = async (token) => {
  return await axios.get(`${BASE_API}/leaves/my`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

