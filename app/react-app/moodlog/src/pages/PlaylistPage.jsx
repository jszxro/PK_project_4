import '../App.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { useState } from 'react';
import LoginModal from '../components/LoginModal';

function PlaylistPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="layout">
      {/* 좌측 사이드바 */}
      <div className="sidebar">
        <h2 className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Moodlog</h2>
        <ul className="nav">
          <li onClick={() => navigate('/')} className={location.pathname === '/' ? 'active' : ''}>Home</li>
          <li className="active">Playlist</li>
          <li onClick={() => navigate('/archive')} className={location.pathname === '/archive' ? 'active' : ''}>Archive</li>
        </ul>
      </div>

      {/* 중앙 + 우측 wrapper 통합 */}
      <div className="main-wrapper" style={{ display: 'flex', flex: 1 }}>
        {/* 중앙 영역 */}
        <div className="playlist-main">
          <div className="tag-bar">
            <h3>Mood</h3>
            <div className="tags">
              <button className="tag-btn"># Happy</button>
              <button className="tag-btn"># Sad</button>
              <button className="tag-btn"># Comfort</button>
              <button className="tag-btn"># Alone</button>
              <button className="tag-btn"># Focus</button>
            </div>
          </div>

          <div className="moments-section">
            <h3>Moments</h3>
            <div className="moment-card">[영상1]</div>
            <div className="moment-card">[영상2]</div>
            <div className="moment-card">[영상3]</div>
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
              <button className="search-btn">
                <FaSearch />
              </button>
            </div>
            <button className="login-btn" onClick={() => setShowModal(true)}>로그인</button>
            <div className="profile">👤</div>
          </div>

          <h3>추천 Playlist</h3>
          <div className="playlist-card">[추천1]</div>
          <div className="playlist-card">[추천2]</div>
          <div className="playlist-card">[추천3]</div>
        </div>
      </div>

      {/* 로그인 모달 */}
      {showModal && <LoginModal onClose={() => setShowModal(false)} />}
    </div>
  );
}

export default PlaylistPage;
