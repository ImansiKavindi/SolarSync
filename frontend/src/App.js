import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import '@fortawesome/fontawesome-free/css/all.min.css';


import AdminDashboard from './components/Admin/AdminDashboard';
import EmployeeManagement from './components/Admin/EmployeeManagement';
import AdminClientManagement from './components/Admin/AdminClientManagement';
import AdminLeaveManagement from './components/Admin/AdminLeaveManagement';



import EmployeeDashboard from './components/Employee/EmployeeDashboard';
import EmployeeClientManagement from './components/Employee/EmployeeClientManagement';

import Calculator from './components/Calculator';
import EmployeeLeavePage from './components/Employee/EmployeeLeavePage';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/calculator" element={<Calculator />} />

        <Route path="/admin" element={<AdminDashboard />} />
         {<Route path="/admin/employees" element={<EmployeeManagement />} /> }
        {<Route path="/admin/clients" element={<AdminClientManagement />} /> }
        {<Route path="/admin/Leaves" element={<AdminLeaveManagement/>} /> }
      


        
        <Route path="/employee" element={<EmployeeDashboard />} />
        {<Route path="/employee/clients" element={<EmployeeClientManagement />} /> }
        <Route path="/employee/leaves" element={<EmployeeLeavePage />} />

      </Routes>
    </Router>
  );
}

export default App;
