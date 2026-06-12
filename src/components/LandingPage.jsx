import React, { useState } from 'react';
import { COURSES } from '../data/courses';

const LandingPage = ({ onStart }) => {
  const [selectedBook, setSelectedBook] = useState(null);

  // 书籍列表数据
  const books = [
    { 
      id: 'money-dog', 
      title: '《小狗钱钱》', 
      description: '适合所有人的财富启蒙童话，教你建立梦想相册与成功日记，迈出理财第一步。', 
      icon: '🐶' 
    },
    { 
      id: 'rich-dad', 
      title: '《富爸爸穷爸爸》', 
      description: '颠覆传统金钱观念的启蒙经典，带你区分真正的资产与负债，跳出老鼠赛跑。', 
      icon: '👔' 
    }
  ];

  // 如果没有选择书籍，显示书籍列表
  if (!selectedBook) {
    return (
      <div className="animate-fade-in">
        <div style={{ textAlign: 'center', marginBottom: '4rem', marginTop: '2rem' }}>
          <span className="badge">经典财商书籍知识库</span>
          <h1 className="delay-100">选择您要学习的书籍</h1>
          <p className="delay-200" style={{ maxWidth: '600px', margin: '0 auto 2rem auto' }}>
            每天 5 分钟，通过互动测验建立你的财务智商 (FinIQ)。
          </p>
        </div>

        <div className="grid-3 delay-300">
          {books.map(book => (
            <div 
              key={book.id} 
              className="glass-card" 
              style={{ display: 'flex', flexDirection: 'column', cursor: 'pointer' }}
              onClick={() => setSelectedBook(book.id)}
            >
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{book.icon}</div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
                {book.title}
              </h3>
              <p style={{ flex: 1 }}>{book.description}</p>
              <button className="btn btn-outline" style={{ width: '100%', marginTop: '1rem' }}>
                进入学习 →
              </button>
            </div>
          ))}

          {/* 敬请期待卡片 */}
          <div 
            className="glass-card-no-hover" 
            style={{ display: 'flex', flexDirection: 'column', opacity: 0.6, cursor: 'not-allowed' }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
              更多书籍有待加入
            </h3>
            <p style={{ flex: 1 }}>《巴比伦最富有的人》、《穷查理宝典》等经典著作正在筹备中。</p>
            <div style={{ marginTop: 'auto', paddingTop: '1.5rem', textAlign: 'center' }}>
              <span className="badge">敬请期待</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 根据选中的书籍过滤课程章节
  const displayCourses = COURSES.filter(course => {
    if (selectedBook === 'money-dog') return course.id.includes('money-dog');
    if (selectedBook === 'rich-dad') return !course.id.includes('money-dog');
    return true;
  });

  const bookInfo = books.find(b => b.id === selectedBook);

  // 显示该书的章节列表
  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <button className="btn btn-outline" onClick={() => setSelectedBook(null)}>
          ← 返回书架
        </button>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <span className="badge">{bookInfo.title}</span>
        <h1 className="delay-100">选择你要学习的章节</h1>
      </div>
      
      <div className="grid-2 delay-200">
        {displayCourses.map((course) => (
          <div key={course.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{course.icon}</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
              {course.title}
            </h3>
            <p style={{ flex: 1 }}>{course.description}</p>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button 
                className="btn btn-outline" 
                style={{ flex: 1 }}
                onClick={() => onStart(course.id, 'theory')}
              >
                📖 学习模式
              </button>
              <button 
                className="btn btn-primary" 
                style={{ flex: 1 }}
                onClick={() => onStart(course.id, 'quiz')}
              >
                📝 测试模式
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LandingPage;
