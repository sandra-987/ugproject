import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SellerHome.css";

function SellerHome() {
  const [lastBid, setLastBid] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeAuctions, setActiveAuctions] = useState([]);
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [bids, setBids] = useState([]);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startingPrice: "",
    auctionStartTime: "",
    auctionEndTime: "",
  });
  
  const [formErrors, setFormErrors] = useState({
    name: "",
    description: "",
    startingPrice: "",
    auctionStartTime: "",
    auctionEndTime: "",
  });

  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");
  const sellerName = user.name || "Seller";
  const sellerId = sessionStorage.getItem("sellerId");

  // Validation functions
  const validateName = (name) => {
    // Check for special characters or numbers
    if (/[^a-zA-Z\s]/.test(name)) {
      return "Name should only contain letters and spaces";
    }
    
    // Count spaces
    const spaceCount = (name.match(/\s/g) || []).length;
    if (spaceCount > 2) {
      return "Name can only contain up to 2 spaces";
    }
    
    return "";
  };

  const validateDescription = (description) => {
    const wordCount = description.trim().split(/\s+/).length;
    return wordCount <= 30 ? "" : "Description should not exceed 30 words";
  };

  const validateStartingPrice = (price) => {
    const priceRegex = /^\d+(\.\d{1,2})?$/;
    return priceRegex.test(price) ? "" : "Price should be a number with up to 2 decimal places";
  };
  const validateTime = (time, field) => {
    if (!time) return "Time is required";
  
    const selectedTime = new Date(time);
    const currentTime = new Date();
  
    // Normalize both times to ignore seconds and milliseconds
    selectedTime.setSeconds(0, 0);
    currentTime.setSeconds(0, 0);
  
    if (selectedTime < currentTime) {
      return "Selected time cannot be in the past";
    }
  
    if (field === "auctionEndTime" && formData.auctionStartTime) {
      const startTime = new Date(formData.auctionStartTime);
      startTime.setSeconds(0, 0);
  
      if (selectedTime <= startTime) {
        return "End time must be after start time";
      }
    }
  
    return "";
  };
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    // Validate input as user types
    let error = "";
    switch (name) {
      case "name":
        error = validateName(value);
        break;
      case "description":
        error = validateDescription(value);
        break;
      case "startingPrice":
        error = validateStartingPrice(value);
        break;
      case "auctionStartTime":
      case "auctionEndTime":
        error = validateTime(value, name);
        break;
      default:
        break;
    }
    
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!sellerId) {
      alert("You need to be logged in as a seller to upload an item.");
      return;
    }

    // Validate all fields before submission
    const errors = {
      name: validateName(formData.name),
      description: validateDescription(formData.description),
      startingPrice: validateStartingPrice(formData.startingPrice),
      auctionStartTime: validateTime(formData.auctionStartTime, "auctionStartTime"),
      auctionEndTime: validateTime(formData.auctionEndTime, "auctionEndTime"),
    };

    setFormErrors(errors);

    // Check if there are any errors
    if (Object.values(errors).some(error => error !== "")) {
      alert("Please fix the form errors before submitting.");
      return;
    }

    const dataWithSellerId = { ...formData, sellerId };

    fetch(`http://localhost:8080/items/upload?sellerId=${sellerId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataWithSellerId),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          alert("Item uploaded successfully!");
          setActiveAuctions([...activeAuctions, data]);
          // Reset form and errors after successful submission
          setFormData({
            name: "",
            description: "",
            startingPrice: "",
            auctionStartTime: "",
            auctionEndTime: "",
          });
          setFormErrors({
            name: "",
            description: "",
            startingPrice: "",
            auctionStartTime: "",
            auctionEndTime: "",
          });
        } else {
          alert("Error uploading item.");
        }
      })
      .catch((error) => console.error("Error uploading item:", error));
  };

  const toggleDropdown = () => setShowDropdown((prev) => !prev);

  useEffect(() => {
    fetch("http://localhost:8080/items/all")
      .then((res) => res.json())
      .then((data) => setActiveAuctions(data))
      .catch((error) => console.error("Error fetching items:", error));
  }, []);
  useEffect(() => {
    console.log("Updated Bids State:", bids);
  }, [bids]);
  

  useEffect(() => {
    if (selectedAuction) {
      fetch(`http://localhost:8080/items/${selectedAuction.id}/bids`)
        .then((res) => res.json())
        .then((data) => setBids(data))
        .catch((error) => console.error("Error fetching bids:", error));
    }
  }, [selectedAuction]);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login", { replace: true });
  };
  const handleViewDetails = async (item) => {
    if (!item || !item.itemId) {
      console.error("Invalid item object:", item);
      return;
    }
  
    console.log("Item Object:", item);  
    console.log("Auction ID (Using itemId):", item.itemId); // ✅ Debugging log
  
    try {
      const response = await fetch(`http://localhost:8080/bids/lastBid/${item.itemId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch last bid: ${response.statusText}`);
      }
      const bidData = await response.json();
      console.log("Last Bid Data:", bidData);
  
      setLastBid(bidData.bid_amount ? `₹${bidData.bid_amount}` : "No bids yet");
 // Ensure value is set correctly
      setSelectedAuction(item);
      setShowDetailsModal(true);
    } catch (error) {
      console.error("Error fetching last bid:", error);
    }
  };
  
  
  
  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedAuction(null);
    setBids([]);
  };
  return (
    <div className="seller-home">
      <header className="header">
        <h1 className="header-title">BidHub</h1>
        <div className="header-profile">
          <span className="welcome-message">Welcome, {sellerName}!</span>
          <button onClick={toggleDropdown} className="profile-button">
            <span className="material-icons">Settings</span>
          </button>
          {showDropdown && (
            <div className="dropdown">
              <button className="dropdown-item" onClick={() => console.log("Profile Settings")}>
                Profile Settings
              </button>
              <button className="dropdown-item" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="content">
        <section className="auction-section">
          <h2 className="section-title">Active Auctions</h2>
          <div className="auction-grid">
            {activeAuctions.length > 0 ? (
              activeAuctions.map((auction) => (
                <div key={auction.item_id || auction.id} className="auction-card">
                  <h3 className="card-title">{auction.name}</h3>
                  <p className="card-text">
                    Starting Price: <span className="card-highlight">₹{auction.startingPrice}</span>
                  </p>
                  <p className="card-text">
                    Auction Ends: {new Date(auction.auctionEndTime).toLocaleString()}
                  </p>
                  <button className="view-details-btn" onClick={() => handleViewDetails(auction)}>
  View Details
</button>

                </div>
              ))
            ) : (
              <p>No active auctions available.</p>
            )}
          </div>
        </section>
        {showDetailsModal && selectedAuction && (
  <div className="modal-overlay">
    <div className="modal-content">
      <button className="modal-close" onClick={closeDetailsModal}>×</button>
      <h2 className="modal-title">{selectedAuction.name}</h2>
      
      <div className="modal-details">
        <p className="detail-item">
          <span className="detail-label">Description:</span>
          <span className="detail-value">{selectedAuction.description}</span>
        </p>

        <p className="detail-item">
          <span className="detail-label">Auction Start Time:</span>
          <span className="detail-value">
            {new Date(selectedAuction.auctionStartTime).toLocaleString()}
          </span>
        </p>

        <p className="detail-item">
          <span className="detail-label">Auction End Time:</span>
          <span className="detail-value">
            {new Date(selectedAuction.auctionEndTime).toLocaleString()}
          </span>
        </p>

        <p className="detail-item">
  <span className="detail-label">Latest Bid:</span>
  <span className="detail-value">{lastBid}</span>
</p>

      </div>
    </div>
  </div>
)}


        <section className="upload-section">
          <h2 className="section-title">Upload New Item</h2>
          <form className="upload-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Item Name</label>
              <input
                className="form-input"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              {formErrors.name && <span className="error-message">{formErrors.name}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-textarea"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
              {formErrors.description && <span className="error-message">{formErrors.description}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Starting Price</label>
              <input
                className="form-input"
                type="text"
                name="startingPrice"
                value={formData.startingPrice}
                onChange={handleInputChange}
                required
              />
              {formErrors.startingPrice && <span className="error-message">{formErrors.startingPrice}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Auction Start Time</label>
              <input
                className="form-input"
                type="datetime-local"
                name="auctionStartTime"
                value={formData.auctionStartTime}
                onChange={handleInputChange}
                required
              />
              {formErrors.auctionStartTime && <span className="error-message">{formErrors.auctionStartTime}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Auction End Time</label>
              <input
                className="form-input"
                type="datetime-local"
                name="auctionEndTime"
                value={formData.auctionEndTime}
                onChange={handleInputChange}
                required
              />
              {formErrors.auctionEndTime && <span className="error-message">{formErrors.auctionEndTime}</span>}
            </div>
            <button className="form-submit-button" type="submit">
              Upload Item
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}

export default SellerHome;