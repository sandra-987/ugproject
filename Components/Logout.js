import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Log the data before logout
    console.log("Before logout:", sessionStorage.getItem('authToken'), sessionStorage.getItem('user'));

    // Remove token or user data from session storage
    sessionStorage.removeItem('authToken'); 
    sessionStorage.removeItem('user'); 

    // Log the data after logout
    console.log("After logout:", sessionStorage.getItem('authToken'), sessionStorage.getItem('user'));

    // Redirect to login page with replace option
    navigate('/login', { replace: true });

    // Force page reload if needed (optional)
    // window.location.reload(); 
  };

  return (
    <div className="logout-container">
      <h2>Are you sure you want to logout?</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Logout;
