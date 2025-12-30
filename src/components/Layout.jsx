import React from 'react';

const Layout = ({ children }) => {
  return (
    <div className="app-container">
      <header className="glass-panel header">
        <div className="logo">
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-accent)' }}>
            Trip<span style={{ color: 'var(--text-primary)' }}>Planner</span>
          </h1>
        </div>
        
        <div className="user-controls" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button className="btn-icon" title="Notifications">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
          </button>
          <div className="avatar glass-panel" style={{ padding: '0.5rem 1rem', borderRadius: '50px' }}>
             Israr
          </div>
        </div>
      </header>
      
      <main className="main-content" style={{ display: 'flex', gap: 'var(--spacing-lg)', flex: 1 }}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
