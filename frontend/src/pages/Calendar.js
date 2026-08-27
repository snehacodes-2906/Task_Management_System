import React from 'react';
import { Link } from 'react-router-dom';

function CalendarPage({ logout }) {
  const navItems = [
    { name: 'DASHBOARD', path: '/dashboard' },
    { name: 'PROJECTS', path: '/projects' },
    { name: 'TASKS', path: '/tasks' },
    { name: 'CALENDAR', path: '/calendar' },
    { name: 'REPORTS', path: '/reports' }
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#e8e5e8', padding: '16px', gap: '16px', boxSizing: 'border-box' }}>
      
      {/* Integrated Left Sidebar */}
      <aside 
        style={{
          width: '240px',
          backgroundColor: '#382319',
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          padding: '24px 0 0 0',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          overflow: 'hidden',
          flexShrink: 0
        }}
        onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)'}
        onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'}
      >
        {/* Brand Logo Header */}
        <div style={{ padding: '0 24px 36px 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ backgroundColor: '#ffffff', width: '32px', height: '32px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#382319' }}>✓</span>
          </div>
          <h2 style={{ color: '#ffffff', margin: 0, fontSize: '20px', fontWeight: 'bold', letterSpacing: '1px' }}>TASKME</h2>
        </div>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          {navItems.map((item) => (
            <Link 
              key={item.name}
              to={item.path} 
              style={{ 
                color: '#ffffff', 
                padding: '16px 24px', 
                textDecoration: 'none', 
                fontSize: '12px', 
                fontWeight: 'bold', 
                letterSpacing: '1px',
                transition: 'all 0.2s ease',
                backgroundColor: item.path === '/calendar' ? 'rgba(255, 255, 255, 0.15)' : 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.paddingLeft = '28px';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = item.path === '/calendar' ? 'rgba(255, 255, 255, 0.15)' : 'transparent';
                e.currentTarget.style.paddingLeft = '24px';
              }}
            >
              {item.name}
            </Link>
          ))}
          
          {/* Profile & Logout Section */}
          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column' }}>
            <Link 
              to="/profile" 
              style={{ 
                color: '#382319', 
                backgroundColor: '#fdf0f5', 
                padding: '16px 24px', 
                textDecoration: 'none', 
                fontSize: '12px', 
                fontWeight: 'bold', 
                letterSpacing: '1px',
                textAlign: 'center',
                transition: 'background-color 0.2s ease',
                borderTopLeftRadius: '16px',
                borderTopRightRadius: '16px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9dbe6'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fdf0f5'}
            >
              PROFILE
            </Link>
            <button 
              onClick={logout} 
              style={{ 
                background: '#fdf0f5', 
                color: '#382319', 
                border: 'none', 
                borderTop: '1px solid #f4d0de',
                padding: '16px 24px', 
                textAlign: 'center', 
                fontSize: '12px', 
                fontWeight: 'bold', 
                letterSpacing: '1px', 
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#e05252';
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#fdf0f5';
                e.currentTarget.style.color = '#382319';
              }}
            >
              LOGOUT
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content Container matching Dashboard styling */}
      <main style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* Header Bar */}
        <div style={{
          backgroundColor: '#fbf0f4',
          borderRadius: '16px',
          padding: '20px 24px',
          border: '1px solid #e0d0d5'
        }}>
          <span style={{ fontSize: '10px', color: '#8c7870', fontWeight: 'bold', letterSpacing: '1px', display: 'block', marginBottom: '4px' }}>
            WORKSPACE
          </span>
          <h1 style={{ fontSize: '20px', color: '#382319', margin: 0, fontWeight: '800', letterSpacing: '1px' }}>
            TASK CALENDAR
          </h1>
        </div>

        {/* Content Box */}
        <div style={{ 
          flexGrow: 1,
          backgroundColor: '#fbf0f4', 
          borderRadius: '16px', 
          border: '1px solid #e0d0d5',
          padding: '48px 24px', 
          textAlign: 'center', 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justify: 'center',
          gap: '16px'
        }}>
          <p style={{ color: '#382319', margin: 0, fontSize: '16px', fontWeight: '600' }}>
            No tasks found.
          </p>
          <button 
            style={{
              padding: '10px 20px',
              backgroundColor: '#382319',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 'bold',
              color: '#ffffff',
              letterSpacing: '1px',
              transition: 'background-color 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#523425'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#382319'}
          >
            CREATE YOUR FIRST TASK
          </button>
        </div>
      </main>

    </div>
  );
}

export default CalendarPage;