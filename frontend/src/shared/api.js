import axios from 'axios';

const BASE_API = 'http://localhost:8090/api';

// AUTH
export const loginUser = async (username, password) => {
  return await axios.post(`${BASE_API}/auth/login`, { username, password });
};

// EMPLOYEES
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

// CLIENTS
export const getMyClients = async (token) => {
  return await axios.get(`${BASE_API}/client/my`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const addClient = async (data, token) => {
  return await axios.post(`${BASE_API}/client/add`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateClient = async (id, data, token) => {
  return await axios.put(`${BASE_API}/client/update/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateProjectStatus = async (id, data, token) => {
  return await axios.put(`${BASE_API}/client/status/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
