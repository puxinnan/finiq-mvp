import React from 'react';

const HomeCategoryView = ({ onSelectCategory }) => {
  return (
    <div className="animate-fade-in" style={{ padding: '4rem 1rem', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 className="delay-100" style={{ fontSize: '3rem', letterSpacing: '-0.04em', marginBottom: '1rem' }}>
          欢迎来到成长中心
        </h1>
        <p className="delay-200" style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto' }}>
          选择一个领域，开启今天的提升之旅。保持极简，保持专注。
        </p>
      </div>

      <div className="grid-3 delay-300">
        {/* 心理学 */}
        <div 
          className="glass-card-no-hover" 
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', opacity: 0.6, cursor: 'not-allowed' }}
          onClick={() => alert("【心理学】模块正在筹备中，敬请期待！")}
        >
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🧠</div>
          <h2 style={{ marginBottom: '1rem' }}>心理学</h2>
          <p style={{ fontSize: '0.95rem' }}>洞察人性，认知自我，突破思维局限。</p>
          <div style={{ marginTop: 'auto', paddingTop: '1.5rem' }}>
            <span className="badge">敬请期待</span>
          </div>
        </div>

        {/* 财商 */}
        <div 
          className="glass-card" 
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', cursor: 'pointer', borderColor: 'var(--text-primary)' }}
          onClick={() => onSelectCategory('financial_iq')}
        >
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💸</div>
          <h2 style={{ marginBottom: '1rem' }}>财商 (FinIQ)</h2>
          <p style={{ fontSize: '0.95rem' }}>像富人一样思考，学习财务知识，打破老鼠赛跑。</p>
          <div style={{ marginTop: 'auto', paddingTop: '1.5rem', width: '100%' }}>
            <button className="btn btn-primary" style={{ width: '100%' }}>
              进入核心 →
            </button>
          </div>
        </div>

        {/* 个人成长 */}
        <div 
          className="glass-card-no-hover" 
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', opacity: 0.6, cursor: 'not-allowed' }}
          onClick={() => alert("【个人成长】模块正在筹备中，敬请期待！")}
        >
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌱</div>
          <h2 style={{ marginBottom: '1rem' }}>个人成长</h2>
          <p style={{ fontSize: '0.95rem' }}>习惯养成，时间管理，打造高效人生系统。</p>
          <div style={{ marginTop: 'auto', paddingTop: '1.5rem' }}>
            <span className="badge">敬请期待</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeCategoryView;
