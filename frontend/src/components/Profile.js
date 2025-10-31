import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';
import EditEvent from './EditEvent';
import './style/Profile.css'

const Profile = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [user, setUser] = useState(null);
    const [attendingEvents, setAttendingEvents] = useState([]);
    const [hostingEvents, setHostingEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Edit mode states
    const [isEditingBio, setIsEditingBio] = useState(false);
    const [editedBio, setEditedBio] = useState('');
    const [isEditingInterests, setIsEditingInterests] = useState(false);
    const [editedInterests, setEditedInterests] = useState([]);
    const [saving, setSaving] = useState(false);

    // Edit event modal state
    const [isEditEventModalOpen, setIsEditEventModalOpen] = useState(false);
    const [selectedEventId, setSelectedEventId] = useState(null);

    const interestOptions = [
        'Sports', 'Music', 'Art', 'Technology', 'Science',
        'Reading', 'Gaming', 'Cooking', 'Travel'
    ];

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
            setEditedInterests(data.user.interests || []);
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

    const handleInterestToggle = (interest) => {
        setEditedInterests(prev =>
            prev.includes(interest)
                ? prev.filter(i => i !== interest)
                : [...prev, interest]
        );
    };

    const handleSaveInterests = async () => {
        if (editedInterests.length === 0) {
            setError('Please select at least one interest');
            return;
        }

        setSaving(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://127.0.0.1:5001/api/profile/interests', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ interests: editedInterests })
            });

            if (!response.ok) {
                throw new Error('Failed to update interests');
            }

            const data = await response.json();
            setUser(data.user);
            setIsEditingInterests(false);
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleCancelInterests = () => {
        setEditedInterests(user.interests || []);
        setIsEditingInterests(false);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleEditEvent = (eventId, e) => {
        e.stopPropagation(); // Prevent navigation to event detail page
        setSelectedEventId(eventId);
        setIsEditEventModalOpen(true);
    };

    const handleEventUpdated = (updatedEvent) => {
        // Refresh the hosting events list
        fetchHostingEvents();
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
                    <div className="profile-header">
                        <div>
                            <h1>{user.first_name} {user.last_name}</h1>
                            <h2>{user.school}, {getGradYear(user.grade_level)}</h2>
                        </div>
                        <button onClick={handleLogout} className="logout-btn">
                            Logout
                        </button>
                    </div>
                    
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
                    {isEditingInterests ? (
                        <div className="edit-interests">
                            <div className="interests-container">
                                {interestOptions.map(interest => (
                                    <div
                                        key={interest}
                                        className={`interest-bubble ${editedInterests.includes(interest) ? 'selected' : ''}`}
                                        onClick={() => handleInterestToggle(interest)}
                                    >
                                        {interest}
                                    </div>
                                ))}
                            </div>
                            <div className="edit-buttons">
                                <button
                                    onClick={handleSaveInterests}
                                    className="save-btn"
                                    disabled={saving}
                                >
                                    {saving ? 'Saving...' : 'Save'}
                                </button>
                                <button
                                    onClick={handleCancelInterests}
                                    className="cancel-btn"
                                    disabled={saving}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="interests-display">
                            {user.interests && user.interests.length > 0 ? (
                                <ul className="interests-list">
                                    {user.interests.map((interest, index) => (
                                        <li key={index}>{interest}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="no-interests">No interests added yet.</p>
                            )}
                            <button onClick={() => setIsEditingInterests(true)} className="edit-btn">
                                Edit Interests &#9998;
                            </button>
                        </div>
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
                                className="profile-event-card hosting-event-card"
                                onClick={() => navigate(`/event/${event.id}`)}
                                style={{ cursor: 'pointer' }}
                            >
                                {event.image && (
                                    <div className="profile-event-image">
                                        <img src={event.image} alt={event.title} />
                                    </div>
                                )}
                                <div className="profile-event-content">
                                    <div className="event-header-with-edit">
                                        <h3>{event.title}</h3>
                                        <button
                                            className="edit-event-btn"
                                            onClick={(e) => handleEditEvent(event.id, e)}
                                            title="Edit event"
                                        >
                                            ✏️ Edit
                                        </button>
                                    </div>
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

            {/* Edit Event Modal */}
            <EditEvent
                isOpen={isEditEventModalOpen}
                onClose={() => setIsEditEventModalOpen(false)}
                eventId={selectedEventId}
                onEventUpdated={handleEventUpdated}
            />
        </div>
    )
}

export default Profile;