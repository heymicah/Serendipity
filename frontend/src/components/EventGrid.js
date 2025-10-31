import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './style/EventGrid.css';
import Navbar from './Navbar';

const EventGrid = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, [category]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const response = await fetch(`http://localhost:5001/api/events/category/${category}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }

      const data = await response.json();
      setEvents(data.events);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleViewEvent = (eventId) => {
    navigate(`/event/${eventId}`);
  };

  if (loading) {
    return (
      <div className="event-grid-container">
        <Navbar />
        <div className="loading-state">Loading events...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="event-grid-container">
        <Navbar />
        <div className="error-state">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="event-grid-container">
      <Navbar />

      <div className="event-grid-header">
        <button
          className="back-button"
          onClick={() => navigate('/explore')}
        >
          ← Back to Explore
        </button>
        <h2>{category} Events</h2>
        <p>{events.length} {events.length === 1 ? 'event' : 'events'} available</p>
      </div>

      {events.length === 0 ? (
        <div className="no-events">
          <p>No events found in this category yet.</p>
          <p>Check back soon!</p>
        </div>
      ) : (
        <div className="pinterest-grid">
          {events.map((event) => (
            <div
              key={event.id}
              className="event-card"
              onClick={() => handleViewEvent(event.id)}
            >
              {event.image && (
                <div className="event-image">
                  <img src={event.image} alt={event.title} />
                  <div className="event-hover-overlay">
                    <button className="view-event-button">
                      View Event
                    </button>
                  </div>
                </div>
              )}
              <div className="event-content">
                <h3>{event.title}</h3>
                {event.date && (
                  <div className="event-detail">
                    <span className="detail-icon">📅</span>
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                )}
                {event.time && (
                  <div className="event-detail">
                    <span className="detail-icon">🕐</span>
                    <span>{event.time}</span>
                  </div>
                )}
                {event.location && (
                  <div className="event-detail">
                    <span className="detail-icon">📍</span>
                    <span>{event.location}</span>
                  </div>
                )}
                {event.description && (
                  <p className="event-description">{event.description}</p>
                )}
                {event.host && (
                  <div className="event-host">
                    <span>Hosted by {event.host}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventGrid;
