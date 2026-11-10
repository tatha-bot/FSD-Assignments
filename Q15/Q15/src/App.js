import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userName, setUserName] = useState('Tathagata');
  const [simulatedHour, setSimulatedHour] = useState(null);

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Determine effective hour (either simulated or actual)
  const currentHour = simulatedHour !== null ? simulatedHour : currentTime.getHours();

  // Determine greeting, icon, theme, and quote based on time
  const getGreetingData = (hour) => {
    if (hour >= 5 && hour < 12) {
      return {
        greeting: 'Good Morning',
        icon: '🌅',
        timePeriod: 'Morning (05:00 - 11:59)',
        themeClass: 'theme-morning',
        color: '#f59e0b',
        quote: 'Start your day with positive energy, focus, and determination.'
      };
    } else if (hour >= 12 && hour < 17) {
      return {
        greeting: 'Good Afternoon',
        icon: '☀️',
        timePeriod: 'Afternoon (12:00 - 16:59)',
        themeClass: 'theme-afternoon',
        color: '#0284c7',
        quote: 'Keep up the momentum. You are halfway through achieving your goals today.'
      };
    } else if (hour >= 17 && hour < 21) {
      return {
        greeting: 'Good Evening',
        icon: '🌆',
        timePeriod: 'Evening (17:00 - 20:59)',
        themeClass: 'theme-evening',
        color: '#8b5cf6',
        quote: 'Reflect on today\'s achievements, unwind, and prepare for tomorrow.'
      };
    } else {
      return {
        greeting: 'Good Night',
        icon: '🌙',
        timePeriod: 'Night (21:00 - 04:59)',
        themeClass: 'theme-night',
        color: '#38bdf8',
        quote: 'Rest well and recharge. Tomorrow brings a fresh opportunity to excel.'
      };
    }
  };

  const greetingInfo = getGreetingData(currentHour);

  // Format real-time clock string
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  // Format date string
  const formatDate = (date) => {
    return date.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className={`greeting-app-wrapper ${greetingInfo.themeClass}`}>
      <div className="greeting-card">
        {/* Header Badge */}
        <div className="header-meta">
          <span className="period-pill">{greetingInfo.timePeriod}</span>
          <span className="live-badge">
            <span className="live-dot"></span> Live Clock
          </span>
        </div>

        {/* Dynamic Greeting Message */}
        <div className="greeting-hero">
          <div className="greeting-icon">{greetingInfo.icon}</div>
          <h1 className="greeting-text" style={{ color: greetingInfo.color }}>
            {greetingInfo.greeting}, {userName || 'Friend'}!
          </h1>
          <p className="greeting-quote">"{greetingInfo.quote}"</p>
        </div>

        {/* Digital Clock Display */}
        <div className="clock-container">
          <div className="time-display">{formatTime(currentTime)}</div>
          <div className="date-display">{formatDate(currentTime)}</div>
        </div>

        {/* Interactive Personalization */}
        <div className="settings-panel">
          <div className="input-group">
            <label>Personalize Name:</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your name..."
              className="name-input"
            />
          </div>

          {/* Test / Simulate Other Hours */}
          <div className="simulator-group">
            <label>Test Other Time Slots (Preview Mode):</label>
            <div className="preset-buttons">
              <button
                className={`preset-btn ${currentHour === 8 && simulatedHour !== null ? 'active' : ''}`}
                onClick={() => setSimulatedHour(8)}
              >
                🌅 Morning (8 AM)
              </button>
              <button
                className={`preset-btn ${currentHour === 14 && simulatedHour !== null ? 'active' : ''}`}
                onClick={() => setSimulatedHour(14)}
              >
                ☀️ Afternoon (2 PM)
              </button>
              <button
                className={`preset-btn ${currentHour === 18 && simulatedHour !== null ? 'active' : ''}`}
                onClick={() => setSimulatedHour(18)}
              >
                🌆 Evening (6 PM)
              </button>
              <button
                className={`preset-btn ${currentHour === 23 && simulatedHour !== null ? 'active' : ''}`}
                onClick={() => setSimulatedHour(23)}
              >
                🌙 Night (11 PM)
              </button>
              {simulatedHour !== null && (
                <button
                  className="preset-btn btn-reset"
                  onClick={() => setSimulatedHour(null)}
                >
                  &#8635; Real System Time
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
