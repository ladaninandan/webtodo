import React from 'react';

export default function Calendar() {
  return (
    <div className="page calendar-page">
      <div className="page-header" style={{ display: 'none' }}>
        <h1 className="page-title">Calendar</h1>
      </div>

      <div className="empty-state" style={{ margin: 'auto', maxWidth: '400px' }}>
        <span className="empty-icon" role="img" aria-label="calendar">📅</span>
        <h3 className="empty-title" style={{ fontSize: '18px', fontWeight: '600' }}>Your Upcoming Tasks</h3>
        <p className="empty-hint" style={{ textAlign: 'center', marginTop: '6px' }}>
          This screen is a placeholder for the calendar view.
        </p>
      </div>
    </div>
  );
}
