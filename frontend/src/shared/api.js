import axios from 'axios';

const BASE_URL = 'http://localhost:8090/api';

export const loginUser = async (username, password) => {
  return await axios.post(`${BASE_URL}/auth/login`, { username, password });
};

// Get all employees
export const getEmployees = async (token) => {
  return await axios.get(`${BASE_URL}/employees`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Add employee
export const addEmployee = async (employee, token) => {
  return await axios.post(`${BASE_URL}/employees/add`, employee, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Update employee
export const updateEmployee = async (id, employee, token) => {
  return await axios.put(`${BASE_URL}/employees/${id}`, employee, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Delete employee
export const deleteEmployee = async (id, token) => {
  return await axios.delete(`${BASE_URL}/employees/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
