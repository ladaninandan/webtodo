import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import './App.css';

// Layout Components
import Sidebar from './components/Sidebar';
import Header from './components/Header';

// Pages
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import Documents from './pages/Documents';
import Calendar from './pages/Calendar';
import Profile from './pages/Profile';

export const App = observer(() => {
  const [activeNavTab, setActiveNavTab] = useState('Home'); // Home | Gallery | Settings | Calendar | Profile

  const renderPage = () => {
    switch (activeNavTab) {
      case 'Home':
        return <Home />;
      case 'Gallery':
        return <Gallery />;
      case 'Settings':
        return <Documents />;
      case 'Calendar':
        return <Calendar />;
      case 'Profile':
        return <Profile />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="dashboard-app">
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeNavTab} onTabChange={setActiveNavTab} />

      {/* Main Panel Content Area */}
      <div className="dashboard-main">
        {/* Top Control Bar Header */}
        <Header activeTab={activeNavTab} onTabChange={setActiveNavTab} />

        {/* Dynamic Page Viewer */}
        <main className="dashboard-content">
          {renderPage()}
        </main>
      </div>
    </div>
  );
});

export default App;
