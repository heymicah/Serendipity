import React from 'react';
import Navbar from './Navbar';
import './style/Profile.css'

const Profile = () => {

    return (
        <div className="profile-container">
            <Navbar />

            <div className="user-info">
                <div className="user-image">
                    USER IMAGE GOES HERE
                </div>
                <div className="user-text-info">
                    <h1>First Last</h1>
                    <h2>School Name, Graduation Year</h2>
                    <p>Bio - here the user has the option to enter some text about them self...</p>
                    <h2>Interests</h2>
                    <ul>
                        <li>Interest #1</li>
                        <li>Interest #2</li>
                        <li>Interest #3</li>
                    </ul>
                </div>
            </div>

            <div className="user-events">
                <h2>My Events</h2>
            </div>

            
            
        </div>
    )
}

export default Profile;