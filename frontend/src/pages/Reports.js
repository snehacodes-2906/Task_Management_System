// frontend/src/pages/Reports.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Reports.css';

function Reports() {
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
    highPriority: 0,
    mediumPriority: 0,
    lowPriority: 0,
    completionRate: 0
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await api.get('/reports');
      setStats(res.data);
    } catch (err) {
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="reports-page">
      {/* Navbar */}
      <nav className="reports-navbar">
        <div className="brand">
          <div className="brand-icon">✓</div>
          Task Manager
        </div>
        <div className="nav-links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/projects">Projects</Link>
          <Link to="/tasks">Tasks</Link>
          <Link to="/calendar">Calendar</Link>
          <Link to="/reports" className="active">Reports</Link>
          <Link to="/profile">Profile</Link>
        </div>
        <div className="nav-actions">
          <button className="logout-btn" onClick={logout}>Logout</button>
        </div>
      </nav>

      <div className="reports-container">
        {/* Header */}
        <div className="reports-header">
          <div>
            <h1>Reports</h1>
            <p className="subtitle">View your task statistics and progress</p>
          </div>
          <div className="header-date">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric', 
              year: 'numeric' 
            })}
          </div>
        </div>

        {loading ? (
          <p className="loading-text">Loading reports...</p>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="stats-grid">
              <div className="stat-card">
                
                <div className="stat-info">
                  <span className="stat-label">Total Tasks</span>
                  <span className="stat-number">{stats.totalTasks}</span>
                </div>
              </div>
              <div className="stat-card green">
                
                <div className="stat-info">
                  <span className="stat-label">Completed</span>
                  <span className="stat-number">{stats.completedTasks}</span>
                </div>
              </div>
              <div className="stat-card orange">
                
                <div className="stat-info">
                  <span className="stat-label">Pending</span>
                  <span className="stat-number">{stats.pendingTasks}</span>
                </div>
              </div>
              <div className="stat-card blue">
                
                <div className="stat-info">
                  <span className="stat-label">In Progress</span>
                  <span className="stat-number">{stats.inProgressTasks}</span>
                </div>
              </div>
            </div>

            {/* Priority Breakdown */}
            <div className="priority-section">
              <h2>Priority Breakdown</h2>
              <div className="priority-grid">
                <div className="priority-card high">
                  <div className="priority-dot"></div>
                  <div className="priority-info">
                    <span className="priority-label">High Priority</span>
                    <span className="priority-number">{stats.highPriority}</span>
                  </div>
                  <div className="priority-bar">
                    <div 
                      className="priority-bar-fill high" 
                      style={{ 
                        width: stats.totalTasks > 0 
                          ? `${(stats.highPriority / stats.totalTasks) * 100}%` 
                          : '0%' 
                      }}
                    />
                  </div>
                </div>
                <div className="priority-card medium">
                  <div className="priority-dot"></div>
                  <div className="priority-info">
                    <span className="priority-label">Medium Priority</span>
                    <span className="priority-number">{stats.mediumPriority}</span>
                  </div>
                  <div className="priority-bar">
                    <div 
                      className="priority-bar-fill medium" 
                      style={{ 
                        width: stats.totalTasks > 0 
                          ? `${(stats.mediumPriority / stats.totalTasks) * 100}%` 
                          : '0%' 
                      }}
                    />
                  </div>
                </div>
                <div className="priority-card low">
                  <div className="priority-dot"></div>
                  <div className="priority-info">
                    <span className="priority-label">Low Priority</span>
                    <span className="priority-number">{stats.lowPriority}</span>
                  </div>
                  <div className="priority-bar">
                    <div 
                      className="priority-bar-fill low" 
                      style={{ 
                        width: stats.totalTasks > 0 
                          ? `${(stats.lowPriority / stats.totalTasks) * 100}%` 
                          : '0%' 
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Completion Rate & Summary */}
            <div className="reports-bottom">
              <div className="completion-card">
                <h3>Completion Rate</h3>
                <div className="completion-circle">
                  <svg viewBox="0 0 120 120" className="circle-svg">
                    <circle
                      cx="60"
                      cy="60"
                      r="54"
                      fill="none"
                      stroke="#e8ece8"
                      strokeWidth="10"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="54"
                      fill="none"
                      stroke="#3a7a5a"
                      strokeWidth="10"
                      strokeDasharray="339.292"
                      strokeDashoffset={339.292 - (339.292 * stats.completionRate) / 100}
                      strokeLinecap="round"
                      className="circle-progress"
                    />
                  </svg>
                  <div className="circle-text">
                    <span className="circle-number">{stats.completionRate}%</span>
                    <span className="circle-label">Complete</span>
                  </div>
                </div>
              </div>

              <div className="summary-card">
                <h3>Task Summary</h3>
                <div className="summary-item">
                  <span className="summary-label">Total Tasks</span>
                  <span className="summary-value">{stats.totalTasks}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Completed</span>
                  <span className="summary-value green">{stats.completedTasks}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Pending</span>
                  <span className="summary-value orange">{stats.pendingTasks}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">In Progress</span>
                  <span className="summary-value blue">{stats.inProgressTasks}</span>
                </div>
                <div className="summary-divider"></div>
                <div className="summary-item total">
                  <span className="summary-label">Completion Rate</span>
                  <span className="summary-value green">{stats.completionRate}%</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Reports;