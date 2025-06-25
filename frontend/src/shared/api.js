// ====================
// 🧑‍💼 EMPLOYEE DASHBOARD
// ====================

// Get dashboard metrics (client count, commission, etc.)
export const getEmployeeDashboard = async (token) => {
  return await axios.get(`${BASE_API}/employeedashboard/dashboard`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Get employee profile info (name, photo, emails, etc.)
export const getEmployeeProfile = async (token) => {
  return await axios.get(`${BASE_API}/employeedashboard/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Update employee profile (including profile image or CV)
export const updateEmployeeProfile = async (token, profileData) => {
  const formData = new FormData();
  for (const key in profileData) {
    formData.append(key, profileData[key]);
  }

  return await axios.put(`${BASE_API}/employeedashboard/profile`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Mark today's attendance
export const markAttendance = async (token) => {
  return await axios.post(`${BASE_API}/employeedashboard/attendance`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Get all attendance records of the logged-in employee
export const getAttendanceRecords = async (token) => {
  return await axios.get(`${BASE_API}/employeedashboard/attendance`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Solar calculator API (e.g., estimated power based on inputs)
export const calculateSolarEstimate = async (data, token) => {
  return await axios.post(`${BASE_API}/employeedashboard/solar-calc`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
