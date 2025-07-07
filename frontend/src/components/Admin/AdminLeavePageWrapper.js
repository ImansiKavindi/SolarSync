import React from 'react';
import AdminLeavePage from '../Admin/AdminLeavePage'; // update path if needed

const AdminLeavePageWrapper = () => {
  const token = localStorage.getItem('token');

  return token ? (
    <AdminLeavePage token={token} />
  ) : (
    <p>Unauthorized. Please log in again.</p>
  );
};

export default AdminLeavePageWrapper;
