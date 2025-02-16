import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from './Header'; // Import Header component
import './Login.css';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const response = await axios.post('http://localhost:8080/users/login', {
        email,
        password,
      });

      if (response.status === 200) {
        const user = response.data;

        // Store user data in sessionStorage
        sessionStorage.setItem('user', JSON.stringify(user));
        sessionStorage.setItem('role', user.role); // Store role separately

        // Store ID based on role
        if (user.role === 1) {
          sessionStorage.setItem('buyerId', user.id);
        } else if (user.role === 2) {
          sessionStorage.setItem('sellerId', user.id);
        }

        // Redirect based on role
        switch (user.role) {
          case 1:
            alert('Login successful as Buyer!');
            navigate('/home', { replace: true });
            break;
          case 2:
            alert('Login successful as Seller!');
            navigate('/seller-home', { replace: true });
            break;
          case 3:
            alert('Login successful as Admin!');
            navigate('/admin', { replace: true });
            break;
          default:
            setErrorMessage('Invalid role.');
        }
      }
    } catch (error) {
      setErrorMessage('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header /> {/* ✅ Add Header here */}
      <div className="login-container">
        <div className="login-box">
          <h2 className="registration-heading">Login</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {errorMessage && <div className="error-message">{errorMessage}</div>}

            <button type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p>
            Don't have an account? <a href="/register">Register here</a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
