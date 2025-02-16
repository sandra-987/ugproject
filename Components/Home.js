import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const [items, setItems] = useState([]);
  const [bidAmounts, setBidAmounts] = useState({}); // Store bid amounts for each item
  const [loading, setLoading] = useState(true);
  const [buyerName, setBuyerName] = useState(""); // Track buyer's name in state

  const navigate = useNavigate();

  // Fetch buyer's name from sessionStorage
  useEffect(() => {
    const name = sessionStorage.getItem("buyerName") || "Buyer";
    setBuyerName(name);
  }, []);

  // Fetch active bids
  useEffect(() => {
    const fetchActiveBids = async () => {
      try {
        const response = await fetch("http://localhost:8080/items/active");
        if (!response.ok) {
          throw new Error("Failed to fetch active bids");
        }
        const data = await response.json();
        console.log("Fetched Items:", data); // Log fetched data
        setItems(data);
      } catch (error) {
        console.error("Error fetching active bids:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchActiveBids();
  }, []);
  
  // Handle bid amount change - update only the selected item
  const handleBidAmountChange = (auctionId, value) => {
    setBidAmounts((prevBids) => ({
      ...prevBids,
      [auctionId]: value, // Set bid amount for the specific item
    }));
  };

  // Handle placing a bid
  const handlePlaceBid = async (itemId) => {
    console.log("Item ID received:", itemId); // ✅ Confirm correct ID
  
    if (!itemId) {
      alert("Invalid Item ID. Please try again.");
      return;
    }
  
    const bidAmount = parseFloat(bidAmounts[itemId]);
  
    if (!bidAmount || isNaN(bidAmount) || bidAmount <= 0) {
      /* eslint-disable no-template-curly-in-string */ 
alert(`Please enter a valid bid amount. You entered: ${bidAmounts[itemId]}`);
/* eslint-enable no-template-curly-in-string */

      return;
    }
  
    const buyerId = sessionStorage.getItem("buyerId");
    if (!buyerId) {
      alert("Buyer ID is missing. Please log in again.");
      return;
    }
  
    try {
      const response = await fetch(
        `http://localhost:8080/bids/placeOrUpdate?auctionId=${itemId}&buyerId=${buyerId}&bidAmount=${bidAmount}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
  
      if (response.ok) {
        alert("Bid placed successfully!");
        setBidAmounts((prevBids) => ({
          ...prevBids,
          [itemId]: "", // Clear input field
        }));
  
        // Refresh active auctions
        const updatedResponse = await fetch("http://localhost:8080/items/active");
        const updatedData = await updatedResponse.json();
        setItems(updatedData);
      } else {
        const errorText = await response.text();
        alert(`Failed to place bid: ${errorText}`);
      }
    } catch (error) {
      alert("An error occurred while placing the bid.");
    }
  };
  const isAuctionEnded = (endTime) => {
    const auctionEndTime = new Date(endTime).getTime();
    const currentTime = new Date().getTime();
    return currentTime >= auctionEndTime;
  };
  
  

  // Handle logout
  const handleLogout = () => {
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("buyerName");
    setBuyerName("");
    navigate("/login", { replace: true });
  };

  return (
    <div className="home">
      <header className="header">
        <div className="logo">BidHub</div>
        <nav className="nav">
          <a href="#home">Home</a>
          <a href="#profile">Profile</a>
          <a href="#my-bids">My Bids</a>
        </nav>
        <div className="user-info">
          <span>{buyerName}</span>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>
      <main className="main">
        <h1>Welcome, {buyerName}!</h1>
        <p>Bid on active auctions below.</p>
        

        {loading ? (
          <p>Loading active bids...</p>
        ) : (
          <div className="items-grid">
          {items.length > 0 ? (
            items.map((item) => {
              console.log("Auction Item:", item); // Debugging: Log item details
              console.log("Logged-in Buyer ID:", sessionStorage.getItem("buyerId")); // Debugging: Check stored buyer ID
        
              const isWinner = item.buyer_id && item.buyer_id.toString() === sessionStorage.getItem("buyerId");
        
              return (
                <div className="item-card" key={item.auctionId || item.itemId}>
                  <h2>{item.name}</h2>
                  <p>{item.description}</p>
                  <div className="bid-info">
                    <div>
                      Current Bid: <span>₹{item.lastBidAmount ?? item.startingPrice}</span>
                    </div>
                    <div>
                      Auction Ends At: <span>{item.auctionEndTime ? new Date(item.auctionEndTime).toLocaleString() : "N/A"}</span>
                    </div>
                  </div>
        
                  {isAuctionEnded(item.auctionEndTime) ? (
                    isWinner ? (
                      <p className="winner-message">🎉 Congratulations! You won this auction! 🎉</p>
                    ) : (
                      <p className="auction-ended">Auction Ended</p>
                    )
                  ) : (
                    <>
                      <input
                        type="number"
                        placeholder={`Min bid: ₹${item.lastBidAmount}`}
                        className="bid-input"
                        value={bidAmounts[item.itemId] ?? ""}
                        onChange={(e) => handleBidAmountChange(item.itemId, e.target.value)}
                      />
                      <button className="place-bid-btn" onClick={() => handlePlaceBid(item.itemId)}>
                        Place Bid
                      </button>
                    </>
                  )}
                </div>
              );
            })
          ) : (
            <p>No active bids available.</p>
          )}
        </div>
        
        
        )}
      </main>
    </div>
  );
};

export default Home;
