import React from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';

function Landing() {
  return (
    <div className="page">

      {/* Navbar */}
      <nav className="navbar">

        <Link to="/" className="logo">
          <span className="logoIcon">✓</span>
          TaskFlow
        </Link>

        <div className="navLinks">
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#about">About</a>
        </div>

        <div className="navButtons">
          <Link to="/login" className="login">
            Login
          </Link>

          <Link to="/register" className="register">
            Register
          </Link>
        </div>

      </nav>


      {/* Main Section */}
      <section className="main" id="home">

        {/* Left Side */}
        <div className="left">

          <div className="smallText">
            ✦ Simple task management for everyone
          </div>

          <h1>
            Plan Your Work,
            <br />
            <span>Achieve More.</span>
          </h1>

          <p>
            Manage your tasks, organize your projects, and stay
            focused on what matters most. Keep everything you need
            in one simple place.
          </p>

          <div className="buttons">

            <Link to="/register" className="start">
              Get Started
            </Link>

            <a href="#features" className="learn">
              Learn More →
            </a>

          </div>

          <div className="features">

            <div>
              <b>✓</b>
              Easy to use
            </div>

            <div>
              <b>✓</b>
              Stay organized
            </div>

            <div>
              <b>✓</b>
              Track progress
            </div>

          </div>

        </div>


        {/* Right Side */}
        <div className="right">

          <div className="taskBox">

            <div className="boxTop">
              <div>
                <h3>My Tasks</h3>
                <p>Tuesday, August 26</p>
              </div>

              <span className="threeDots">•••</span>
            </div>


            <div className="progress">
              <div className="progressText">
                <span>Today's progress</span>
                <b>75%</b>
              </div>

              <div className="progressBar">
                <div></div>
              </div>
            </div>


            <div className="task done">
              <span className="check">✓</span>

              <div>
                <b>Complete project report</b>
                <small>Today · 10:00 AM</small>
              </div>
            </div>


            <div className="task">
              <span className="circle"></span>

              <div>
                <b>Prepare presentation</b>
                <small>Today · 2:00 PM</small>
              </div>
            </div>


            <div className="task">
              <span className="circle"></span>

              <div>
                <b>Review assignments</b>
                <small>Tomorrow · 9:00 AM</small>
              </div>
            </div>


            <button className="addTask">
              + Add New Task
            </button>

          </div>


          {/* Small floating card */}
          <div className="completedBox">
            <span>✓</span>

            <div>
              <b>12 Tasks</b>
              <small>completed this week</small>
            </div>
          </div>

        </div>

      </section>


      {/* Bottom Section */}
      <section className="bottom" id="features">

        <p>Everything you need to stay organized</p>

        <div className="bottomItems">

          <div>
            <span>📋</span>
            <b>Manage Tasks</b>
          </div>

          <div>
            <span>📊</span>
            <b>Track Progress</b>
          </div>

          <div>
            <span>📅</span>
            <b>Plan Your Day</b>
          </div>

          <div>
            <span>⭐</span>
            <b>Set Priorities</b>
          </div>

        </div>

      </section>

    </div>
  );
}

export default Landing;