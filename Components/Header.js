import React from "react";
import { Link } from "react-router-dom";
import "./Header.css"; // Ensure you have styles

const Header = () => {
  return (
    <header className="header">
      <div className="logo">BidHub</div>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About Us</Link></li>
          <li><Link to="/how-it-works">How It Works</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
