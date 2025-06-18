import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';

import AdminDashboard from './components/Admin/AdminDashboard';
import EmployeeManagement from './components/Admin/EmployeeManagement';
import EmployeeDashboard from './components/Employee/EmployeeDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/admin" element={<AdminDashboard />} />
         {<Route path="/admin/employees" element={<EmployeeManagement />} /> }
        {/* <Route path="/admin/clients" element={<ClientManagement />} /> */}

        
        <Route path="/employee" element={<EmployeeDashboard />} />

      </Routes>
    </Router>
  );
}

export default App;
