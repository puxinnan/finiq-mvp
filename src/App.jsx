import React, { useState, useEffect } from 'react';
import './index.css';

// Components
import HomeCategoryView from './components/HomeCategoryView';
import FinancialIQView from './components/FinancialIQView';
import LandingPage from './components/LandingPage';
import CourseView from './components/CourseView';
import Leaderboard from './components/Leaderboard';
import MistakeBook from './components/MistakeBook';
import CashflowGame from './components/CashflowGame';
import Login from './components/Login';

// Storage
import { getCurrentUser, logout } from './utils/storage';

function App() {
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());
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

  const handleLogout = () => {
    logout();
    setCurrentUser(null);
    setCurrentView('home_category');
  };

  // 如果没有登录，渲染登录页面
  if (!currentUser) {
    return <Login onLoginSuccess={() => setCurrentUser(getCurrentUser())} />;
  }

  return (
    <div className="app-container">
      <header className="header animate-fade-in">
        <div className="logo" onClick={handleGoHome} style={{ cursor: 'pointer' }}>
          🪙 FinIQ 个人成长中心
        </div>
        <nav style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button className="btn btn-primary" onClick={() => setCurrentView('cashflow_game')}>
            🎲 现金流沙盘
          </button>
          <button className="btn btn-outline" onClick={() => setCurrentView('mistakes')}>
            📖 错题本
          </button>
          <button className="btn btn-outline" onClick={() => setCurrentView('leaderboard')}>
            🏆 排行榜
          </button>
          <div style={{ marginLeft: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>👤 {currentUser}</span>
            <button className="btn btn-outline" style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem', border: 'none', color: 'var(--danger-color)' }} onClick={handleLogout}>
              退出
            </button>
          </div>
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
