import React from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/login");
  };

  return (
    <div className="landing-container">
      <header className="landing-header">
        <h1 className="logo">BidHub</h1>
        <nav>
          <ul className="nav-links">
            <li><a href="/about">About Us</a></li>
            <li><a href="#how-it-works">How It Works</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
      </header>
      <main className="landing-main">
        <h2>Welcome to BidHub</h2>
        <p>Your premier destination for online auctions. Buy unique items, sell your products, or manage the platform with our intuitive bidding system.</p>
        <button className="btn-get-started" onClick={handleGetStarted}>
          Get Started
        </button>
        <div className="features">
          <div className="feature-card">
            <h3>For Buyers</h3>
            <p>Discover unique items and place bids in real-time. Get the best deals on exclusive products.</p>
          </div>
          <div className="feature-card">
            <h3>For Sellers</h3>
            <p>List your items and reach potential buyers. Manage your auctions with our powerful tools.</p>
          </div>
          <div className="feature-card">
            <h3>Secure Bidding</h3>
            <p>Our platform ensures safe and transparent transactions for all users.</p>
          </div>
        </div>
      </main>
      <footer className="landing-footer">
        <p>© 2025 BidHub. All Rights Reserved.</p>
        <div className="contact-info">
          <p><strong>Contact Us:</strong></p>
          <p>Email: support@bidhub.com</p>
          <p>Phone: +1 (555) 123-4567</p>
          <p>Address: 123 Auction Street, Bid City, 814112</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
