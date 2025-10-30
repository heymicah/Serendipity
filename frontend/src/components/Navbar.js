import React, {useState} from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './style/navstyle.css';
import CreateEvent from './CreateEvent';

const Navbar = ({ onCreateEvent }) => {
    const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
    const navigate = useNavigate();

    const handleEventCreated = (newEvent) => {
        // Close modal and optionally navigate to the new event
        setIsCreateEventOpen(false);
        navigate(`/event/${newEvent.id}`);
    };
    return (
      <>
      <nav className="navbar">
        <div className="navbar-content">
          <h1 className="navbar-logo">Serendipity</h1>
          <div className="navbar-links">
            <button 
              className="nav-link create-event-btn" 
              onClick={() => setIsCreateEventOpen(true)}
          >
              + CREATE EVENT
          </button>
            <NavLink
            to="/home"
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            HOME
          </NavLink>
          <NavLink
            to="/explore"
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            EXPLORE
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            PROFILE
          </NavLink>
          </div>
        </div>
      </nav>

      <CreateEvent
                isOpen={isCreateEventOpen}
                onClose={() => setIsCreateEventOpen(false)}
                onEventCreated={handleEventCreated}
            />
      </>
      )
}

export default Navbar;