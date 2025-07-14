import '../App.css';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import styles from '../assets/css/WritePost.module.css'; // 중앙 글쓰기 폼 스타일
import LoginModal from '../components/LoginModal';

const WritePost = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('제목:', title);
    console.log('내용:', content);
    alert('글이 등록되었습니다!');
    navigate('/');
  };

  return (
    <div className="layout">
      {/* 좌측 패널 */}
      <div className="sidebar">
        <h2 className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Moodlog</h2>
        <ul className="nav">
          <li className={location.pathname === '/' ? 'active' : ''} onClick={() => navigate('/')}>Home</li>
          <li className={location.pathname === '/playlist' ? 'active' : ''} onClick={() => navigate('/playlist')}>Playlist</li>
          <li className={location.pathname === '/archive' ? 'active' : ''} onClick={() => navigate('/archive')}>Archive</li>
          <li className="active">Post</li>
        </ul>
      </div>

      {/* 중앙 + 우측 패널 wrapper */}
      <div className="main-wrapper" style={{ display: 'flex', flex: 1 }}>
        {/* 중앙 글쓰기 폼 */}
        <div className="write-main" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '60px' }}>
          <div className={styles.container}>
            <div className={styles.contentWrapper}>
              <input
                type="text"
                placeholder="제목을 입력하세요"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className={styles.title}
              />

              <textarea
                placeholder="내용을 입력하세요"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                className={styles.textarea}
              />

              <button onClick={handleSubmit} className={styles.button}>
                등록하기
              </button>
            </div>
          </div>
        </div>

        {/* 우측 패널 */}
        <div className="right-panel">
          <div className="top-bar">
            <div className="search-container">
              <input
                type="text"
                className="search-input"
                placeholder="제목을 입력하세요"
              />
              <button className="search-btn"><FaSearch /></button>
            </div>
            <button className="login-btn" onClick={() => setShowModal(true)}>로그인</button>
            <div className="profile">👤</div>
          </div>
        </div>
      </div>

      {/* 로그인 모달 */}
      {showModal && <LoginModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default WritePost;
