import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './Components/LandingPage';
import Login from './Components/Login';
import Register from './Components/Register';
import Home from './Components/Home';
import Dashboard from './Components/Dashboard';
import SellerHome from './Components/SellerHome';
import Logout from './Components/Logout';
import AboutUs from './Components/AboutUs'; // Import AboutUs
import UserManagement from './Components/UserManagement'; // Import UserManagement
import AuctionManagement from './Components/AuctionManagement'; // Import AuctionManagement

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<Home />} />
      <Route path="/admin" element={<Dashboard />} />
      <Route path="/seller-home" element={<SellerHome />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/about" element={<AboutUs />} /> {/* Add AboutUs route */}
      <Route path="/user-management" element={<UserManagement />} /> {/* Add User Management route */}
      <Route path="/auction-management" element={<AuctionManagement />} /> {/* Add Auction Management route */}
    </Routes>
  );
}

export default App;
