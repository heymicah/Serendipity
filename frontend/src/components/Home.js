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
  const [welcomeMessage, setWelcomeMessage] = useState('');

  const welcomeMessages = [
    "Someone new is waiting to meet you today.",
    "A new connection starts now.",
    "Who will you meet today?",
    "Your next friend might be one tap away.",
    "It's a great day to meet someone new."
  ];

  // Set random welcome message on component mount
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * welcomeMessages.length);
    setWelcomeMessage(welcomeMessages[randomIndex]);
  }, []);

  const formatDateTime = (dateStr, timeStr) => {
    try {
      const date = new Date(dateStr);
      const month = date.toLocaleDateString('en-US', { month: 'long' });
      const day = date.getDate();

      // If time is provided, format it
      if (timeStr) {
        return `${month} ${day} • ${timeStr}`;
      }

      return `${month} ${day}`;
    } catch (e) {
      return dateStr;
    }
  };

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
    console.log('View event clicked, eventId:', eventId);
    navigate(`/event/${eventId}`);
  };

  return (
    <div className="home-container">
      <Navbar />

      <div className="home-content">
        {/* Welcome Section */}
        <div className="welcome-section">
          <h2 className="welcome-title">{welcomeMessage}</h2>
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
                    <div className="event-gradient-overlay"></div>
                    <div className="event-info">
                      <h4 className="event-title">{event.title}</h4>
                      <p className="event-host">{event.host}</p>
                      <p className="event-datetime">
                        {formatDateTime(event.date, event.time)}
                      </p>
                      <p className="event-attending">{event.attendees_count || 0} attending</p>
                    </div>
                    <div className="event-hover-overlay">
                      <button
                        className="view-event-button"
                        onClick={() => handleViewEvent(event.id)}
                      >
                        View Event
                      </button>
                    </div>
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