import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="home-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-content">
          <h1 className="navbar-logo">SERENDIPITY</h1>
          <div className="navbar-links">
            <a href="#" className="nav-link active">HOME</a>
            <a href="#" className="nav-link">EXPLORE</a>
            <a href="#" className="nav-link">PROFILE</a>
          </div>
        </div>
      </nav>

      <div className="home-content">
        {/* Welcome Section */}
        <div className="welcome-section">
          <h2 className="welcome-title">Welcome, {user?.name || 'User'}</h2>
          <p className="welcome-subtitle">DISCOVER • CONNECT • EXPERIENCE</p>
        </div>
      </div>
    </div>
  );
};

export default Home;