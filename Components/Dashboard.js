import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';  // Import useNavigate for navigation
import './Dashboard.css';

const Dashboard = () => {
  const [totalUsers, setTotalUsers] = useState(null); // State to store the total number of users
  const [totalBids, setTotalBids] = useState(null);   // State to store the total number of bids
  const [activeAuctions, setActiveAuctions] = useState(0); // State for active auctions
  const navigate = useNavigate(); // Initialize navigate hook

  useEffect(() => {
    // Function to fetch the total number of users
    const fetchTotalUsers = async () => {
      try {
        const response = await fetch('http://localhost:8080/users/count');
        if (response.ok) {
          const data = await response.json();
          setTotalUsers(data); // Store the total users in state
        } else {
          console.error('Failed to fetch total users');
        }
      } catch (error) {
        console.error('Error fetching total users:', error);
      }
    };

    // Function to fetch the total number of bids
    const fetchTotalBids = async () => {
      try {
        const response = await fetch('http://localhost:8080/bids/count');
        if (response.ok) {
          const data = await response.json();
          setTotalBids(data); // Store the total bids in state
        } else {
          console.error('Failed to fetch total bids');
        }
      } catch (error) {
        console.error('Error fetching total bids:', error);
      }
    };

    // Fetch total users and total bids
    fetchTotalUsers();
    fetchTotalBids();
  }, []); // Empty dependency array means this will run only once when the component mounts

  const handleLogout = () => {
    // Remove token or user data from storage
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');

    // Navigate to login page
    navigate('/login', { replace: true });
  };

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <h2>BidHub Admin</h2>
        <ul>
          <li className="active">Dashboard</li>
          <li><Link to="/user-management">Seller Management</Link></li>
          <li><Link to="/auction-management">Auction Management</Link></li>
          <li>Settings</li>
        </ul>
      </aside>
      <main className="main-content">
        <header className="header">
          <span className="bell-icon">🔔</span>
          <span className="admin-user">Admin User</span>
          <button className="logout-btn" onClick={handleLogout}>Logout</button> {/* Logout button */}
        </header>
        <section className="overview">
          <div className="card">
            <p>Total Users</p>
            <h3>{totalUsers !== null ? totalUsers : 'Loading...'}</h3> {/* Dynamically display total users */}
            <span>+12.5%</span>
          </div>
          <div className="card">
            <p>Active Auctions</p>
            <h3>{activeAuctions}</h3>
            <span>+8.2%</span>
          </div>
          <div className="card">
            <p>Total Bids</p>
            <h3>{totalBids !== null ? totalBids : 'Loading...'}</h3> {/* Dynamically display total bids */}
            <span>0%</span>
          </div>
          
        </section>
        
      </main>
    </div>
  );
};

export default Dashboard;
