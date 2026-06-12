import React from 'react';
import { COURSES } from '../data/courses';

const LandingPage = ({ onStart }) => {
  return (
    <div className="animate-fade-in">
      <div style={{ textAlign: 'center', marginBottom: '4rem', marginTop: '2rem' }}>
        <span className="badge">《富爸爸穷爸爸》全书知识库</span>
        <h1 className="delay-100">像富人一样思考</h1>
        <p className="delay-200" style={{ maxWidth: '600px', margin: '0 auto 2rem auto' }}>
          绝大多数人为了钱工作，而富人让钱为他们工作。每天 5 分钟，通过互动测验建立你的财务智商 (FinIQ)。
        </p>
      </div>

      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>选择你要学习的章节</h2>
      
      <div className="grid-2 delay-300">
        {COURSES.map((course, index) => (
          <div key={course.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{course.icon}</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
              {course.title}
            </h3>
            <p style={{ flex: 1 }}>{course.description}</p>
            <button 
              className="btn btn-outline" 
              style={{ width: '100%', marginTop: '1rem' }}
              onClick={() => onStart(course.id)}
            >
              开始学习
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LandingPage;
