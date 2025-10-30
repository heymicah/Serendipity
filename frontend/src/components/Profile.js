import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import './style/Profile.css'

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [attendingEvents, setAttendingEvents] = useState([]);
    const [hostingEvents, setHostingEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Edit mode states
    const [isEditingBio, setIsEditingBio] = useState(false);
    const [editedBio, setEditedBio] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchUserProfile();
        fetchUserEvents();
        fetchHostingEvents();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://127.0.0.1:5001/api/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch profile');
            }

            const data = await response.json();
            setUser(data.user);
            setEditedBio(data.user.bio || '');
        } catch (err) {
            setError(err.message);
        }
    };

    const fetchUserEvents = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://127.0.0.1:5001/api/user/events', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch events');
            }

            const data = await response.json();
            setAttendingEvents(data.events);
        } catch (err) {
            setError(err.message);
        }
    };

    const fetchHostingEvents = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://127.0.0.1:5001/api/user/hosting', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch hosting events');
            }

            const data = await response.json();
            setHostingEvents(data.events);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const handleSaveBio = async () => {
        setSaving(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://127.0.0.1:5001/api/profile/bio', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ bio: editedBio })
            });

            if (!response.ok) {
                throw new Error('Failed to update bio');
            }

            const data = await response.json();
            setUser(data.user);
            setIsEditingBio(false);
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleCancelBio = () => {
        setEditedBio(user.bio || '');
        setIsEditingBio(false);
    };

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

    if (loading || !user) {
        return (
            <div className="profile-container">
                <Navbar />
                <div className="loading-message">Loading profile...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="profile-container">
                <Navbar />
                <div className="error-message">Error: {error}</div>
            </div>
        );
    }

    return (
        <div className="profile-container">
            <Navbar />

            <div className="user-info">
                <div className="user-image">
                    {user.profile_pic ? (
                        <img src={user.profile_pic} alt={`${user.first_name} ${user.last_name}`} />
                    ) : (
                        <div className="default-avatar">
                            {user.first_name[0]}{user.last_name[0]}
                        </div>
                    )}
                </div>
                <div className="user-text-info">
                    <h1>{user.first_name} {user.last_name}</h1>
                    <h2>{user.school}, {getGradYear(user.grade_level)}</h2>
                    
                    {/* Editable Bio Section */}
                    <div className="bio-section">
                        {isEditingBio ? (
                            <div className="edit-bio">
                                <textarea
                                    value={editedBio}
                                    onChange={(e) => setEditedBio(e.target.value)}
                                    placeholder="Tell us about yourself..."
                                    rows={4}
                                    className="bio-textarea"
                                />
                                <div className="edit-buttons">
                                    <button 
                                        onClick={handleSaveBio} 
                                        className="save-btn"
                                        disabled={saving}
                                    >
                                        {saving ? 'Saving...' : 'Save'}
                                    </button>
                                    <button 
                                        onClick={handleCancelBio} 
                                        className="cancel-btn"
                                        disabled={saving}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="bio-display">
                                {user.bio ? (
                                    <p className="user-bio">{user.bio}</p>
                                ) : (
                                    <p className="user-bio placeholder">No bio added yet. Share something about yourself!</p>
                                )}
                                <button onClick={() => setIsEditingBio(true)} className="edit-btn">
                                    Edit Bio &#9998;
                                </button>
                            </div>
                        )}
                    </div>

                    <h3>Interests</h3>
                    {user.interests && user.interests.length > 0 ? (
                        <ul className="interests-list">
                            {user.interests.map((interest, index) => (
                                <li key={index}>{interest}</li>
                            ))}
                        </ul>
                    ) : (
                        <p className="no-interests">No interests added yet.</p>
                    )}
                </div>
            </div>

            {/* Events I'm Hosting */}
            <div className="user-events">
                <h2>Events I'm Hosting</h2>
                {hostingEvents.length === 0 ? (
                    <div className="no-events-message">
                        <p>You haven't created any events yet.</p>
                        <p>Click "Create Event" in the navbar to get started!</p>
                    </div>
                ) : (
                    <div className="events-grid">
                        {hostingEvents.map((event) => (
                            <div
                                key={event.id}
                                className="profile-event-card"
                                onClick={() => navigate(`/event/${event.id}`)}
                                style={{ cursor: 'pointer' }}
                            >
                                {event.image && (
                                    <div className="profile-event-image">
                                        <img src={event.image} alt={event.title} />
                                    </div>
                                )}
                                <div className="profile-event-content">
                                    <h3>{event.title}</h3>
                                    <div className="event-category-badge">{event.category}</div>
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
                                    <div className="event-detail">
                                        <span className="detail-icon">👥</span>
                                        <span>{event.attendees_count || 0} attending</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Events I'm Attending */}
            <div className="user-events">
                <h2>Events I'm Attending</h2>
                {attendingEvents.length === 0 ? (
                    <div className="no-events-message">
                        <p>You haven't registered for any events yet.</p>
                        <p>Explore events and sign up to see them here!</p>
                    </div>
                ) : (
                    <div className="events-grid">
                        {attendingEvents.map((event) => (
                            <div
                                key={event.id}
                                className="profile-event-card"
                                onClick={() => navigate(`/event/${event.id}`)}
                                style={{ cursor: 'pointer' }}
                            >
                                {event.image && (
                                    <div className="profile-event-image">
                                        <img src={event.image} alt={event.title} />
                                    </div>
                                )}
                                <div className="profile-event-content">
                                    <h3>{event.title}</h3>
                                    <div className="event-category-badge">{event.category}</div>
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
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Profile;