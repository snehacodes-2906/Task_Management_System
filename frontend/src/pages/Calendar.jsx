// frontend/src/pages/Calendar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Calendar.css';

function Calendar() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedTask, setSelectedTask] = useState(null);
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tasksRes, projectsRes] = await Promise.all([
        api.get('/tasks'),
        api.get('/projects')
      ]);
      setTasks(tasksRes.data);
      setProjects(projectsRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Check if a task is missed (deadline passed and not completed)
  const isTaskMissed = (task) => {
    if (task.status === 'Completed') return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadline = new Date(task.deadline);
    deadline.setHours(0, 0, 0, 0);
    return deadline < today;
  };

  const getYear = () => currentDate.getFullYear();
  const getMonth = () => currentDate.getMonth();

  const prevMonth = () => {
    setCurrentDate(new Date(getYear(), getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(getYear(), getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const buildCalendar = () => {
    const year = getYear();
    const month = getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const daysInPrevMonth = getDaysInMonth(year, month - 1);

    const calendar = [];
    const today = new Date();
    const todayDate = today.getDate();
    const todayMonth = today.getMonth();
    const todayYear = today.getFullYear();

    const prevMonthStart = daysInPrevMonth - firstDay + 1;
    for (let i = prevMonthStart; i <= daysInPrevMonth; i++) {
      calendar.push({
        day: i,
        month: month - 1,
        year: year,
        isCurrentMonth: false,
        isToday: false
      });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      calendar.push({
        day: i,
        month: month,
        year: year,
        isCurrentMonth: true,
        isToday: i === todayDate && month === todayMonth && year === todayYear
      });
    }

    const remaining = 42 - calendar.length;
    for (let i = 1; i <= remaining; i++) {
      calendar.push({
        day: i,
        month: month + 1,
        year: year,
        isCurrentMonth: false,
        isToday: false
      });
    }

    return calendar;
  };

  const getTasksForDay = (day, month, year) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    let filteredTasks = tasks.filter(task => {
      if (!task.deadline) return false;
      const taskDate = new Date(task.deadline);
      const taskDateStr = `${taskDate.getFullYear()}-${String(taskDate.getMonth() + 1).padStart(2, '0')}-${String(taskDate.getDate()).padStart(2, '0')}`;
      return taskDateStr === dateStr;
    });

    if (filterPriority !== 'all') {
      filteredTasks = filteredTasks.filter(t => t.priority === filterPriority);
    }
    if (filterStatus === 'Completed') {
      filteredTasks = filteredTasks.filter(t => t.status === 'Completed');
    } else if (filterStatus === 'Pending') {
      filteredTasks = filteredTasks.filter(t => t.status === 'Pending');
    } else if (filterStatus === 'In Progress') {
      filteredTasks = filteredTasks.filter(t => t.status === 'In Progress');
    } else if (filterStatus === 'Missed') {
      filteredTasks = filteredTasks.filter(t => isTaskMissed(t));
    }

    return filteredTasks;
  };

  const getPriorityClass = (priority) => {
    switch(priority) {
      case 'High': return 'priority-high';
      case 'Medium': return 'priority-medium';
      case 'Low': return 'priority-low';
      default: return '';
    }
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'Pending': return 'pending';
      case 'In Progress': return 'progress';
      case 'Completed': return 'completed';
      default: return '';
    }
  };

  const getPriorityDot = (priority) => {
    switch(priority) {
      case 'High': return 'high';
      case 'Medium': return 'medium';
      case 'Low': return 'low';
      default: return 'low';
    }
  };

  const getBadgeClass = (priority, task) => {
    if (isTaskMissed(task)) return 'badge-missed';
    switch(priority) {
      case 'High': return 'badge-high';
      case 'Medium': return 'badge-medium';
      case 'Low': return 'badge-low';
      default: return '';
    }
  };

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'Pending': return 'badge-pending';
      case 'In Progress': return 'badge-progress';
      case 'Completed': return 'badge-completed';
      default: return '';
    }
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
  };

  const closeModal = () => {
    setSelectedTask(null);
  };

  const editTask = (taskId) => {
    navigate(`/tasks/edit/${taskId}`);
  };

  const getProjectName = (projectId) => {
    const project = projects.find(p => p._id === projectId);
    return project ? project.name : 'No Project';
  };

  const calendar = buildCalendar();
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const allTasksSorted = [...tasks]
    .filter(task => task.deadline)
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

  const sidebarTasks = allTasksSorted.filter(task => {
    if (filterPriority !== 'all' && task.priority !== filterPriority) return false;
    if (filterStatus === 'Completed' && task.status !== 'Completed') return false;
    if (filterStatus === 'Pending' && task.status !== 'Pending') return false;
    if (filterStatus === 'In Progress' && task.status !== 'In Progress') return false;
    if (filterStatus === 'Missed' && !isTaskMissed(task)) return false;
    return true;
  });

  const missedTasks = tasks.filter(task => isTaskMissed(task));

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const resetFilters = () => {
    setFilterPriority('all');
    setFilterStatus('all');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p style={{ fontSize: '16px', color: '#607268' }}>Loading calendar...</p>
      </div>
    );
  }

  return (
    <div className="calendar-page">
      {/* Minimal Navbar - Matches Landing Page */}
      <nav className="calendar-navbar">
        <div className="brand">
          <div className="brand-icon">✓</div>
          Task Manager
        </div>
        <div className="nav-links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/projects">Projects</Link>
          <Link to="/tasks">Tasks</Link>
          <Link to="/calendar" className="active">Calendar</Link>
          <Link to="/reports">Reports</Link>
          <Link to="/profile">Profile</Link>
        </div>
        <div className="nav-actions">
          <button className="logout-btn" onClick={logout}>Logout</button>
        </div>
      </nav>

      <div className="calendar-container">
        <div className="calendar-header">
          <div className="calendar-header-left">
            <h1>Calendar <span>View</span></h1>
            <p className="subtitle">View all your tasks by deadline</p>
          </div>
          <div className="header-stats">
            <div className="stat-badge total">
              Total <span className="stat-number">{tasks.length}</span>
            </div>
            <div className="stat-badge completed">
              ✓ <span className="stat-number">{tasks.filter(t => t.status === 'Completed').length}</span>
            </div>
            <div className="stat-badge pending">
              ◉ <span className="stat-number">{tasks.filter(t => t.status === 'Pending').length}</span>
            </div>
            <div className="stat-badge progress">
              ⟳ <span className="stat-number">{tasks.filter(t => t.status === 'In Progress').length}</span>
            </div>
            {missedTasks.length > 0 && (
              <div className="stat-badge missed">
                ⚠ <span className="stat-number">{missedTasks.length}</span> Missed
              </div>
            )}
          </div>
        </div>

        <div className="calendar-controls-row">
          <div className="month-navigator">
            <button className="nav-btn" onClick={prevMonth}>‹</button>
            <span className="month-label">{monthNames[getMonth()]} {getYear()}</span>
            <button className="nav-btn" onClick={nextMonth}>›</button>
            <button className="today-btn" onClick={goToToday}>Today</button>
          </div>

          <div className="filter-pills">
            <button 
              className={`filter-pill ${filterPriority === 'all' && filterStatus === 'all' ? 'active' : ''}`}
              onClick={resetFilters}
            >
              All
            </button>
            <button 
              className={`filter-pill ${filterStatus === 'Completed' ? 'active' : ''}`}
              onClick={() => { setFilterPriority('all'); setFilterStatus('Completed'); }}
            >
              ✓ Completed
            </button>
            <button 
              className={`filter-pill ${filterStatus === 'Pending' ? 'active' : ''}`}
              onClick={() => { setFilterPriority('all'); setFilterStatus('Pending'); }}
            >
              ◉ Pending
            </button>
            <button 
              className={`filter-pill ${filterStatus === 'In Progress' ? 'active' : ''}`}
              onClick={() => { setFilterPriority('all'); setFilterStatus('In Progress'); }}
            >
              ⟳ In Progress
            </button>
            <button 
              className={`filter-pill ${filterStatus === 'Missed' ? 'active' : ''}`}
              onClick={() => { setFilterPriority('all'); setFilterStatus('Missed'); }}
              style={filterStatus === 'Missed' ? { background: '#ffebee', borderColor: '#c62828', color: '#c62828' } : {}}
            >
              ⚠ Missed
            </button>
          </div>
        </div>

        <div className="calendar-layout">
          <div className="calendar-grid">
            <div className="weekday-header">
              <div>Sun</div>
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div>Sat</div>
            </div>
            <div className="days-grid">
              {calendar.map((day, index) => {
                const dayTasks = getTasksForDay(day.day, day.month, day.year);
                const isToday = day.isToday;
                const hasMissedTasks = dayTasks.some(task => isTaskMissed(task));

                return (
                  <div
                    key={index}
                    className={`calendar-day ${!day.isCurrentMonth ? 'other-month' : ''} ${isToday ? 'today' : ''} ${hasMissedTasks ? 'has-missed' : ''}`}
                  >
                    <div className="day-number">{day.day}</div>
                    {hasMissedTasks && <div className="missed-dot"></div>}
                    <div className="task-indicators">
                      {dayTasks.slice(0, 3).map((task) => {
                        const missed = isTaskMissed(task);
                        return (
                          <div
                            key={task._id}
                            className={`day-task ${missed ? 'missed' : getPriorityClass(task.priority)} ${task.status === 'Completed' ? 'completed' : ''}`}
                            onClick={() => handleTaskClick(task)}
                            title={`${task.title} - ${task.status}${missed ? ' (MISSED)' : ''}`}
                          >
                            {missed ? '⚠' : task.status === 'Completed' ? '✓' : task.status === 'In Progress' ? '⟳' : '•'} {task.title}
                          </div>
                        );
                      })}
                      {dayTasks.length > 3 && (
                        <div className="day-task" style={{ fontSize: '8px', color: '#8b9991', background: 'transparent' }}>
                          +{dayTasks.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="calendar-sidebar">
            <h3>
              Upcoming Tasks
              <span className="badge-count">{sidebarTasks.length}</span>
            </h3>
            {sidebarTasks.length === 0 ? (
              <p style={{ color: '#b5bfb9', textAlign: 'center', padding: '20px 0', fontSize: '13px' }}>
                No tasks found
              </p>
            ) : (
              sidebarTasks.slice(0, 12).map((task) => {
                const missed = isTaskMissed(task);
                return (
                  <div
                    key={task._id}
                    className={`sidebar-task ${missed ? 'missed' : ''}`}
                    onClick={() => handleTaskClick(task)}
                  >
                    <span className={`task-dot ${missed ? 'missed' : getPriorityDot(task.priority)}`}></span>
                    <div className="task-info">
                      <div className={`title ${missed ? 'missed-title' : ''}`}>
                        {missed ? '⚠ ' : ''}{task.title}
                      </div>
                      <div className="meta">
                        {getProjectName(task.projectId)} • {new Date(task.deadline).toLocaleDateString()}
                        {missed && <span className="missed-label">(Missed!)</span>}
                      </div>
                    </div>
                    <span className={`task-status-badge ${missed ? 'missed' : getStatusClass(task.status)}`}>
                      {missed ? 'Missed' : task.status}
                    </span>
                  </div>
                );
              })
            )}
            {sidebarTasks.length > 12 && (
              <p style={{ fontSize: '11px', color: '#8b9991', textAlign: 'center', marginTop: '8px' }}>
                +{sidebarTasks.length - 12} more tasks
              </p>
            )}
          </div>
        </div>
      </div>

      {selectedTask && (
        <div className="task-modal-overlay" onClick={closeModal}>
          <div className="task-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeModal}>×</button>
            {isTaskMissed(selectedTask) && (
              <div className="missed-warning">
                ⚠ This task has missed its deadline!
              </div>
            )}
            <h2>{selectedTask.title}</h2>
            <div className="task-detail">
              <strong>Description:</strong> {selectedTask.description || 'No description'}
            </div>
            <div className="task-detail">
              <strong>Priority:</strong> 
              <span className={`badge ${getBadgeClass(selectedTask.priority, selectedTask)}`}>
                {selectedTask.priority}
              </span>
            </div>
            <div className="task-detail">
              <strong>Status:</strong>
              <span className={`badge ${isTaskMissed(selectedTask) ? 'badge-missed' : getStatusBadgeClass(selectedTask.status)}`}>
                {isTaskMissed(selectedTask) ? 'Missed' : selectedTask.status}
              </span>
            </div>
            <div className="task-detail">
              <strong>Project:</strong> {getProjectName(selectedTask.projectId)}
            </div>
            <div className="task-detail">
              <strong>Deadline:</strong> {new Date(selectedTask.deadline).toLocaleDateString()}
              {isTaskMissed(selectedTask) && (
                <span style={{ color: '#c62828', marginLeft: '8px', fontWeight: '600' }}>
                  (Missed!)
                </span>
              )}
            </div>
            <div className="modal-actions">
              <button 
                className="btn btn-primary"
                onClick={() => editTask(selectedTask._id)}
              >
                Edit Task
              </button>
              <button 
                className="btn btn-secondary"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Calendar;