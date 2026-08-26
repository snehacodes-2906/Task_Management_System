import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

function Calendar() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await api.get('/tasks');
      setTasks(res.data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Group tasks by deadline
  const tasksByDate = tasks.reduce((acc, task) => {
    const date = new Date(task.deadline).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    if (!acc[date]) acc[date] = [];
    acc[date].push(task);
    return acc;
  }, {});

  // Sort dates
  const sortedDates = Object.keys(tasksByDate).sort((a, b) => {
    return new Date(a) - new Date(b);
  });

  // Get priority color
  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return '#e74c3c';
      case 'Medium': return '#f39c12';
      case 'Low': return '#27ae60';
      default: return '#3498db';
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch(status) {
      case 'Completed': return '#27ae60';
      case 'In Progress': return '#3498db';
      case 'Pending': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  return (
    <div>
      <nav style={{ 
        background: '#2c3e50', 
        padding: '15px 30px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <h2 style={{ color: 'white', margin: 0 }}>📅 Calendar</h2>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none', padding: '5px 10px' }}>Dashboard</Link>
          <Link to="/projects" style={{ color: 'white', textDecoration: 'none', padding: '5px 10px' }}>Projects</Link>
          <Link to="/tasks" style={{ color: 'white', textDecoration: 'none', padding: '5px 10px' }}>Tasks</Link>
          <Link to="/calendar" style={{ color: '#3498db', textDecoration: 'none', padding: '5px 10px' }}>Calendar</Link>
          <Link to="/reports" style={{ color: 'white', textDecoration: 'none', padding: '5px 10px' }}>Reports</Link>
          <Link to="/profile" style={{ color: 'white', textDecoration: 'none', padding: '5px 10px' }}>Profile</Link>
          <button onClick={logout} style={{ 
            background: '#e74c3c', 
            color: 'white', 
            border: 'none', 
            padding: '5px 15px', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}>Logout</button>
        </div>
      </nav>

      <div className="container">
        <h1 style={{ marginBottom: '20px' }}>📅 Task Calendar</h1>
        
        {loading ? (
          <p style={{ textAlign: 'center', fontSize: '18px', color: '#666' }}>Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '50px',
            background: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <p style={{ fontSize: '18px', color: '#666' }}>No tasks found.</p>
            <Link to="/tasks/new">
              <button style={{ marginTop: '20px' }}>Create Your First Task</button>
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
            {sortedDates.map(date => (
              <div key={date} style={{ 
                background: 'white', 
                borderRadius: '8px', 
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                overflow: 'hidden'
              }}>
                <div style={{ 
                  background: '#3498db', 
                  color: 'white', 
                  padding: '15px',
                  fontWeight: 'bold',
                  fontSize: '16px'
                }}>
                  📅 {date}
                  <span style={{ 
                    float: 'right',
                    background: 'rgba(255,255,255,0.2)',
                    padding: '2px 10px',
                    borderRadius: '12px',
                    fontSize: '14px'
                  }}>
                    {tasksByDate[date].length} task{tasksByDate[date].length > 1 ? 's' : ''}
                  </span>
                </div>
                <div style={{ padding: '15px' }}>
                  {tasksByDate[date].map(task => (
                    <div key={task._id} style={{
                      padding: '12px',
                      marginBottom: '10px',
                      borderRadius: '4px',
                      borderLeft: `4px solid ${getPriorityColor(task.priority)}`,
                      background: '#f8f9fa'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <strong style={{ fontSize: '15px' }}>{task.title}</strong>
                          <p style={{ margin: '5px 0', fontSize: '13px', color: '#666' }}>{task.description}</p>
                        </div>
                        <span style={{
                          padding: '2px 10px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          background: getStatusColor(task.status),
                          color: 'white',
                          whiteSpace: 'nowrap'
                        }}>
                          {task.status}
                        </span>
                      </div>
                      <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
                        <span style={{
                          fontSize: '12px',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          background: getPriorityColor(task.priority),
                          color: 'white'
                        }}>
                          {task.priority}
                        </span>
                        <span style={{ fontSize: '12px', color: '#666' }}>
                          Project: {task.projectId?.name || 'N/A'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Calendar;