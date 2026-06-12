import React from 'react';

const FinancialIQView = ({ onSelectLearn, onSelectGame, onBack }) => {
  return (
    <div className="animate-fade-in" style={{ padding: '2rem 1rem', maxWidth: '900px', margin: '0 auto' }}>
      <button className="btn btn-outline" onClick={onBack} style={{ marginBottom: '2rem' }}>
        ← 返回主分类
      </button>

      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--accent-color)' }}>
          财商 (FinIQ) 训练营
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
          通过理论武装头脑，通过实践检验真知。您想从哪里开始？
        </p>
      </div>

      <div className="grid-2">
        {/* 学习区域 */}
        <div 
          className="glass-card" 
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', cursor: 'pointer', padding: '3rem 2rem' }}
          onClick={onSelectLearn}
        >
          <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>📚</div>
          <h2 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>知识学习</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '2rem' }}>
            研读《富爸爸穷爸爸》全系列精华书籍，构建坚实的财务理论基础。
          </p>
          <button className="btn btn-outline" style={{ width: '80%', marginTop: 'auto', borderColor: 'var(--text-primary)', color: 'var(--text-primary)' }}>
            开始阅读
          </button>
        </div>

        {/* 游戏区域 */}
        <div 
          className="glass-card" 
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', cursor: 'pointer', padding: '3rem 2rem', border: '2px solid #10b981' }}
          onClick={onSelectGame}
        >
          <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>🎲</div>
          <h2 style={{ fontSize: '2rem', color: '#10b981', marginBottom: '1rem' }}>沙盘模拟</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '2rem' }}>
            进入硬核真实的《现金流》模拟器，亲自动手实操，尝试跳出老鼠赛跑。
          </p>
          <button className="btn btn-primary" style={{ width: '80%', marginTop: 'auto', backgroundColor: '#10b981' }}>
            开始游戏
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinancialIQView;
