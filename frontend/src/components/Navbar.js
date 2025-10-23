import React from 'react';
import { NavLink } from 'react-router-dom';
import './style/navstyle.css';

const Navbar = ({ onCreateEvent }) => {
    return (
      <nav className="navbar">
        <div className="navbar-content">
          <h1 className="navbar-logo">Serendipity</h1>
          <div className="navbar-links">
            <NavLink
            to="/home"
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            HOME
          </NavLink>
          {onCreateEvent && (
            <button className="nav-link create-event-btn" onClick={onCreateEvent}>
              CREATE EVENT
            </button>
          )}
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
      )
}

export default Navbar;