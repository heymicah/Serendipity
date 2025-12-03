import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './style/AttendeesModal.css';

const AttendeesModal = ({ isOpen, onClose, eventId, onAttendeeClick }) => {
  const { token } = useAuth();
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAttendees = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`http://127.0.0.1:5001/api/events/${eventId}/attendees`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch attendees');
      }

      const data = await response.json();
      setAttendees(data.attendees || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching attendees:', error);
      setError('Failed to load attendees');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && eventId) {
      fetchAttendees();
    }
  }, [isOpen, eventId]);

  const handleAttendeeClick = (userId) => {
    onAttendeeClick(userId);
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="attendees-overlay" onClick={onClose}>
      <div className="attendees-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-modal-btn" onClick={onClose}>&times;</button>

        <div className="attendees-content">
          <h2>Attending Buddies</h2>

          {loading ? (
            <div className="attendees-loading">Loading attendees...</div>
          ) : error ? (
            <div className="attendees-error">{error}</div>
          ) : attendees.length === 0 ? (
            <p className="no-attendees-text">No one has RSVP'd yet</p>
          ) : (
            <>
              <p className="attendees-count">{attendees.length} {attendees.length === 1 ? 'person' : 'people'} attending</p>
              <div className="attendees-list">
                {attendees.map((attendee) => (
                  <div
                    key={attendee.id}
                    className="attendee-item"
                    onClick={() => handleAttendeeClick(attendee.id)}
                  >
                    <div className="attendee-avatar">
                      {attendee.profile_pic ? (
                        <img src={attendee.profile_pic} alt={`${attendee.first_name} ${attendee.last_name}`} />
                      ) : (
                        <div className="attendee-avatar-placeholder">
                          {attendee.first_name[0]}{attendee.last_name[0]}
                        </div>
                      )}
                    </div>
                    <div className="attendee-info">
                      <h4>{attendee.first_name} {attendee.last_name}</h4>
                      {attendee.school && (
                        <p className="attendee-school">{attendee.school}</p>
                      )}
                      {attendee.grade_level && (
                        <p className="attendee-grade">{attendee.grade_level}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendeesModal;
