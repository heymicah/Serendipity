import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './style/UserProfileModal.css';

const UserProfileModal = ({ isOpen, onClose, userId }) => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserProfile = async () => {
    console.log('Fetching user profile for userId:', userId);
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`http://127.0.0.1:5001/api/user/${userId}?full=true`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Profile fetch response status:', response.status);

      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }

      const data = await response.json();
      console.log('User profile data:', data);
      setUserProfile(data.user);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setError('Failed to load user profile');
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('UserProfileModal useEffect - isOpen:', isOpen, 'userId:', userId);
    if (isOpen && userId) {
      fetchUserProfile();
    }
  }, [isOpen, userId]);

  const getGradYear = (gradeLevel) => {
    const currentYear = new Date().getFullYear();
    const gradeLevels = {
      'Freshman': 4,
      'Sophomore': 3,
      'Junior': 2,
      'Senior': 1,
      'Graduate': 0
    };
    const yearsUntilGrad = gradeLevels[gradeLevel] || 0;
    return yearsUntilGrad > 0 ? currentYear + yearsUntilGrad : 'Graduate';
  };

  const handleEventClick = (eventId) => {
    onClose();
    navigate(`/event/${eventId}`);
  };

  if (!isOpen) {
    console.log('UserProfileModal is closed, not rendering');
    return null;
  }

  console.log('UserProfileModal is rendering with isOpen:', isOpen, 'loading:', loading);

  return (
    <div className="user-profile-overlay" onClick={onClose}>
      <div className="user-profile-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-modal-btn" onClick={onClose}>&times;</button>

        {loading ? (
          <div className="profile-loading">Loading profile...</div>
        ) : error ? (
          <div className="profile-error">{error}</div>
        ) : userProfile ? (
          <div className="user-profile-content">
            {/* Header Section */}
            <div className="profile-header-section">
              <div className="profile-avatar-large">
                {userProfile.profile_pic ? (
                  <img src={userProfile.profile_pic} alt={`${userProfile.first_name} ${userProfile.last_name}`} />
                ) : (
                  <div className="profile-avatar-placeholder-large">
                    {userProfile.first_name[0]}{userProfile.last_name[0]}
                  </div>
                )}
              </div>
              <div className="profile-header-info">
                <h2>{userProfile.first_name} {userProfile.last_name}</h2>
                {userProfile.school && (
                  <p className="profile-school">
                    {userProfile.school}
                    {userProfile.grade_level && `, ${getGradYear(userProfile.grade_level)}`}
                  </p>
                )}
              </div>
            </div>

            {/* Bio Section */}
            {userProfile.bio && (
              <div className="profile-section">
                <h3>About</h3>
                <p className="profile-bio">{userProfile.bio}</p>
              </div>
            )}

            {/* Interests Section */}
            {userProfile.interests && userProfile.interests.length > 0 && (
              <div className="profile-section">
                <h3>Interests</h3>
                <div className="profile-interests">
                  {userProfile.interests.map((interest, index) => (
                    <span key={index} className="interest-tag">{interest}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Hosting Events Section */}
            <div className="profile-section">
              <h3>Hosting Events</h3>
              {userProfile.hosting_events && userProfile.hosting_events.length > 0 ? (
                <div className="profile-events-list">
                  {userProfile.hosting_events.map((event) => (
                    <div
                      key={event.id}
                      className="profile-event-item"
                      onClick={() => handleEventClick(event.id)}
                    >
                      {event.image && (
                        <div className="profile-event-image-small">
                          <img src={event.image} alt={event.title} />
                        </div>
                      )}
                      <div className="profile-event-info">
                        <h4>{event.title}</h4>
                        <div className="profile-event-category">{event.category}</div>
                        <div className="profile-event-details">
                          {event.date && (
                            <span>
                              📅 {new Date(event.date).toLocaleDateString()}
                            </span>
                          )}
                          {event.time && (
                            <span>🕐 {event.time}</span>
                          )}
                          {event.location && (
                            <span>📍 {event.location}</span>
                          )}
                        </div>
                        <div className="profile-event-attendees">
                          👥 {event.attendees_count || 0} attending
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-events-text">Not hosting any events currently</p>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default UserProfileModal;
