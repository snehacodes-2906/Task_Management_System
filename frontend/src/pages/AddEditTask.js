// frontend/src/pages/AddEditTask.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../services/api';
import './AddEditTask.css';

function AddEditTask() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    status: 'Pending',
    deadline: '',
    projectId: ''
  });

  // Wrap fetchTask in useCallback to fix the warning
  const fetchTask = useCallback(async () => {
    try {
      const res = await api.get(`/tasks/${id}`);
      const task = res.data;
      setFormData({
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        deadline: task.deadline ? task.deadline.split('T')[0] : '',
        projectId: task.projectId || ''
      });
    } catch (err) {
      console.error('Error fetching task:', err);
    }
  }, [id]);

  const fetchProjects = useCallback(async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data);
    } catch (err) {
      console.error('Error fetching projects:', err);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
    if (id) {
      fetchTask();
    }
  }, [id, fetchTask, fetchProjects]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const taskData = { ...formData };
      if (!taskData.projectId) {
        delete taskData.projectId;
      }
      
      if (id) {
        await api.put(`/tasks/${id}`, taskData);
      } else {
        await api.post('/tasks', taskData);
      }
      navigate('/tasks');
    } catch (err) {
      console.error('Error saving task:', err.response?.data || err.message);
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
    <div className="task-form-page">
      {/* Navbar */}
      <nav className="task-form-navbar">
        <div className="brand">
          <div className="brand-icon">✓</div>
          Task Manager
        </div>
        <div className="nav-links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/projects">Projects</Link>
          <Link to="/tasks" className="active">Tasks</Link>
          <Link to="/calendar">Calendar</Link>
          <Link to="/reports">Reports</Link>
          <Link to="/profile">Profile</Link>
        </div>
        <div className="nav-actions">
          <button className="logout-btn" onClick={logout}>Logout</button>
        </div>
      </nav>

      <div className="task-form-container">
        <div className="task-form-card">
          <div className="task-form-header">
            <h1>{id ? 'Edit Task' : 'Create New Task'}</h1>
            <p className="subtitle">
              {id ? 'Update your task details' : 'Add a new task to your workspace'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="task-form">
            {/* Title */}
            <div className="form-group">
              <label>Task Title <span className="required">*</span></label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter task title..."
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            {/* Description */}
            <div className="form-group">
              <label>Description <span className="required">*</span></label>
              <textarea
                className="form-control"
                rows="4"
                placeholder="Describe your task in detail..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            {/* Priority & Status */}
            <div className="form-row">
              <div className="form-group">
                <label>Priority</label>
                <select
                  className="form-control"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  className="form-control"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            {/* Deadline */}
            <div className="form-group">
              <label>Deadline <span className="required">*</span></label>
              <input
                type="date"
                className="form-control"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                required
              />
            </div>

            {/* Project - OPTIONAL */}
            <div className="form-group">
              <label>Project <span className="optional">(Optional)</span></label>
              <select
                className="form-control"
                value={formData.projectId}
                onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
              >
                <option value="">No Project (Independent Task)</option>
                {projects.map(project => (
                  <option key={project._id} value={project._id}>
                    📁 {project.name}
                  </option>
                ))}
              </select>
              {projects.length === 0 && (
                <div className="helper-text">
                  No projects available. <Link to="/projects">Create one</Link> to organize your tasks.
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="form-actions">
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? 'Saving...' : id ? 'Update Task' : 'Create Task'}
              </button>
              <button type="button" className="btn-cancel" onClick={() => navigate('/tasks')}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddEditTask;