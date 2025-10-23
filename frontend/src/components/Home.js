import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './style/Home.css';
import Navbar from './Navbar';

const Home = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5001/api/events/all?interests_only=true', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }

        const data = await response.json();
        setEvents(data.events || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchEvents();
    }
  }, [token]);

  const handleViewEvent = (eventId) => {
    // TODO: Navigate to event detail page
    console.log('View event:', eventId);
  };

  return (
    <div className="home-container">
      <Navbar />

      <div className="home-content">
        {/* Welcome Section */}
        <div className="welcome-section">
          <h2 className="welcome-title">Welcome, {user?.first_name || 'User'}</h2>
          <p className="welcome-subtitle">DISCOVER • CONNECT • EXPERIENCE</p>
        </div>

        {/* Featured Events Section */}
        <div className="featured-section">
          <h3 className="section-title">Featured Events For You</h3>

          {loading && <p className="loading-text">Loading events...</p>}

          {error && <p className="error-text">Error: {error}</p>}

          {!loading && !error && events.length === 0 && (
            <p className="no-events-text">No events available at the moment.</p>
          )}

          {!loading && !error && events.length > 0 && (
            <div className="events-grid">
              {events.map((event) => (
                <div key={event.id} className="event-tile">
                  <div className="event-image-container">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="event-image"
                    />
                    <div className="event-overlay">
                      <button
                        className="view-event-button"
                        onClick={() => handleViewEvent(event.id)}
                      >
                        View Event
                      </button>
                    </div>
                  </div>
                  <div className="event-info">
                    <h4 className="event-title">{event.title}</h4>
                    <p className="event-host">{event.host}</p>
                    <p className="event-attending">{event.attending || '5 attending'} • {event.date}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;