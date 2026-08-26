// frontend/src/pages/Profile.js
import React from 'react';
import { Link } from 'react-router-dom';

function Profile() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="container">
      <nav className="navbar">
        <h2>Profile</h2>
        <div>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/projects">Projects</Link>
          <Link to="/tasks">Tasks</Link>
          <Link to="/calendar">Calendar</Link>
          <Link to="/reports">Reports</Link>
          <Link to="/profile">Profile</Link>
          <button onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
          }}>Logout</button>
        </div>
      </nav>

      <h1>My Profile</h1>
      <div className="profile-card">
        <h3>Name: {user.name}</h3>
        <p>Email: {user.email}</p>
      </div>
    </div>
  );
}

export default Profile;