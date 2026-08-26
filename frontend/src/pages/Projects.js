import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

function Projects() {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/projects', formData);
      setFormData({ name: '', description: '' });
      setShowForm(false);
      fetchProjects();
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this project?')) {
      try {
        await api.delete(`/projects/${id}`);
        fetchProjects();
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
        <h2 style={{ color: 'white', margin: 0 }}>📋 Projects</h2>
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
        <h1>My Projects</h1>
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add New Project'}
        </button>

        {showForm && (
          <form onSubmit={handleSubmit} style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', margin: '20px 0' }}>
            <input type="text" placeholder="Project Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
            <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
            <button type="submit">Create Project</button>
          </form>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '20px' }}>
          {projects.map(project => (
            <div key={project._id} style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <h3>{project.name}</h3>
              <p>{project.description}</p>
              <button onClick={() => handleDelete(project._id)} style={{ background: '#e74c3c' }}>Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Projects;