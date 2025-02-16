import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AuctionManagement.css";

const AuctionManagement = () => {
  const [items, setItems] = useState([]); // State to store fetched items
  const [loadingItems, setLoadingItems] = useState(true); // Loading state for items
  const [error, setError] = useState(null); // State to handle errors

  // Fetch items when the component mounts
  useEffect(() => {
    axios
      .get("http://localhost:8080/items/active") // Replace with your API endpoint
      .then((response) => {
        setItems(response.data); // Set items data from the response
        setLoadingItems(false); // Stop loading for items
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
        setError("Failed to fetch items. Please try again later."); // Set error message
        setLoadingItems(false); // Stop loading even if there's an error
      });
  }, []);

  return (
    <div className="user-management">
      <h2>Item Table</h2>

      {loadingItems ? (
        <div>Loading items...</div> // Show loading text while fetching data
      ) : error ? (
        <div className="error-message">{error}</div> // Display error message if any
      ) : (
        <div className="item-list">
          {items.length === 0 ? (
            <p>No items found.</p> // Display if no items are found
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Description</th>
                  <th>Starting Price</th>
                  <th>Last Bid Amount</th> {/* New column added */}
                  <th>Auction Start Time</th>
                  <th>Auction End Time</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.itemId}>
                    <td>{item.name}</td>
                    <td>{item.description}</td>
                    <td>${item.startingPrice.toFixed(2)}</td>
                    <td>${item.lastBidAmount ? item.lastBidAmount.toFixed(2) : "No bids yet"}</td> {/* Last Bid Amount */}
                    <td>{new Date(item.auctionStartTime).toLocaleString()}</td>
                    <td>{new Date(item.auctionEndTime).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default AuctionManagement;
