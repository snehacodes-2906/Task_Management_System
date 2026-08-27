import React from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';

function Landing() {
  return (
    <div className="landing-page">

      {/* ================= NAVBAR ================= */}
      <nav className="landing-navbar">

        <Link to="/" className="brand">
          <div className="brand-icon">✓</div>
          <span>TaskFlow</span>
        </Link>

        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How it works</a>
          <a href="#about">About</a>
        </div>

        <div className="nav-actions">
          <Link to="/login" className="login-link">
            Log in
          </Link>

          <Link to="/register" className="signup-button">
            Get started
          </Link>
        </div>

      </nav>


      {/* ================= HERO SECTION ================= */}
      <main>

        <section className="hero">

          <div className="hero-content">

            <div className="hero-badge">
              <span>✦</span>
              Simple task management
            </div>

            <h1>
              Organize your work.
              <br />
              <span>Achieve more.</span>
            </h1>

            <p className="hero-description">
              TaskFlow helps you organize tasks, manage projects,
              track progress, and stay focused — all in one simple place.
            </p>

            <div className="hero-buttons">

              <Link to="/register" className="primary-button">
                Get started
                <span>→</span>
              </Link>

              <a href="#features" className="secondary-button">
                Learn more
              </a>

            </div>

            <p className="hero-note">
              Free to get started · Simple and easy to use
            </p>

          </div>


          {/* ================= DASHBOARD PREVIEW ================= */}
          <div className="dashboard-wrapper">

            <div className="dashboard-window">

              {/* Window top */}
              <div className="window-header">

                <div className="window-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>

                <span className="window-title">
                  TaskFlow
                </span>

              </div>


              <div className="dashboard-body">

                {/* Sidebar */}
                <aside className="dashboard-sidebar">

                  <div className="sidebar-brand">
                    <div className="mini-logo">✓</div>
                    <span>TaskFlow</span>
                  </div>

                  <div className="sidebar-menu">

                    <div className="menu-item active">
                      <span>⌂</span>
                      Dashboard
                    </div>

                    <div className="menu-item">
                      <span>□</span>
                      Tasks
                    </div>

                    <div className="menu-item">
                      <span>▣</span>
                      Projects
                    </div>

                    <div className="menu-item">
                      <span>◷</span>
                      Calendar
                    </div>

                    <div className="menu-item">
                      <span>↗</span>
                      Reports
                    </div>

                  </div>

                </aside>


                {/* Main dashboard */}
                <div className="dashboard-main">

                  <div className="dashboard-top">

                    <div>
                      <p className="dashboard-small">
                        Tuesday, August 26
                      </p>

                      <h3>
                        Good morning 👋
                      </h3>
                    </div>

                    <div className="profile-circle">
                      S
                    </div>

                  </div>


                  {/* Stats */}
                  <div className="stats">

                    <div className="stat-card">
                      <span className="stat-icon">□</span>

                      <div>
                        <small>Total Tasks</small>
                        <strong>24</strong>
                      </div>
                    </div>

                    <div className="stat-card">
                      <span className="stat-icon green">✓</span>

                      <div>
                        <small>Completed</small>
                        <strong>16</strong>
                      </div>
                    </div>

                    <div className="stat-card">
                      <span className="stat-icon orange">◷</span>

                      <div>
                        <small>Pending</small>
                        <strong>8</strong>
                      </div>
                    </div>

                  </div>


                  {/* Tasks section */}
                  <div className="task-section">

                    <div className="section-heading">
                      <h4>Today's tasks</h4>
                      <span>View all →</span>
                    </div>


                    <div className="preview-task completed">

                      <div className="task-check">
                        ✓
                      </div>

                      <div className="task-info">
                        <strong>Complete project report</strong>
                        <small>Project Management</small>
                      </div>

                      <span className="task-status done">
                        Done
                      </span>

                    </div>


                    <div className="preview-task">

                      <div className="task-check empty">
                      </div>

                      <div className="task-info">
                        <strong>Prepare presentation</strong>
                        <small>College Project</small>
                      </div>

                      <span className="task-status progress">
                        In progress
                      </span>

                    </div>


                    <div className="preview-task">

                      <div className="task-check empty">
                      </div>

                      <div className="task-info">
                        <strong>Review assignments</strong>
                        <small>Personal</small>
                      </div>

                      <span className="task-status pending">
                        Pending
                      </span>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>


        {/* ================= FEATURES ================= */}
        <section className="features-section" id="features">

          <div className="section-intro">

            <span className="section-label">
              FEATURES
            </span>

            <h2>
              Everything you need to
              <br />
              <span>stay organized.</span>
            </h2>

            <p>
              Simple tools that help you plan your work,
              manage your projects, and track your progress.
            </p>

          </div>


          <div className="features-grid">

            <div className="feature-card">

              <div className="feature-icon">
                ✓
              </div>

              <h3>
                Manage Tasks
              </h3>

              <p>
                Create, edit, organize, and complete
                tasks without losing track of your work.
              </p>

            </div>


            <div className="feature-card">

              <div className="feature-icon">
                □
              </div>

              <h3>
                Manage Projects
              </h3>

              <p>
                Keep related tasks together and manage
                multiple projects from one place.
              </p>

            </div>


            <div className="feature-card">

              <div className="feature-icon">
                ↗
              </div>

              <h3>
                Track Progress
              </h3>

              <p>
                See completed, pending, and in-progress
                tasks to understand your productivity.
              </p>

            </div>


            <div className="feature-card">

              <div className="feature-icon">
                ◷
              </div>

              <h3>
                Plan Your Time
              </h3>

              <p>
                Use deadlines and the calendar to stay
                on schedule and avoid missed tasks.
              </p>

            </div>

          </div>

        </section>


        {/* ================= HOW IT WORKS ================= */}
        <section className="how-section" id="how-it-works">

          <div className="how-content">

            <span className="section-label">
              HOW IT WORKS
            </span>

            <h2>
              From idea to done.
            </h2>

            <p>
              TaskFlow keeps your workflow simple.
              Add your work, organize it, and keep moving.
            </p>

          </div>


          <div className="steps">

            <div className="step">

              <div className="step-number">
                01
              </div>

              <div>
                <h3>Create your tasks</h3>
                <p>
                  Add tasks with descriptions, priorities,
                  deadlines, and projects.
                </p>
              </div>

            </div>


            <div className="step">

              <div className="step-number">
                02
              </div>

              <div>
                <h3>Organize your work</h3>
                <p>
                  Group tasks into projects and manage
                  everything from your dashboard.
                </p>
              </div>

            </div>


            <div className="step">

              <div className="step-number">
                03
              </div>

              <div>
                <h3>Track your progress</h3>
                <p>
                  Monitor your completed tasks and see
                  how much work you've accomplished.
                </p>
              </div>

            </div>

          </div>

        </section>


        {/* ================= CTA ================= */}
        <section className="cta-section" id="about">

          <div className="cta-box">

            <div>
              <span className="section-label light">
                GET STARTED
              </span>

              <h2>
                Ready to get organized?
              </h2>

              <p>
                Start managing your tasks and projects
                with TaskFlow today.
              </p>
            </div>

            <Link to="/register" className="cta-button">
              Create your account
              <span>→</span>
            </Link>

          </div>

        </section>

      </main>


      {/* ================= FOOTER ================= */}
      <footer className="footer">

        <div className="footer-brand">

          <div className="brand">
            <div className="brand-icon">
              ✓
            </div>

            <span>
              TaskFlow
            </span>
          </div>

          <p>
            Simple task management for productive people.
          </p>

        </div>

        <div className="footer-bottom">
          © 2026 TaskFlow. All rights reserved.
        </div>

      </footer>

    </div>
  );
}

export default Landing;