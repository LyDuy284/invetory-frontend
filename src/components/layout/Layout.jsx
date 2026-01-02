import React from 'react';
import { useAuth } from '../../context/AuthContext';

export const AppHeader = () => {
  const { user, logout } = useAuth();
  return (
    <header className="app-header">
      <div className="nav-logo">Inventory Manager</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {user && (
          <div className="nav-user">
            Logged in as <span style={{ color: '#e5e7eb' }}>{user.username}</span>
          </div>
        )}
        <button className="button secondary" onClick={logout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export const Sidebar = ({ active, onChange }) => {
  const links = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'products', label: 'Products' },
    { key: 'orders', label: 'Orders' },
  ];
  return (
    <aside className="app-sidebar">
      <div style={{ fontSize: 13, color: '#9ca3af' }}>Navigation</div>
      <div className="sidebar-nav">
        {links.map((l) => (
          <button
            key={l.key}
            className={
              active === l.key ? 'sidebar-link active' : 'sidebar-link'
            }
            onClick={() => onChange(l.key)}
          >
            {l.label}
          </button>
        ))}
      </div>
    </aside>
  );
};
