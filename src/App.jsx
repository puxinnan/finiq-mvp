import React, { useState } from 'react';
import './index.css';

// Components
import HomeCategoryView from './components/HomeCategoryView';
import FinancialIQView from './components/FinancialIQView';
import LandingPage from './components/LandingPage';
import CourseView from './components/CourseView';
import Leaderboard from './components/Leaderboard';
import MistakeBook from './components/MistakeBook';
import CashflowGame from './components/CashflowGame';

function App() {
  const [currentView, setCurrentView] = useState('home_category');
  const [selectedLessonId, setSelectedLessonId] = useState(null);
  const [courseMode, setCourseMode] = useState('theory');

  const handleGoHome = () => {
    setCurrentView('home_category');
    setSelectedLessonId(null);
  };

  const handleStartLearning = (lessonId, mode = 'theory') => {
    setSelectedLessonId(lessonId);
    setCourseMode(mode);
    setCurrentView('course');
  };

  return (
    <div className="app-container">
      <header className="header animate-fade-in">
        <div className="logo" onClick={handleGoHome} style={{ cursor: 'pointer' }}>
          🪙 FinIQ 个人成长中心
        </div>
        <nav style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-primary" onClick={() => setCurrentView('cashflow_game')}>
            🎲 现金流沙盘
          </button>
          <button className="btn btn-outline" onClick={() => setCurrentView('mistakes')}>
            📖 错题本
          </button>
          <button className="btn btn-outline" onClick={() => setCurrentView('leaderboard')}>
            🏆 排行榜
          </button>
        </nav>
      </header>

      <main style={{ flex: 1 }}>
        {currentView === 'home_category' && (
          <HomeCategoryView 
            onSelectCategory={(category) => {
              if (category === 'financial_iq') setCurrentView('financial_iq');
            }} 
          />
        )}
        
        {currentView === 'financial_iq' && (
          <FinancialIQView 
            onSelectLearn={() => setCurrentView('learn_books')}
            onSelectGame={() => setCurrentView('cashflow_game')}
            onBack={handleGoHome}
          />
        )}

        {currentView === 'learn_books' && (
          <div className="animate-fade-in">
            <div style={{ padding: '1rem 2rem' }}>
              <button className="btn btn-outline" onClick={() => setCurrentView('financial_iq')}>
                ← 返回财商选项
              </button>
            </div>
            <LandingPage onStart={handleStartLearning} />
          </div>
        )}

        {currentView === 'course' && selectedLessonId && (
          <CourseView lessonId={selectedLessonId} initialPhase={courseMode} onBack={() => setCurrentView('learn_books')} />
        )}
        
        {currentView === 'leaderboard' && <Leaderboard onBack={handleGoHome} />}
        {currentView === 'mistakes' && <MistakeBook onBack={handleGoHome} />}
        {currentView === 'cashflow_game' && <CashflowGame onBack={() => setCurrentView('financial_iq')} />}
      </main>

      <footer style={{ marginTop: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <p>© 2026 FinIQ 个人成长平台 MVP版</p>
      </footer>
    </div>
  );
}

export default App;
