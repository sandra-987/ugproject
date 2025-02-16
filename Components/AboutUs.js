import React from 'react';
import './AboutUs.css';  // Assuming you have a CSS file for styling

const AboutUs = () => {
  return (
    <div className="about-us-container">
      <header className="about-us-header">
        <h1>About Us</h1>
      </header>

      <section className="about-us-section">
        <h2>Who We Are</h2>
        <p>
          We are a team of passionate individuals dedicated to providing the
          best products and services to our customers. Our company was founded
          with the mission to innovate and create solutions that make a positive
          impact on our community and the world at large.
        </p>
      </section>

      <section className="about-us-section">
        <h2>Our Mission</h2>
        <p>
          Our mission is simple: to deliver high-quality products that enhance
          the lives of our customers. We strive to ensure that every product we
          create is designed with the utmost care and attention to detail.
        </p>
      </section>

      <section className="about-us-section">
        <h2>Our Values</h2>
        <ul>
          <li>
            <strong>Integrity:</strong> We believe in doing the right thing,
            always.
          </li>
          <li>
            <strong>Innovation:</strong> We are constantly exploring new ideas
            to improve our products and services.
          </li>
          <li>
            <strong>Customer Satisfaction:</strong> Our customers are at the
            heart of everything we do, and we are committed to providing them
            with exceptional experiences.
          </li>
          <li>
            <strong>Sustainability:</strong> We are dedicated to protecting the
            environment and promoting sustainable practices in all aspects of
            our business.
          </li>
        </ul>
      </section>

      <section className="about-us-contact">
        <h2>Contact Us</h2>
        <p>
          If you have any questions or would like to learn more about our
          company, feel free to reach out to us.
        </p>
        <ul>
          <li>
            <strong>Email:</strong> contact@company.com
          </li>
          <li>
            <strong>Phone:</strong> +1 234 567 890
          </li>
          <li>
            <strong>Address:</strong> 123 Company St, City, Country
          </li>
        </ul>
      </section>

      <footer className="about-us-footer">
        <p>&copy; 2025 Company Name | All Rights Reserved</p>
      </footer>
    </div>
  );
};

export default AboutUs;
