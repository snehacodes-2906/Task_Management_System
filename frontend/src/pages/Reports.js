import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import api from '../services/api';
import './Reports.css';

// Register Chart.js components
ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

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

  // Priority Bar Chart Config
  const priorityChartData = {
    labels: ['High', 'Medium', 'Low'],
    datasets: [
      {
        label: 'Tasks',
        data: [stats.highPriority, stats.mediumPriority, stats.lowPriority],
        backgroundColor: ['#ef4444', '#f59e0b', '#10b981'],
        borderRadius: 6
      }
    ]
  };

  const priorityChartOptions = {
    indexAxis: 'y', // Makes the bar chart horizontal
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true }
    },
    scales: {
      x: {
        grid: { display: false },
        beginAtZero: true
      },
      y: {
        grid: { display: false }
      }
    }
  };

  // Completion Rate Doughnut Chart Config
  const completionChartData = {
    labels: ['Completed', 'Remaining'],
    datasets: [
      {
        data: [stats.completionRate, Math.max(0, 100 - stats.completionRate)],
        backgroundColor: ['#3a7a5a', '#e8ece8'],
        borderWidth: 0,
        cutout: '80%'
      }
    ]
  };

  const completionChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true }
    }
  };

  return (
    <div className="reports-page">
      {/* Navbar */}
      <nav className="reports-navbar">
        <div className="brand">
          <div className="brand-icon">✓</div>
          TaskFlow
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

            {/* Priority Breakdown (Chart.js Bar Chart) */}
            <div className="priority-section">
              <h2>Priority Breakdown</h2>
              <div style={{ height: '220px', marginTop: '16px' }}>
                <Bar data={priorityChartData} options={priorityChartOptions} />
              </div>
            </div>

            {/* Completion Rate & Summary */}
            <div className="reports-bottom">
              {/* Completion Rate (Chart.js Doughnut Chart) */}
              <div className="completion-card">
                <h3>Completion Rate</h3>
                <div className="completion-circle" style={{ position: 'relative' }}>
                  <Doughnut data={completionChartData} options={completionChartOptions} />
                  <div className="circle-text" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                    <span className="circle-number">{stats.completionRate}%</span>
                    <span className="circle-label">Complete</span>
                  </div>
                </div>
              </div>

              {/* Task Summary */}
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