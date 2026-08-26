import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

function Dashboard() {
  const [stats, setStats] = useState({ totalTasks: 0, completedTasks: 0, pendingTasks: 0, completionRate: 0 });
  const [recentTasks, setRecentTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const statsRes = await api.get('/reports');
      setStats(statsRes.data);
      const tasksRes = await api.get('/tasks');
      setRecentTasks(tasksRes.data.slice(0, 5));
      const projectsRes = await api.get('/projects');
      setProjects(projectsRes.data.slice(0, 3));
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div>
      <nav style={{ background: '#2c3e50', padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ color: 'white', margin: 0 }}>📋 Task Manager</h2>
        <div>
          <Link to="/dashboard" style={{ color: 'white', margin: '0 10px', textDecoration: 'none' }}>Dashboard</Link>
          <Link to="/projects" style={{ color: 'white', margin: '0 10px', textDecoration: 'none' }}>Projects</Link>
          <Link to="/tasks" style={{ color: 'white', margin: '0 10px', textDecoration: 'none' }}>Tasks</Link>
          <Link to="/calendar" style={{ color: 'white', margin: '0 10px', textDecoration: 'none' }}>Calendar</Link>
          <Link to="/reports" style={{ color: 'white', margin: '0 10px', textDecoration: 'none' }}>Reports</Link>
          <Link to="/profile" style={{ color: 'white', margin: '0 10px', textDecoration: 'none' }}>Profile</Link>
          <button onClick={logout} style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '5px 15px', borderRadius: '4px' }}>Logout</button>
        </div>
      </nav>

      <div className="container">
        <h1>Dashboard</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', margin: '20px 0' }}>
          <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', textAlign: 'center' }}>
            <h3>Total Tasks</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.totalTasks}</p>
          </div>
          <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', textAlign: 'center' }}>
            <h3>Completed</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#27ae60' }}>{stats.completedTasks}</p>
          </div>
          <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', textAlign: 'center' }}>
            <h3>Pending</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#e74c3c' }}>{stats.pendingTasks}</p>
          </div>
          <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', textAlign: 'center' }}>
            <h3>Completion Rate</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#3498db' }}>{stats.completionRate}%</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3>Recent Tasks</h3>
            {recentTasks.map(task => (
              <div key={task._id} style={{ borderBottom: '1px solid #eee', padding: '10px 0' }}>
                <strong>{task.title}</strong>
                <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>
                  Status: {task.status} | Priority: {task.priority}
                </p>
              </div>
            ))}
          </div>
          <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3>Recent Projects</h3>
            {projects.map(project => (
              <div key={project._id} style={{ borderBottom: '1px solid #eee', padding: '10px 0' }}>
                <strong>{project.name}</strong>
                <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>{project.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;