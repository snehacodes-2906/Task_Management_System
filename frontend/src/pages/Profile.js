// frontend/src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Profile.css';

function Profile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Stats state
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
    completionRate: 0,
    totalProjects: 0
  });
  const [loading, setLoading] = useState(true);

  // Fetch stats on load
  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [reportsRes, projectsRes] = await Promise.all([
        api.get('/reports'),
        api.get('/projects')
      ]);
      
      setStats({
        ...reportsRes.data,
        totalProjects: projectsRes.data.length
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleSave = (e) => {
    e.preventDefault();
    const updatedUser = { ...user, name, email };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setIsEditing(false);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    alert('Password updated successfully!');
    setShowPasswordModal(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  return (
    <div className="profile-page">
      {/* Navbar */}
      <nav className="profile-navbar">
        <div className="brand">
          <div className="brand-icon">✓</div>
          Task Manager
        </div>
        <div className="nav-links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/projects">Projects</Link>
          <Link to="/tasks">Tasks</Link>
          <Link to="/calendar">Calendar</Link>
          <Link to="/reports">Reports</Link>
          <Link to="/profile" className="active">Profile</Link>
        </div>
        <div className="nav-actions">
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div className="profile-container">
        {/* Header */}
        <div className="profile-header">
          <div>
            <h1>Profile</h1>
            <p className="subtitle">Manage your account settings</p>
          </div>
          <div className="header-actions">
            {isEditing ? (
              <>
                <button className="btn-save" onClick={handleSave}>Save Changes</button>
                <button className="btn-cancel" onClick={() => setIsEditing(false)}>Cancel</button>
              </>
            ) : (
              <button className="btn-edit" onClick={() => setIsEditing(true)}>Edit Profile</button>
            )}
          </div>
        </div>

        {/* Profile Card */}
        <div className="profile-card">
          <div className="profile-avatar">
            <span className="avatar-initials">
              {getInitials(name)}
            </span>
          </div>
          
          <div className="profile-details">
            {isEditing ? (
              <form onSubmit={handleSave} className="profile-form">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </form>
            ) : (
              <div className="profile-info">
                <div className="info-row">
                  <span className="info-label">Full Name</span>
                  <span className="info-value">{name || 'Not set'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Email</span>
                  <span className="info-value">{email || 'Not set'}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Security Section
        <div className="security-card">
          <div className="security-info">
            
            <div>
              <h3>Security</h3>
              <p>Update your password to keep your account secure</p>
            </div>
          </div>
          <button 
            className="btn-security" 
            onClick={() => setShowPasswordModal(true)}
          >
            Change Password
          </button>
        </div> */}

        {/* Stats Section */}
        <div className="stats-card">
          <h3>Account Statistics</h3>
          {loading ? (
            <p className="loading-stats">Loading stats...</p>
          ) : (
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-number">{stats.totalProjects}</span>
                <span className="stat-label">Projects</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{stats.totalTasks}</span>
                <span className="stat-label">Tasks</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{stats.completionRate}%</span>
                <span className="stat-label">Completion</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="modal-overlay" onClick={() => setShowPasswordModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Change Password</h2>
              <button className="modal-close" onClick={() => setShowPasswordModal(false)}>×</button>
            </div>
            <form onSubmit={handlePasswordSubmit}>
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength="6"
                />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-modal-cancel" onClick={() => setShowPasswordModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-modal-submit">
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;