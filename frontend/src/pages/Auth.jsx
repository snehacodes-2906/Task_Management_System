import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Auth.css';

function Auth() {
  const location = useLocation();
  const navigate = useNavigate();

  const isRegister = location.pathname === '/register';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Clear messages when switching between Login/Register
  useEffect(() => {
    setError('');
    setFormData({
      name: '',
      email: '',
      password: ''
    });
  }, [isRegister]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("LOGIN/REGISTER BUTTON CLICKED");
    console.log("isRegister:", isRegister);
    console.log("formData:", formData);

    setError('');
    setLoading(true);

    try {

      // =========================
      // REGISTER
      // =========================
      if (isRegister) {

        console.log("Sending REGISTER request...");

        const response=await api.post('/auth/register', {
          name: formData.name,
          email: formData.email,
          password: formData.password
        });

        console.log("REGISTER RESPONSE:", response.data);

        navigate('/login');

      }

      // =========================
      // LOGIN
      // =========================
      else {

        console.log("Sending LOGIN request...");

        const response = await api.post('/auth/login', {
          email: formData.email,
          password: formData.password
        });

        console.log("LOGIN RESPONSE:", response.data);

        // Store token only after LOGIN
        localStorage.setItem(
          'token',
          response.data.token
        );

        localStorage.setItem(
          'user',
          JSON.stringify(response.data.user)
        );

        console.log("TOKEN SAVED");
        console.log("Navigating to dashboard...");


        navigate('/dashboard');
      }

    } catch (err) {

      console.log("LOGIN ERROR:", err);
      console.log("ERROR RESPONSE:", err.response);
      console.log("ERROR DATA:", err.response?.data);


      setError(
        err.response?.data?.message ||
        (isRegister
          ? 'Registration failed'
          : 'Login failed')
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className={`auth-container ${isRegister ? 'register-mode' : 'login-mode'}`}>

        {/* =====================================
            LEFT / RIGHT DECORATIVE PANEL
        ====================================== */}

        <div className="auth-info">

          <div className="brand">
            <div className="brand-icon">✓</div>

            <div>
              <h2>TaskFlow</h2>
              <span>Task Management System</span>
            </div>
          </div>


          <div className="info-content">

            {isRegister ? (
              <>
                <span className="info-label">
                  GET STARTED
                </span>

                <h1>
                  Build better
                  <br />
                  <span>work habits.</span>
                </h1>

                <p>
                  Organize your tasks, manage your projects
                  and keep track of your progress — all in
                  one simple place.
                </p>

                <div className="info-features">

                  <div>
                    <span className="feature-icon">✓</span>
                    <div>
                      <strong>Organize Tasks</strong>
                      <p>
                        Keep all your work organized in one place.
                      </p>
                    </div>
                  </div>

                  <div>
                    <span className="feature-icon">□</span>
                    <div>
                      <strong>Manage Projects</strong>
                      <p>
                        Create and manage multiple projects easily.
                      </p>
                    </div>
                  </div>

                  <div>
                    <span className="feature-icon">↗</span>
                    <div>
                      <strong>Track Progress</strong>
                      <p>
                        Monitor your productivity and stay on schedule.
                      </p>
                    </div>
                  </div>

                </div>
              </>
            ) : (
              <>
                <span className="info-label">
                  WELCOME BACK
                </span>

                <h1>
                  More clarity.
                  <br />
                  <span>More productivity.</span>
                </h1>

                <p>
                  Welcome back to TaskFlow. Pick up where
                  you left off and keep your work moving forward.
                </p>

                <div className="login-message">

                  <div className="big-check">
                    ✓
                  </div>

                  <div>
                    <strong>Your workspace awaits.</strong>
                    <p>
                      Your tasks, projects and progress
                      are ready for you.
                    </p>
                  </div>

                </div>
              </>
            )}

          </div>


          <div className="copyright">
            © 2026 TaskFlow. Stay organized.
          </div>

        </div>


        {/* =====================================
            FORM PANEL
        ====================================== */}

        <div className="auth-form-panel">

          <div className="switcher">

            <Link
              to="/login"
              className={!isRegister ? 'active' : ''}
            >
              Login
            </Link>

            <Link
              to="/register"
              className={isRegister ? 'active' : ''}
            >
              Register
            </Link>

          </div>


          <div className="form-content">

            <div className="form-heading">

              <span className="mobile-label">
                {isRegister ? 'CREATE ACCOUNT' : 'WELCOME BACK'}
              </span>

              <h2>
                {isRegister
                  ? 'Create Account'
                  : 'Welcome Back'}
              </h2>

              <p>
                {isRegister
                  ? 'Join TaskFlow and start organizing your work.'
                  : 'Login to continue managing your tasks.'}
              </p>

            </div>


            {error && (
              <div className="auth-error">
                {error}
              </div>
            )}


            <form onSubmit={handleSubmit}>

              {/* NAME ONLY FOR REGISTER */}

              {isRegister && (
                <div className="input-group">

                  <label>Full Name</label>

                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />

                </div>
              )}


              {/* EMAIL */}

              <div className="input-group">

                <label>Email</label>

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

              </div>


              {/* PASSWORD */}

              <div className="input-group">

                <label>Password</label>

                <input
                  type="password"
                  name="password"
                  placeholder={
                    isRegister
                      ? 'Minimum 6 characters'
                      : 'Enter your password'
                  }
                  value={formData.password}
                  onChange={handleChange}
                  minLength={isRegister ? 6 : undefined}
                  required
                />

              </div>


              {/* SUBMIT */}

              <button
                type="submit"
                className="submit-button"
                disabled={loading}
              >

                {loading
                  ? 'Please wait...'
                  : isRegister
                    ? 'Create Account'
                    : 'Login'}

                {!loading && (
                  <span>→</span>
                )}

              </button>

            </form>


            <div className="switch-text">

              {isRegister ? (
                <>
                  Already have an account?
                  <Link to="/login">
                    Login
                  </Link>
                </>
              ) : (
                <>
                  Don't have an account?
                  <Link to="/register">
                    Create one
                  </Link>
                </>
              )}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Auth;