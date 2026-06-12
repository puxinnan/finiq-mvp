import React, { useState, useEffect } from 'react';
import { getMistakes, removeMistake } from '../utils/storage';

const MistakeBook = ({ onBack }) => {
  const [mistakes, setMistakes] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    setMistakes(getMistakes());
  }, []);

  const handleOptionClick = (index) => {
    if (showFeedback) return;
    setSelectedOption(index);
    setShowFeedback(true);
  };

  const handleNextQuiz = () => {
    const currentQuiz = mistakes[currentIdx];
    const isCorrect = currentQuiz.options[selectedOption].isCorrect;

    let updatedMistakes = [...mistakes];
    
    if (isCorrect) {
      // Remove from storage
      removeMistake(currentQuiz.title);
      // Remove from local state
      updatedMistakes = updatedMistakes.filter(m => m.title !== currentQuiz.title);
      setMistakes(updatedMistakes);
      
      // Don't increment index because the array just shrunk, 
      // but we need to handle if we removed the last item
      if (currentIdx >= updatedMistakes.length) {
        setCurrentIdx(0);
      }
    } else {
      // Kept in mistakes, move to next
      if (currentIdx < updatedMistakes.length - 1) {
        setCurrentIdx(currentIdx + 1);
      } else {
        setCurrentIdx(0);
      }
    }

    setSelectedOption(null);
    setShowFeedback(false);
  };

  if (mistakes.length === 0) {
    return (
      <div className="animate-fade-in" style={{ textAlign: 'center', marginTop: '4rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
        <h2>太棒了！你的错题本是空的！</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '1rem', marginBottom: '2rem' }}>
          继续保持，去挑战更多关卡吧！
        </p>
        <button className="btn btn-primary" onClick={onBack}>返回主页</button>
      </div>
    );
  }

  const quiz = mistakes[currentIdx];

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <button className="btn btn-outline" style={{ marginBottom: '2rem' }} onClick={onBack}>
        ← 返回主页
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
        <span>错题本复习模式</span>
        <span>剩余待复习：{mistakes.length} 题</span>
      </div>

      <div className="glass-card" style={{ marginTop: '2rem', border: '1px solid var(--danger-color)' }}>
        <h2 style={{ color: 'var(--danger-color)' }}>{quiz.title}</h2>
        <p style={{ whiteSpace: 'pre-line', fontSize: '1.2rem', margin: '2rem 0' }}>{quiz.content}</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {quiz.options.map((opt, idx) => (
            <div 
              key={idx}
              onClick={() => handleOptionClick(idx)}
              style={{
                padding: '1rem',
                border: `2px solid ${selectedOption === idx ? (opt.isCorrect ? 'var(--secondary-color)' : 'var(--danger-color)') : 'rgba(255,255,255,0.1)'}`,
                borderRadius: '8px',
                cursor: showFeedback ? 'default' : 'pointer',
                backgroundColor: selectedOption === idx ? 'rgba(255,255,255,0.05)' : 'transparent',
                transition: 'all 0.2s ease'
              }}
            >
              {opt.text}
            </div>
          ))}

          {showFeedback && (
            <div className="animate-fade-in" style={{ 
              marginTop: '1rem', 
              padding: '1rem', 
              backgroundColor: quiz.options[selectedOption].isCorrect ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              color: quiz.options[selectedOption].isCorrect ? 'var(--secondary-color)' : 'var(--danger-color)',
              borderRadius: '8px'
            }}>
              {quiz.options[selectedOption].isCorrect ? '回答正确！这道题已从错题本移除。' : '又错了哦，请仔细看解析：'}<br/><br/>
              {quiz.options[selectedOption].feedback}
            </div>
          )}

          {showFeedback && (
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <button className="btn btn-primary" onClick={handleNextQuiz}>
                继续复习
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MistakeBook;
