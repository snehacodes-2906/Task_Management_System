import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import './App.css';

import Landing from './pages/Landing';
import Auth from './pages/Auth';
// import Register from './pages/Register';
// import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Tasks from './pages/Tasks';
import AddEditTask from './pages/AddEditTask';
import Calendar from './pages/Calendar.jsx';
import Reports from './pages/Reports';
import Profile from './pages/Profile';


function App() {

  const token = localStorage.getItem('token');

  return (
    <Router>

      <div className="App">

        <Routes>

          {/* Public pages */}

          <Route
            path="/"
            element={<Landing />}
          />

          <Route
            path="/register"
            element={<Auth />}
          />

          <Route
            path="/login"
            element={<Auth />}
          />

          {/* <Route
            path="/register"
            element={<Register />}
          />

          <Route
            path="/login"
            element={<Login />}
          /> */}


          {/* Protected pages */}

          <Route
            path="/dashboard"
            element={
              token
                ? <Dashboard />
                : <Navigate to="/login" />
            }
          />

          <Route
            path="/projects"
            element={
              token
                ? <Projects />
                : <Navigate to="/login" />
            }
          />

          <Route
            path="/tasks"
            element={
              token
                ? <Tasks />
                : <Navigate to="/login" />
            }
          />

          <Route
            path="/tasks/new"
            element={
              token
                ? <AddEditTask />
                : <Navigate to="/login" />
            }
          />

          <Route
            path="/tasks/edit/:id"
            element={
              token
                ? <AddEditTask />
                : <Navigate to="/login" />
            }
          />

          <Route
            path="/calendar"
            element={
              token
                ? <Calendar />
                : <Navigate to="/login" />
            }
          />

          <Route
            path="/reports"
            element={
              token
                ? <Reports />
                : <Navigate to="/login" />
            }
          />

          <Route
            path="/profile"
            element={
              token
                ? <Profile />
                : <Navigate to="/login" />
            }
          />

        </Routes>

      </div>

    </Router>
  );
}

export default App;