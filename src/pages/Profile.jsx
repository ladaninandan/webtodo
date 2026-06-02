import React, { useState } from 'react';
import { Search } from 'lucide-react';

export default function Profile() {
  const [search, setSearch] = useState('');
  const [activeSubTab, setActiveSubTab] = useState('personal'); // 'personal' | 'account'

  return (
    <div className="page profile-page">
      {/* Header */}
      <div className="page-header" style={{ paddingBottom: '8px' }}>
        <div>
          <h1 className="page-title" style={{ marginBottom: '12px', display: 'none' }}>Profile</h1>
          
          {/* Static Search Bar */}
          <div className="profile-search-bar">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search profile..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
      </div>

      {/* Sub Tabs Top Navigation Bar */}
      <div className="profile-sub-tabs">
        <button
          className={`sub-tab-btn ${activeSubTab === 'personal' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('personal')}
        >
          Personal
        </button>
        <button
          className={`sub-tab-btn ${activeSubTab === 'account' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('account')}
        >
          Account
        </button>
      </div>

      {/* Static Sub-Tab Content Placeholders */}
      <div className="profile-tab-content" style={{ display: 'flex', flex: 1, padding: '30px 16px' }}>
        {activeSubTab === 'personal' ? (
          <div className="empty-state" style={{ margin: 'auto', maxWidth: '400px' }}>
            <h3 className="empty-title" style={{ fontSize: '18px', fontWeight: '600' }}>Personal Info</h3>
            <p className="empty-hint" style={{ textAlign: 'center', marginTop: '6px' }}>
              Here you can manage your personal details.
            </p>
          </div>
        ) : (
          <div className="empty-state" style={{ margin: 'auto', maxWidth: '400px' }}>
            <h3 className="empty-title" style={{ fontSize: '18px', fontWeight: '600' }}>Account Settings</h3>
            <p className="empty-hint" style={{ textAlign: 'center', marginTop: '6px' }}>
              Here you can manage your account preferences.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
