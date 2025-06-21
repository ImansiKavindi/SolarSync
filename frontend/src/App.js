import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';

import AdminDashboard from './components/Admin/AdminDashboard';
import EmployeeManagement from './components/Admin/EmployeeManagement';
import EmployeeDashboard from './components/Employee/EmployeeDashboard';
import EmployeeClientManagement from './components/Employee/EmployeeClientManagement';
import AdminClientManagement from './components/Admin/AdminClientManagement';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/admin" element={<AdminDashboard />} />
         {<Route path="/admin/employees" element={<EmployeeManagement />} /> }
        {<Route path="/admin/clients" element={<AdminClientManagement />} /> }

        
        <Route path="/employee" element={<EmployeeDashboard />} />
        {<Route path="/employee/clients" element={<EmployeeClientManagement />} /> }

      </Routes>
    </Router>
  );
}

export default App;
