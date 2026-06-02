import React from 'react';
import { Home, Image, Settings, Calendar, User, LayoutDashboard } from 'lucide-react';

export default function Sidebar({ activeTab, onTabChange }) {
  const menuItems = [
    { id: 'Home', label: 'My Tasks', icon: Home },
    { id: 'Gallery', label: 'Visual Vault', icon: Image },
    { id: 'Settings', label: 'Document Vault', icon: Settings },
    { id: 'Calendar', label: 'Calendar View', icon: Calendar },
    { id: 'Profile', label: 'User Profile', icon: User },
  ];

  return (
    <aside className="sidebar">
      {/* Sidebar Header Brand Logo */}
      <div className="sidebar-brand">
        <div className="logo-icon-bg">
          <LayoutDashboard size={22} color="#FFF" />
        </div>
        <div className="brand-texts">
          <h2 className="brand-title">VaultFlow</h2>
          <span className="brand-version">v1.2.0</span>
        </div>
      </div>

      {/* Sidebar Navigation Menu */}
      <nav className="sidebar-menu">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`menu-item-btn ${isActive ? 'active' : ''}`}
            >
              <IconComponent size={20} className="menu-icon" />
              <span className="menu-label">{item.label}</span>
              {isActive && <div className="active-dot" />}
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="sidebar-footer">
        <div className="footer-card">
          <p className="card-lbl">WORKSPACE</p>
          <h4 className="card-val">Local Sandbox</h4>
        </div>
      </div>
    </aside>
  );
}
