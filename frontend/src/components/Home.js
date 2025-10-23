import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './style/Home.css';
import Navbar from './Navbar';

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
      <Navbar />

      <div className="home-content">
        {/* Welcome Section */}
        <div className="welcome-section">
          <h2 className="welcome-title">Welcome, {user?.name || 'User'}👋</h2>
          <p className="welcome-subtitle">DISCOVER • CONNECT • EXPERIENCE</p>
        </div>
      </div>
    </div>
  );
};

export default Home;