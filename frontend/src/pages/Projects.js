// frontend/src/pages/Projects.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Projects.css';

function Projects() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formError, setFormError] = useState('');
  const [formData, setFormData] = useState({ 
    name: '', 
    description: '',
    deadline: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [projectsRes, tasksRes] = await Promise.all([
        api.get('/projects'),
        api.get('/tasks')
      ]);
      setProjects(projectsRes.data);
      setTasks(tasksRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    
    if (!formData.name || formData.name.trim() === '') {
      setFormError('Project name is required');
      return;
    }
    if (!formData.description || formData.description.trim() === '') {
      setFormError('Description is required');
      return;
    }
    if (!formData.deadline) {
      setFormError('Deadline is required');
      return;
    }
    
    try {
      await api.post('/projects', {
        name: formData.name,
        description: formData.description,
        deadline: formData.deadline
      });
      setFormData({ name: '', description: '', deadline: '' });
      setShowForm(false);
      fetchData();
    } catch (err) {
      console.error('Error creating project:', err);
      setFormError(err.response?.data?.message || 'Failed to create project');
    }
  };

  const handleEditClick = (project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      description: project.description || '',
      deadline: project.deadline ? project.deadline.split('T')[0] : ''
    });
    setShowEditForm(true);
    setFormError('');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setFormError('');
    
    if (!formData.name || formData.name.trim() === '') {
      setFormError('Project name is required');
      return;
    }
    if (!formData.description || formData.description.trim() === '') {
      setFormError('Description is required');
      return;
    }
    if (!formData.deadline) {
      setFormError('Deadline is required');
      return;
    }
    
    try {
      await api.put(`/projects/${editingProject._id}`, {
        name: formData.name,
        description: formData.description,
        deadline: formData.deadline
      });
      setShowEditForm(false);
      setEditingProject(null);
      setFormData({ name: '', description: '', deadline: '' });
      fetchData();
    } catch (err) {
      console.error('Error updating project:', err);
      setFormError(err.response?.data?.message || 'Failed to update project');
    }
  };

  const toggleProjectStatus = async (project) => {
    try {
      await api.patch(`/projects/${project._id}/toggle`);
      fetchData();
    } catch (err) {
      console.error('Error toggling project status:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this project? All associated tasks will be moved to "No Project".')) {
      try {
        await api.delete(`/projects/${id}`);
        fetchData();
      } catch (err) {
        console.error('Error deleting project:', err);
      }
    }
  };

  const getTaskCount = (projectId) => {
    return tasks.filter(task => task.projectId === projectId).length;
  };

  const getCompletedCount = (projectId) => {
    return tasks.filter(task => task.projectId === projectId && task.status === 'Completed').length;
  };

  const getProjectColor = (name) => {
    const colors = ['#3a7a5a', '#4a8a6a', '#5a9a7a', '#2a6a4a', '#6aaa8a'];
    const index = name.length % colors.length;
    return colors[index];
  };

  const getInitials = (name) => {
    return name.charAt(0).toUpperCase();
  };

  const handleViewTasks = (projectId) => {
    navigate(`/tasks?projectId=${projectId}`);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const cancelEdit = () => {
    setShowEditForm(false);
    setEditingProject(null);
    setFormData({ name: '', description: '', deadline: '' });
    setFormError('');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No deadline';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="projects-page">
      {/* Navbar */}
      <nav className="projects-navbar">
        <div className="brand">
          <div className="brand-icon">✓</div>
          Task Manager
        </div>
        <div className="nav-links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/projects" className="active">Projects</Link>
          <Link to="/tasks">Tasks</Link>
          <Link to="/calendar">Calendar</Link>
          <Link to="/reports">Reports</Link>
          <Link to="/profile">Profile</Link>
        </div>
        <div className="nav-actions">
          <button className="logout-btn" onClick={logout}>Logout</button>
        </div>
      </nav>

      <div className="projects-container">
        {/* Header */}
        <div className="projects-header">
          <div>
            <h1>Projects</h1>
            <p className="subtitle">Organize your work into projects</p>
          </div>
          <button 
            className={`add-btn ${showForm ? 'cancel-btn' : ''}`}
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? '✕ Cancel' : '+ New Project'}
          </button>
        </div>

        {/* Create Project Form */}
        {showForm && (
          <div className="project-form-card">
            <h3>Create New Project</h3>
            {formError && <div className="form-error">{formError}</div>}
            <form onSubmit={handleSubmit} className="project-form">
              <div className="form-group">
                <label>Project Name <span className="required">*</span></label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter project name..."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description <span className="required">*</span></label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Describe your project..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
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
              <div className="form-actions">
                <button type="submit" className="btn-submit">Create Project</button>
                <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Edit Project Form - Modal */}
        {showEditForm && editingProject && (
          <div className="modal-overlay" onClick={cancelEdit}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Edit Project</h3>
                <button className="modal-close" onClick={cancelEdit}>✕</button>
              </div>
              {formError && <div className="form-error">{formError}</div>}
              <form onSubmit={handleUpdate} className="project-form">
                <div className="form-group">
                  <label>Project Name <span className="required">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter project name..."
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Description <span className="required">*</span></label>
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Describe your project..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>
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
                <div className="form-actions">
                  <button type="submit" className="btn-submit">Update Project</button>
                  <button type="button" className="btn-cancel" onClick={cancelEdit}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Projects Grid */}
        {loading ? (
          <p className="loading-text">Loading projects...</p>
        ) : projects.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📁</div>
            <h3>No projects yet</h3>
            <p>Create your first project to organize your tasks</p>
            <button className="empty-btn" onClick={() => setShowForm(true)}>
              + Create Project
            </button>
          </div>
        ) : (
          <div className="projects-grid">
            {projects.map(project => {
              const taskCount = getTaskCount(project._id);
              const completedCount = getCompletedCount(project._id);
              const color = getProjectColor(project.name);
              const isCompleted = project.status === 'Completed';
              
              return (
                <div key={project._id} className={`project-card ${isCompleted ? 'completed' : ''}`}>
                  <div className="project-card-header">
                    <div 
                      className="project-avatar" 
                      style={{ background: isCompleted ? '#8a9a90' : color }}
                    >
                      {getInitials(project.name)}
                    </div>
                    <div className="project-info">
                      <h3 className="project-name">{project.name}</h3>
                      <p className="project-description">
                        {project.description || 'No description'}
                      </p>
                      <p className="project-deadline">
                        Deadline: {formatDate(project.deadline)}
                      </p>
                    </div>
                  </div>
                  
                  {/* Status */}
                  <div className="project-status">
                    <span className={`status-badge ${isCompleted ? 'completed' : 'active'}`}>
                      {isCompleted ? '✓ Done' : '● Active'}
                    </span>
                    {project.completedAt && (
                      <span className="completed-date">
                        Completed: {new Date(project.completedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  
                  {/* Stats */}
                  <div className="project-stats">
                    <div className="stat-item">
                      <span className="stat-number">{taskCount}</span>
                      <span className="stat-label">Total Tasks</span>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat-item">
                      <span className="stat-number">{completedCount}</span>
                      <span className="stat-label">Completed</span>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat-item">
                      <span className="stat-number">{taskCount - completedCount}</span>
                      <span className="stat-label">Pending</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="project-progress">
                    <div className="progress-bar-bg">
                      <div 
                        className="progress-bar-fill" 
                        style={{ 
                          width: taskCount > 0 ? `${(completedCount / taskCount) * 100}%` : '0%',
                          background: isCompleted ? '#8a9a90' : color
                        }}
                      />
                    </div>
                    <span className="progress-text">
                      {taskCount > 0 ? Math.round((completedCount / taskCount) * 100) : 0}%
                    </span>
                  </div>
                  
                  {/* Actions */}
                  <div className="project-actions">
                    {isCompleted ? (
                      <button 
                        onClick={() => toggleProjectStatus(project)} 
                        className="undo-btn"
                      >
                        ↺ Reopen
                      </button>
                    ) : (
                      <button 
                        onClick={() => toggleProjectStatus(project)} 
                        className="complete-btn"
                      >
                        ✓ Mark Done
                      </button>
                    )}
                    <button 
                      onClick={() => handleViewTasks(project._id)} 
                      className="view-tasks-btn"
                    >
                      View Tasks 
                    </button>
                    <button 
                      onClick={() => handleEditClick(project)} 
                      className="edit-btn"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(project._id)} 
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Projects;