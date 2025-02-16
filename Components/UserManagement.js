import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserManagement.css';

const UserManagement = () => {
  const [sellers, setSellers] = useState([]); // State to store fetched sellers
  const [items, setItems] = useState([]); // State to store fetched items
  const [loadingSellers, setLoadingSellers] = useState(true); // Loading state for sellers
  const [loadingItems, setLoadingItems] = useState(true); // Loading state for items

  // Fetch sellers when the component mounts
  useEffect(() => {
    axios.get('http://localhost:8080/api/get-sellers')
      .then(response => {
        setSellers(response.data); // Set sellers data from the response
        setLoadingSellers(false); // Stop loading for sellers
      })
      .catch(error => {
        console.error("Error fetching sellers", error);
        setLoadingSellers(false); // Stop loading even if there is an error
      });

    // Fetch items when the component mounts
    axios.get('http://localhost:8080/api/get-items')
      .then(response => {
        setItems(response.data); // Set items data from the response
        setLoadingItems(false); // Stop loading for items
      })
      .catch(error => {
        console.error("Error fetching items", error);
        setLoadingItems(false); // Stop loading even if there is an error
      });
  }, []);

  return (
    <div className="user-management">
      <h2>Seller Management</h2>

      {/* Sellers Header with Count and Icon */}
      <div className="sellers-header">
        <h3>🛒 Sellers ({sellers.length})</h3>
      </div>

      {/* Sellers Table */}
      <h3>Sellers</h3>
      {loadingSellers ? (
        <div>Loading sellers...</div> // Show loading text if still fetching
      ) : (
        <div className="seller-list">
          {sellers.length === 0 ? (
            <p>No sellers found.</p> // Display if no sellers are found
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {sellers.map(seller => (
                  <tr key={seller.id}>
                    <td>
                      <div className="name-container">
                        <div className="name-letter">
                          {seller.name.charAt(0).toUpperCase()} {/* First letter icon */}
                        </div>
                        {seller.name}
                      </div>
                    </td>
                    <td>
                      <div className="email-container">
                        <span className="email-icon">📩</span> {/* Envelope icon */}
                        {seller.email}
                      </div>
                    </td>
                    <td>{seller.role === 2 ? 'Seller' : 'Other'}</td>
                    <td className="status-active">Active</td> {/* Showing "Active" Status */}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Items Table */}
    
      
    </div>
  );
};

export default UserManagement;
