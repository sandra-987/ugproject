import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState(1);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // **Validation Functions**
  const isValidName = (name) => /^[A-Za-z ]+$/.test(name); // Only letters and spaces
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); // Basic email regex
  const isValidPassword = (password) => password.length >= 8; // Min 8 characters

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // **Validations**
    if (!isValidName(name)) {
      setErrorMessage('Name should only contain letters and spaces.');
      return;
    }

    if (!isValidEmail(email)) {
      setErrorMessage('Invalid email format.');
      return;
    }

    if (!isValidPassword(password)) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match!');
      return;
    }

    if (![1, 2, 3].includes(role)) {
      setErrorMessage('Please select a valid role.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8080/users/register', {
        name,
        email,
        password,
        confirmPassword,
        role,
      });

      if (response.status === 201) {
        alert('Registration successful!');
        setTimeout(() => navigate('/login'), 100);
      }
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.message || 'Error registering. Please try again.');
      } else {
        setErrorMessage('Network error. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2 className="registration-heading">Register</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Role</label>
            <div className="role-options">
              <label>
                <input type="radio" name="role" value={1} checked={role === 1} onChange={() => setRole(1)} disabled={loading} />
                Buyer
              </label>
              <label>
                <input type="radio" name="role" value={2} checked={role === 2} onChange={() => setRole(2)} disabled={loading} />
                Seller
              </label>
              <label>
                <input type="radio" name="role" value={3} checked={role === 3} onChange={() => setRole(3)} disabled />
                Admin (Not Allowed)
              </label>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {errorMessage && <div className="error-message">{errorMessage}</div>}

          <button type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="login-link">
          Already have an account? <a href="/login">Login here</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
