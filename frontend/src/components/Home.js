import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredEventId, setHoveredEventId] = useState(null);

  // Get user interests (default to sample interests if not available)
  const userInterests = user?.interests || ['Technology', 'Sports'];

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        console.log('=== FETCH EVENTS DEBUG ===');
        console.log('User:', user);
        console.log('User interests:', userInterests);
        console.log('Token:', token ? 'Present' : 'Missing');
        console.log('Token value:', token);

        // Fetch events filtered by user's interests
        const response = await fetch('http://127.0.0.1:5000/api/events?interests_only=true', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('Response received');
        const data = await response.json();
        console.log('API Response:', JSON.stringify(data, null, 2));
        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);

        if (!response.ok) {
          console.error('API Error:', data.message);
          alert(`API Error: ${data.message}. You may need to log out and log back in.`);
          throw new Error(data.message || 'Failed to fetch events');
        }

        if (data.events) {
          console.log('✓ Fetched events:', data.events.length, 'events');
          if (data.events.length > 0) {
            console.log('First event:', data.events[0]);
          }
          setEvents(data.events);
        } else {
          console.log('✗ No events in response');
          console.log('Full data:', data);
          setEvents([]);
        }
      } catch (err) {
        console.error('Error fetching events:', err);
        console.error('Error details:', err.message);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    console.log('useEffect triggered, token present:', !!token);
    if (token) {
      fetchEvents();
    } else {
      console.log('No token, skipping fetch');
    }
  }, [token, userInterests]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleViewEvent = (eventId) => {
    // Navigate to event details page (you can implement this later)
    console.log('Viewing event:', eventId);
    // navigate(`/event/${eventId}`);
  };

  if (loading) {
    return (
      <div className="home-container">
        <nav className="navbar">
          <div className="navbar-content">
            <h1 className="navbar-logo">SERENDIPITY</h1>
            <div className="navbar-links">
              <a href="#" className="nav-link active">Home</a>
              <a href="#" className="nav-link">Explore</a>
            </div>
          </div>
        </nav>
        <div className="home-content">
          <p style={{ textAlign: 'center', fontSize: '18px', marginTop: '40px' }}>Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="home-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-content">
          <h1 className="navbar-logo">SERENDIPITY</h1>
          <div className="navbar-links">
            <a href="#" className="nav-link active">Home</a>
            <a href="#" className="nav-link">Explore</a>
          </div>
        </div>
      </nav>

      <div className="home-content">
        {/* Featured Events Section */}
        <h2 className="section-title">Featured Events For You</h2>

        {events.length === 0 ? (
          <p style={{ textAlign: 'center', fontSize: '18px', marginTop: '40px', color: '#999' }}>
            No events available matching your interests. Try adding more interests to your profile!
          </p>
        ) : (
          <div className="events-grid">
            {events.map((event) => (
              <div
                key={event.id}
                className="event-tile"
                onMouseEnter={() => setHoveredEventId(event.id)}
                onMouseLeave={() => setHoveredEventId(null)}
              >
                <div
                  className="event-tile-image"
                  style={{ backgroundImage: `url(${event.image})` }}
                >
                  <div className={`event-tile-overlay ${hoveredEventId === event.id ? 'hovered' : ''}`}>
                    <div className="event-tile-info">
                      <h3 className="event-tile-title">{event.title}</h3>
                      <p className="event-tile-organizer">{event.organizer}</p>
                      <p className="event-tile-meta">
                        {event.attendees_count} attending · {event.date}
                      </p>
                    </div>
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
  );
};

export default Home;
