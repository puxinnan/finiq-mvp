import React, { useState } from 'react';
import { login, register } from '../utils/storage';

const Login = ({ onLoginSuccess }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('用户名和密码不能为空');
      return;
    }

    if (isRegistering) {
      const success = register(username, password);
      if (success) {
        onLoginSuccess();
      } else {
        setError('该用户名已被注册');
      }
    } else {
      const success = login(username, password);
      if (success) {
        onLoginSuccess();
      } else {
        setError('用户名或密码错误');
      }
    }
  };

  return (
    <div className="app-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', padding: 0 }}>
      <div className="glass-card animate-fade-in" style={{ width: '400px', padding: '2rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--accent-color)' }}>
          🪙 FinIQ {isRegistering ? '注册账号' : '欢迎登录'}
        </h2>
        
        {error && <div style={{ color: 'var(--danger-color)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>用户名</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.2)',
                backgroundColor: 'rgba(0,0,0,0.2)',
                color: 'white',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              placeholder="请输入用户名"
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>密码</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.2)',
                backgroundColor: 'rgba(0,0,0,0.2)',
                color: 'white',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              placeholder="请输入密码"
            />
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', padding: '0.75rem' }}>
            {isRegistering ? '注册并登录' : '登 录'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            {isRegistering ? '已有账号？' : '还没有账号？'}
          </span>
          <button 
            type="button"
            className="btn btn-outline" 
            style={{ padding: '0.2rem 0.5rem', marginLeft: '0.5rem', border: 'none', color: 'var(--secondary-color)' }}
            onClick={() => { setIsRegistering(!isRegistering); setError(''); }}
          >
            {isRegistering ? '去登录' : '去注册'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
