import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

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
  const navigate = useNavigate();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await api.get('/reports');
      setStats(res.data);
    } catch (err) {
      console.error('Error fetching reports:', err);
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
        <h2 style={{ color: 'white', margin: 0 }}>📊 Reports</h2>
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
        <h1>Task Reports</h1>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginTop: '20px' }}>
          <div style={{ background: '#3498db', color: 'white', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
            <h3>Total Tasks</h3>
            <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '10px 0' }}>{stats.totalTasks}</p>
          </div>
          <div style={{ background: '#27ae60', color: 'white', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
            <h3>Completed</h3>
            <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '10px 0' }}>{stats.completedTasks}</p>
          </div>
          <div style={{ background: '#e74c3c', color: 'white', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
            <h3>Pending</h3>
            <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '10px 0' }}>{stats.pendingTasks}</p>
          </div>
          <div style={{ background: '#f39c12', color: 'white', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
            <h3>In Progress</h3>
            <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '10px 0' }}>{stats.inProgressTasks}</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '20px' }}>
          <div style={{ background: '#e67e22', color: 'white', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
            <h3>🔴 High Priority</h3>
            <p style={{ fontSize: '28px', fontWeight: 'bold', margin: '10px 0' }}>{stats.highPriority}</p>
          </div>
          <div style={{ background: '#f1c40f', color: 'black', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
            <h3>🟡 Medium Priority</h3>
            <p style={{ fontSize: '28px', fontWeight: 'bold', margin: '10px 0' }}>{stats.mediumPriority}</p>
          </div>
          <div style={{ background: '#2ecc71', color: 'white', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
            <h3>🟢 Low Priority</h3>
            <p style={{ fontSize: '28px', fontWeight: 'bold', margin: '10px 0' }}>{stats.lowPriority}</p>
          </div>
        </div>

        <div style={{ marginTop: '30px', background: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <h3>📈 Overall Completion Rate</h3>
          <div style={{ 
            width: '200px', 
            height: '200px', 
            borderRadius: '50%', 
            background: `conic-gradient(#27ae60 ${stats.completionRate}%, #e74c3c ${stats.completionRate}%)`,
            margin: '20px auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{ 
              background: 'white', 
              width: '140px', 
              height: '140px', 
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column'
            }}>
              <p style={{ fontSize: '36px', fontWeight: 'bold', margin: '0', color: '#2c3e50' }}>{stats.completionRate}%</p>
              <p style={{ margin: '0', color: '#666', fontSize: '12px' }}>Complete</p>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '20px', background: '#ecf0f1', padding: '20px', borderRadius: '8px' }}>
          <h3>📊 Summary</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
              Total Tasks: <strong>{stats.totalTasks}</strong>
            </li>
            <li style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
              Completed: <strong style={{ color: '#27ae60' }}>{stats.completedTasks}</strong>
            </li>
            <li style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
              Pending: <strong style={{ color: '#e74c3c' }}>{stats.pendingTasks}</strong>
            </li>
            <li style={{ padding: '10px' }}>
              In Progress: <strong style={{ color: '#f39c12' }}>{stats.inProgressTasks}</strong>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Reports;