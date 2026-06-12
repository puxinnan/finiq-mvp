import React, { useState, useEffect } from 'react';
import { COURSES } from '../data/courses';
import { addScore, addMistake } from '../utils/storage';

const CourseView = ({ lessonId, onBack }) => {
  const [phase, setPhase] = useState('theory'); // 'theory' | 'quiz' | 'completed'
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Quiz specific states
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // Reset state when lesson changes
  useEffect(() => {
    setPhase('theory');
    setCurrentIndex(0);
    setSelectedOption(null);
    setShowFeedback(false);
    setQuizScore(0);
  }, [lessonId]);

  const course = COURSES.find(c => c.id === lessonId);
  
  if (!course) {
    return <div>找不到课程内容。</div>;
  }

  // --- Theory Handling ---
  const handleNextTheory = () => {
    if (currentIndex < course.theory.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Transition to quiz phase
      if (course.quizPool && course.quizPool.length > 0) {
        setPhase('quiz');
        setCurrentIndex(0);
      } else {
        setPhase('completed');
      }
    }
  };

  // --- Quiz Handling ---
  const handleOptionClick = (index) => {
    if (showFeedback) return; // Prevent changing after answered
    setSelectedOption(index);
    setShowFeedback(true);
    
    const quiz = course.quizPool[currentIndex];
    const isCorrect = quiz.options[index].isCorrect;

    if (isCorrect) {
      setQuizScore(prev => prev + 1);
      addScore(1); // Save globally
    } else {
      addMistake(quiz); // Save mistake
    }
  };

  const handleNextQuiz = () => {
    if (currentIndex < course.quizPool.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setShowFeedback(false);
    } else {
      setPhase('completed');
    }
  };

  // --- Rendering Helpers ---
  const renderTheory = () => {
    const theory = course.theory[currentIndex];
    const progress = (currentIndex / course.theory.length) * 100;
    
    return (
      <>
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        </div>
        <div style={{ textAlign: 'right', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          理论学习：{currentIndex + 1} / {course.theory.length}
        </div>

        <div className="glass-card" style={{ marginTop: '2rem' }}>
          <h2 style={{ color: 'var(--accent-color)' }}>{theory.title}</h2>
          <p style={{ whiteSpace: 'pre-line', fontSize: '1.2rem', margin: '2rem 0' }}>{theory.content}</p>
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <button className="btn btn-primary" onClick={handleNextTheory}>
              {currentIndex === course.theory.length - 1 ? '进入实战测验' : '继续阅读'}
            </button>
          </div>
        </div>
      </>
    );
  };

  const renderQuiz = () => {
    const quiz = course.quizPool[currentIndex];
    const progress = (currentIndex / course.quizPool.length) * 100;

    return (
      <>
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${progress}%`, background: 'linear-gradient(to right, #f59e0b, #ef4444)' }}></div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          <span>当前得分: {quizScore}</span>
          <span>闯关题库：{currentIndex + 1} / {course.quizPool.length}</span>
        </div>

        <div className="glass-card" style={{ marginTop: '2rem' }}>
          <h2 style={{ color: '#f8fafc' }}>{quiz.title}</h2>
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
                {quiz.options[selectedOption].feedback}
              </div>
            )}

            {showFeedback && (
              <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <button className="btn btn-primary" onClick={handleNextQuiz}>
                  {currentIndex === course.quizPool.length - 1 ? '查看成绩' : '下一题'}
                </button>
              </div>
            )}
          </div>
        </div>
      </>
    );
  };

  const renderCompleted = () => {
    return (
      <div className="glass-card animate-fade-in" style={{ marginTop: '2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
        <h2 style={{ color: 'var(--secondary-color)' }}>章节完成！</h2>
        <p style={{ fontSize: '1.2rem', margin: '1rem 0' }}>
          你在本章的测试中答对了 <strong>{quizScore}</strong> / {course.quizPool.length} 道题。
        </p>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          答错的题目已被加入错题本，记得复习哦！
        </p>
        <button className="btn btn-primary" onClick={onBack}>
          返回课程目录
        </button>
      </div>
    );
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem', gap: '1rem' }}>
        <button className="btn btn-outline" onClick={onBack}>
          ← 返回目录
        </button>
        <h2 style={{ margin: 0, fontSize: '1.5rem' }}>{course.title}</h2>
      </div>

      {phase === 'theory' && renderTheory()}
      {phase === 'quiz' && renderQuiz()}
      {phase === 'completed' && renderCompleted()}

    </div>
  );
};

export default CourseView;
