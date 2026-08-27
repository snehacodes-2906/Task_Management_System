// frontend/src/pages/Tasks.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import './Tasks.css';

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [filters, setFilters] = useState({ status: '', priority: '', projectId: '' });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch tasks with filters
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.priority) params.append('priority', filters.priority);
      if (filters.projectId) params.append('projectId', filters.projectId);
      
      const res = await api.get(`/tasks?${params.toString()}`);
      setTasks(res.data);
    } catch (err) {
      console.error('Error fetching tasks:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchProjects = useCallback(async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data);
    } catch (err) {
      console.error('Error fetching projects:', err);
    }
  }, []);

  // READ projectId from URL when page loads or URL changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const projectId = params.get('projectId');
    
    if (projectId) {
      setFilters(prev => ({ ...prev, projectId }));
    } else {
      setFilters(prev => ({ ...prev, projectId: '' }));
    }
  }, [location.search]);

  // Fetch tasks whenever filters change
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // ✅ Fixed: Added fetchProjects to dependency array
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Clear project filter
  const clearProjectFilter = () => {
    setFilters(prev => ({ ...prev, projectId: '' }));
    navigate('/tasks');
  };

  // Check if task is missed
  const isTaskMissed = (task) => {
    if (task.status === 'Completed') return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadline = new Date(task.deadline);
    deadline.setHours(0, 0, 0, 0);
    return deadline < today;
  };

  // Toggle task completion
  const toggleComplete = async (task) => {
    try {
      const updatedTask = {
        ...task,
        status: task.status === 'Completed' ? 'Pending' : 'Completed',
        completedAt: task.status === 'Completed' ? null : new Date().toISOString()
      };
      await api.put(`/tasks/${task._id}`, updatedTask);
      fetchTasks();
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this task?')) {
      try {
        await api.delete(`/tasks/${id}`);
        fetchTasks();
      } catch (err) {
        console.error('Error deleting task:', err);
      }
    }
  };

  const getProjectName = (projectId) => {
    if (!projectId) return 'No Project';
    const project = projects.find(p => p._id === projectId);
    return project ? project.name : 'No Project';
  };

  const getPriorityClass = (priority) => {
    switch(priority) {
      case 'High': return 'priority-high';
      case 'Medium': return 'priority-medium';
      case 'Low': return 'priority-low';
      default: return '';
    }
  };

  const getStatusClass = (status, missed) => {
    if (missed) return 'status-missed';
    switch(status) {
      case 'Pending': return 'status-pending';
      case 'In Progress': return 'status-progress';
      case 'Completed': return 'status-completed';
      default: return '';
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Get the current project name if filtering by project
  const getCurrentProjectName = () => {
    if (!filters.projectId) return null;
    const project = projects.find(p => p._id === filters.projectId);
    return project ? project.name : null;
  };

  const currentProjectName = getCurrentProjectName();

  return (
    <div className="tasks-page">
      {/* Navbar */}
      <nav className="tasks-navbar">
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

      <div className="tasks-container">
        {/* Header */}
        <div className="tasks-header">
          <div>
            <h1>
              Tasks
              {currentProjectName && (
                <span className="project-filter-label">: {currentProjectName}</span>
              )}
            </h1>
            <p className="subtitle">
              {currentProjectName 
                ? `Showing tasks for "${currentProjectName}"` 
                : 'Manage all your tasks in one place'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {filters.projectId && (
              <button onClick={clearProjectFilter} className="clear-filter-btn">
                ✕ Show All Tasks
              </button>
            )}
            <Link to="/tasks/new" className="add-btn">+ Add New Task</Link>
          </div>
        </div>

        {/* Filters */}
        <div className="tasks-filters">
          <div className="filter-group">
            <select 
              value={filters.status} 
              onChange={(e) => setFilters({ ...filters, status: e.target.value })} 
            >
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
            <select 
              value={filters.priority} 
              onChange={(e) => setFilters({ ...filters, priority: e.target.value })} 
            >
              <option value="">All Priority</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <span className="task-count">{tasks.length} task{tasks.length !== 1 ? 's' : ''}</span>
        </div>

        {/* Task List */}
        <div className="tasks-list">
          {loading ? (
            <p className="loading-text">Loading tasks...</p>
          ) : tasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3>
                {filters.projectId 
                  ? `No tasks in "${currentProjectName}"` 
                  : 'No tasks found'}
              </h3>
              <p>
                {filters.projectId 
                  ? `Create a task for "${currentProjectName}"` 
                  : 'Create your first task to get started'}
              </p>
              <Link to="/tasks/new" className="empty-btn">+ Add Task</Link>
            </div>
          ) : (
            tasks.map((task) => {
              const missed = isTaskMissed(task);
              const isCompleted = task.status === 'Completed';
              
              return (
                <div key={task._id} className={`task-card ${isCompleted ? 'completed' : ''} ${missed ? 'missed' : ''}`}>
                  <div className="task-left">
                    <input
                      type="checkbox"
                      checked={isCompleted}
                      onChange={() => toggleComplete(task)}
                      className="task-checkbox"
                    />
                    <div className="task-content">
                      <div className="task-title-row">
                        <h3 className={`task-title ${isCompleted ? 'done' : ''}`}>{task.title}</h3>
                        {missed && <span className="missed-badge">⚠ Missed</span>}
                      </div>
                      <p className="task-description">{task.description || 'No description'}</p>
                      <div className="task-meta">
                        <span className="task-project">📁 {getProjectName(task.projectId)}</span>
                        <span className="task-deadline">📅 {formatDate(task.deadline)}</span>
                        {isCompleted && task.completedAt && (
                          <span className="task-completed-date">✅ Completed {formatDate(task.completedAt)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="task-right">
                    <span className={`task-priority ${getPriorityClass(task.priority)}`}>
                      {task.priority}
                    </span>
                    <span className={`task-status ${getStatusClass(task.status, missed)}`}>
                      {missed ? 'Missed' : task.status}
                    </span>
                    <div className="task-actions">
                      <Link to={`/tasks/edit/${task._id}`} className="edit-btn">Edit</Link>
                      <button onClick={() => handleDelete(task._id)} className="delete-btn">Delete</button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default Tasks;