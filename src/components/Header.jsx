import React from 'react';
import { observer } from 'mobx-react-lite';
import { User } from 'lucide-react';

export const Header = observer(({ activeTab, onTabChange }) => {
  const getPageTitle = () => {
    switch (activeTab) {
      case 'Home':
        return 'Tasks Dashboard';
      case 'Gallery':
        return 'Visual Vault';
      case 'Settings':
        return 'Document Vault';
      case 'Calendar':
        return 'Timeline Schedule';
      case 'Profile':
        return 'User Profile & Settings';
      default:
        return 'Dashboard';
    }
  };

  return (
    <header className="main-header">
      {/* View Context Title */}
      <div className="header-context">
        <h1 className="context-title">{getPageTitle()}</h1>
      </div>

      {/* Control Widgets */}
      <div className="header-actions">
        {/* User shortcut avatar */}
        <button className="header-profile-shortcut" onClick={() => onTabChange('Profile')}>
          <div className="avatar-small">
            <User size={16} color="#6366F1" />
          </div>
          <span className="header-user-name">John Doe</span>
        </button>
      </div>
    </header>
  );
});

export default Header;
