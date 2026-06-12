import React, { useState, useEffect } from 'react';
import { getTotalScore } from '../utils/storage';

const MOCK_LEADERBOARD = [
  { rank: 1, name: '巴菲特门徒', score: 280, isMe: false },
  { rank: 2, name: '现金流小王子', score: 215, isMe: false },
  { rank: 3, name: '投资达人老王', score: 190, isMe: false },
  { rank: 4, name: '自由之路', score: 150, isMe: false },
  { rank: 5, name: '财务小白', score: 20, isMe: false }
];

const Leaderboard = ({ onBack }) => {
  const [board, setBoard] = useState([]);

  useEffect(() => {
    const myScore = getTotalScore();
    const me = { rank: 0, name: '我 (FinIQer)', score: myScore, isMe: true };
    
    let combined = [...MOCK_LEADERBOARD, me];
    combined.sort((a, b) => b.score - a.score);
    
    // Assign ranks
    combined = combined.map((user, index) => ({ ...user, rank: index + 1 }));
    setBoard(combined);
  }, []);

  return (
    <div className="animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <button className="btn btn-outline" style={{ marginBottom: '2rem' }} onClick={onBack}>
        ← 返回主页
      </button>

      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <span style={{ fontSize: '4rem' }}>🏆</span>
        <h2 style={{ marginTop: '1rem', color: 'var(--accent-color)' }}>全球财富排行榜</h2>
        <p>你的财商击败了多少人？</p>
      </div>

      <div className="glass-card" style={{ padding: '1rem 2rem' }}>
        {board.map((user) => (
          <div 
            key={user.name} 
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '1rem 0',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              backgroundColor: user.isMe ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
              borderRadius: user.isMe ? '8px' : '0'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ 
                fontSize: '1.2rem', 
                fontWeight: 'bold', 
                color: user.rank <= 3 ? 'var(--accent-color)' : 'var(--text-secondary)' 
              }}>
                #{user.rank}
              </span>
              <span style={{ fontSize: '1.1rem', fontWeight: user.isMe ? 'bold' : 'normal', color: user.isMe ? 'var(--secondary-color)' : 'var(--text-primary)' }}>
                {user.name}
              </span>
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
              {user.score} 分
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
