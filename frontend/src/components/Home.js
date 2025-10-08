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
      <nav className="navbar">
        <h1>Serendipity</h1>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </nav>
      <div className="home-content">
        <div className="welcome-section">
          <h2>Welcome, {user?.name}!</h2>
          <p>Email: {user?.email}</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
