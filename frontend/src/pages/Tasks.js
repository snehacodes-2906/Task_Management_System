import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState({ status: '', priority: '' });
  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      const params = new URLSearchParams(filters).toString();
      const res = await api.get(`/tasks?${params}`);
      setTasks(res.data);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filters]);

  const handleDelete = async (id) => {
    if (window.confirm('Delete this task?')) {
      try {
        await api.delete(`/tasks/${id}`);
        fetchTasks();
      } catch (err) {
        console.error('Error:', err);
      }
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
        <h2 style={{ color: 'white', margin: 0 }}>📋 Tasks</h2>
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
        <h1>My Tasks</h1>
        <Link to="/tasks/new">
          <button>+ Add New Task</button>
        </Link>

        <div style={{ margin: '20px 0' }}>
          <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <select value={filters.priority} onChange={(e) => setFilters({ ...filters, priority: e.target.value })}>
            <option value="">All Priority</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        {tasks.map(task => (
          <div key={task._id} style={{ background: 'white', padding: '15px', margin: '10px 0', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p>Priority: <strong>{task.priority}</strong> | Status: <strong>{task.status}</strong></p>
            <p>Deadline: {new Date(task.deadline).toLocaleDateString()}</p>
            <Link to={`/tasks/edit/${task._id}`}>
              <button style={{ background: '#3498db' }}>Edit</button>
            </Link>
            <button onClick={() => handleDelete(task._id)} style={{ background: '#e74c3c' }}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Tasks;