import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './style/EventDetail.css';
import Navbar from './Navbar';

const EventDetail = () => {
  const { eventId } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [hostProfile, setHostProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventDetail = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5001/api/events/${eventId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch event details');
        }

        const data = await response.json();
        setEvent(data.event || data);

        // Fetch host profile information if host_id is available
        if (data.event?.host_id) {
          fetchHostProfile(data.event.host_id);
        }

        setError(null);
      } catch (err) {
        console.error('Error fetching event:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchHostProfile = async (hostId) => {
      try {
        const response = await fetch(`http://localhost:5001/api/user/${hostId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setHostProfile(data.user);
        }
      } catch (err) {
        console.error('Error fetching host profile:', err);
      }
    };

    if (token && eventId) {
      fetchEventDetail();
    }
  }, [eventId, token]);

  const handleBack = () => {
    navigate('/home');
  };

  const handleSignUp = async () => {
    // TODO: Implement sign up functionality
    console.log('Sign up for event:', eventId);
  };

  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    } catch (e) {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="event-detail-container">
        <Navbar />
        <div className="event-detail-loading">Loading event details...</div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="event-detail-container">
        <Navbar />
        <div className="event-detail-error">Error loading event details</div>
      </div>
    );
  }

  return (
    <div className="event-detail-container">
      <Navbar />

      <div className="event-detail-modal">
        {/* Back Button */}
        <button className="back-button" onClick={handleBack}>
          ← Back
        </button>

        <div className="event-detail-content">
          {/* Left side - Event Image */}
          <div className="event-detail-image-section">
            <img
              src={event.image}
              alt={event.title}
              className="event-detail-image"
            />
          </div>

          {/* Right side - Event Information */}
          <div className="event-detail-info-section">
            {/* Host Info */}
            <div className="event-detail-host">
              <div className="host-avatar">
                {hostProfile?.profile_pic ? (
                  <img
                    src={hostProfile.profile_pic}
                    alt={event.host}
                    className="host-avatar-image"
                  />
                ) : (
                  <div className="host-avatar-placeholder">
                    {event.host?.charAt(0) || 'U'}
                  </div>
                )}
              </div>
              <div className="host-name">{event.host || 'Unknown Host'}</div>
            </div>

            {/* Event Title and Category */}
            <h1 className="event-detail-title">{event.title}</h1>
            <p className="event-detail-category">{event.category}</p>

            {/* Event Description */}
            <p className="event-detail-description">{event.description}</p>

            {/* Event Details */}
            <div className="event-detail-info-grid">
              <div className="info-row">
                <span className="info-label">DATE</span>
                <span className="info-value">{formatDate(event.date)}</span>
              </div>

              <div className="info-row">
                <span className="info-label">TIME</span>
                <span className="info-value">{event.time || 'TBA'}</span>
              </div>

              <div className="info-row">
                <span className="info-label">LOCATION</span>
                <span className="info-value">{event.location || 'TBA'}</span>
              </div>

              <div className="info-row">
                <span className="info-label">SCHOOL YEARS</span>
                <span className="info-value">{event.school_years || 'All'}</span>
              </div>

              <div className="info-row">
                <span className="info-label">GENDERS</span>
                <span className="info-value">{event.genders || 'All'}</span>
              </div>
            </div>

            {/* Sign Up Button and Attendees */}
            <div className="event-detail-actions">
              <button className="sign-up-button" onClick={handleSignUp}>
                Sign Up
              </button>
              <p className="attendees-count">{event.attendees_count || 0} Attending</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
