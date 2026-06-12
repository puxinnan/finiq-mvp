import React, { useState } from 'react';
import './index.css';

// Components
import LandingPage from './components/LandingPage';
import CourseView from './components/CourseView';
import Leaderboard from './components/Leaderboard';
import MistakeBook from './components/MistakeBook';
import CashflowGame from './components/CashflowGame';
import { COURSES } from './data/courses';

function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [selectedLessonId, setSelectedLessonId] = useState(null);

  const handleStartLearning = (lessonId) => {
    setSelectedLessonId(lessonId);
    setCurrentView('course');
  };

  const handleGoHome = () => {
    setCurrentView('landing');
    setSelectedLessonId(null);
  };

  return (
    <div className="app-container">
      <header className="header animate-fade-in">
        <div className="logo" onClick={handleGoHome} style={{ cursor: 'pointer' }}>
          🪙 FinIQ 学财商
        </div>
        <nav style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-primary" onClick={() => setCurrentView('cashflow_game')} style={{ backgroundColor: '#10b981' }}>
            🎲 现金流沙盘
          </button>
          <button className="btn btn-outline" onClick={() => setCurrentView('mistakes')} style={{ borderColor: 'var(--danger-color)', color: 'var(--danger-color)' }}>
            📖 错题本
          </button>
          <button className="btn btn-outline" onClick={() => setCurrentView('leaderboard')} style={{ borderColor: 'var(--accent-color)', color: 'var(--accent-color)' }}>
            🏆 排行榜
          </button>
        </nav>
      </header>

      <main style={{ flex: 1 }}>
        {currentView === 'landing' && <LandingPage onStart={handleStartLearning} />}
        {currentView === 'course' && selectedLessonId && (
          <CourseView lessonId={selectedLessonId} onBack={handleGoHome} />
        )}
        {currentView === 'leaderboard' && <Leaderboard onBack={handleGoHome} />}
        {currentView === 'mistakes' && <MistakeBook onBack={handleGoHome} />}
        {currentView === 'cashflow_game' && <CashflowGame onBack={handleGoHome} />}
      </main>

      <footer style={{ marginTop: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <p>© 2026 FinIQ 财商教育平台 MVP版</p>
      </footer>
    </div>
  );
}

export default App;
