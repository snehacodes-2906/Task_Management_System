// frontend/src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Dashboard.css';

function Dashboard() {
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
    missedTasks: 0,
    completionRate: 0
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [tasksRes, projectsRes] = await Promise.all([
        api.get('/tasks'),
        api.get('/projects')
      ]);
      
      const tasks = tasksRes.data;
      const projects = projectsRes.data;
      
      // Calculate stats
      const totalTasks = tasks.length;
      const completedTasks = tasks.filter(t => t.status === 'Completed').length;
      const pendingTasks = tasks.filter(t => t.status === 'Pending').length;
      const inProgressTasks = tasks.filter(t => t.status === 'In Progress').length;
      
      // Missed tasks (deadline passed, not completed)
      const missedTasks = tasks.filter(task => {
        if (task.status === 'Completed') return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const deadline = new Date(task.deadline);
        deadline.setHours(0, 0, 0, 0);
        return deadline < today;
      }).length;
      
      const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
      
      setStats({
        totalTasks,
        completedTasks,
        pendingTasks,
        inProgressTasks,
        missedTasks,
        completionRate
      });
      
      // Get recent tasks (last 5)
      setRecentTasks(tasks.slice(0, 5));
      setProjects(projects.slice(0, 3));
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const isTaskMissed = (task) => {
    if (task.status === 'Completed') return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadline = new Date(task.deadline);
    deadline.setHours(0, 0, 0, 0);
    return deadline < today;
  };

  const getPriorityClass = (priority) => {
    switch(priority) {
      case 'High': return 'high';
      case 'Medium': return 'medium';
      case 'Low': return 'low';
      default: return 'low';
    }
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'Pending': return 'pending';
      case 'In Progress': return 'progress';
      case 'Completed': return 'done';
      default: return 'pending';
    }
  };

  const getStatusDisplay = (status) => {
    switch(status) {
      case 'Pending': return 'Pending';
      case 'In Progress': return 'In Progress';
      case 'Completed': return 'Done';
      default: return status;
    }
  };

  const getProjectInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : 'P';
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const today = new Date();
  const dateString = today.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p style={{ fontSize: '16px', color: '#7a8a80' }}>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      {/* Navbar */}
      <nav className="dashboard-navbar">
        <div className="brand">
          <div className="brand-icon">✓</div>
          Task Manager
        </div>
        <div className="nav-links">
          <Link to="/dashboard" className="active">Dashboard</Link>
          <Link to="/projects">Projects</Link>
          <Link to="/tasks">Tasks</Link>
          <Link to="/calendar">Calendar</Link>
          <Link to="/reports">Reports</Link>
          <Link to="/profile">Profile</Link>
        </div>
        <div className="nav-actions">
          <button className="logout-btn" onClick={logout}>Logout</button>
        </div>
      </nav>

      <div className="dashboard-container">
        {/* Header */}
        <div className="dashboard-header">
          <div className="dashboard-header-left">
            <h1>Dashboard</h1>
            <p className="subtitle">Overview of your tasks and projects</p>
          </div>
          <div className="dashboard-header-right">
            <span className="date-badge">{dateString}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Total Tasks</div>
            <div className="stat-number">{stats.totalTasks}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Completed</div>
            <div className="stat-number green">{stats.completedTasks}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Pending</div>
            <div className="stat-number orange">{stats.pendingTasks}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">In Progress</div>
            <div className="stat-number blue">{stats.inProgressTasks}</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ 
          background: 'white', 
          border: '2px solid #dce0dc', 
          borderRadius: '14px', 
          padding: '16px 20px',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontWeight: 600, color: '#1a3a2c' }}>Completion Rate</span>
            <span style={{ fontWeight: 700, color: '#3a7a5a', fontSize: '18px' }}>{stats.completionRate}%</span>
          </div>
          <div style={{ 
            width: '100%', 
            height: '8px', 
            background: '#e8ece8', 
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{ 
              width: `${stats.completionRate}%`, 
              height: '100%', 
              background: '#3a7a5a',
              borderRadius: '4px',
              transition: 'width 0.5s ease'
            }} />
          </div>
          {stats.missedTasks > 0 && (
            <div style={{ 
              marginTop: '8px', 
              fontSize: '12px', 
              color: '#b83a3a',
              fontWeight: 600
            }}>
              ⚠ {stats.missedTasks} task{stats.missedTasks > 1 ? 's' : ''} missed deadline
            </div>
          )}
        </div>

        {/* Dashboard Layout */}
        <div className="dashboard-layout">
          {/* Tasks */}
          <div className="task-section">
            <div className="section-header">
              <h2>Recent Tasks</h2>
              <Link to="/tasks" className="view-all">View All →</Link>
            </div>
            <div className="task-list">
              {recentTasks.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📋</div>
                  <h3>No tasks yet</h3>
                  <p>Create your first task to get started</p>
                  <Link to="/tasks/new" className="empty-btn">+ Add Task</Link>
                </div>
              ) : (
                recentTasks.map(task => {
                  const missed = isTaskMissed(task);
                  return (
                    <div key={task._id} className="task-item">
                      <div className={`task-check ${task.status === 'Completed' ? 'done' : ''}`}>
                        {task.status === 'Completed' && '✓'}
                      </div>
                      <div className="task-info">
                        <div className={`title ${task.status === 'Completed' ? 'done' : ''}`}>
                          {task.title}
                          {missed && ' ⚠'}
                        </div>
                        <div className="meta">
                          {task.projectId?.name || 'No Project'} • {formatDate(task.deadline)}
                          {missed && <span style={{ color: '#b83a3a', marginLeft: '6px', fontWeight: 600 }}>Missed!</span>}
                        </div>
                      </div>
                      <span className={`task-priority ${getPriorityClass(task.priority)}`}>
                        {task.priority}
                      </span>
                      <span className={`task-status ${missed ? 'missed' : getStatusClass(task.status)}`}>
                        {missed ? 'Missed' : getStatusDisplay(task.status)}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Projects */}
          <div className="project-section">
            <div className="section-header">
              <h2>Projects</h2>
              <Link to="/projects" className="view-all">View All →</Link>
            </div>
            <div className="project-list">
              {projects.length === 0 ? (
                <div className="empty-state" style={{ padding: '20px' }}>
                  <div className="empty-icon">📁</div>
                  <h3>No projects</h3>
                  <p>Create your first project</p>
                  <Link to="/projects" className="empty-btn">+ Add Project</Link>
                </div>
              ) : (
                projects.map(project => (
                  <div key={project._id} className="project-item">
                    <div className="project-icon">{getProjectInitial(project.name)}</div>
                    <div className="project-info">
                      <div className="name">{project.name}</div>
                      <div className="desc">{project.description || 'No description'}</div>
                    </div>
                    <div className="project-count">
                      {project.tasks?.length || 0} tasks
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;