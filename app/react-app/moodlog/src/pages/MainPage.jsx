import '../App.css';
import { useNavigate, useLocation  } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import React, { useState } from 'react'; // ✔ 상태 관리를 위해 필요
import LoginModal from '../components/LoginModal'; // ✔ 모달 컴포넌트 가져오기



function MainPage({ isLoggedIn, setIsLoggedIn }) {
    const navigate = useNavigate();
    const location = useLocation(); // ✅ 현재 경로 확인용
    const [showModal, setShowModal] = useState(false);
    const handleLogout = () => {setIsLoggedIn(false);};
  return (
    <div className="layout">
      {/* 좌측 사이드바 */}
      <div className="sidebar">
        <h2 className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Moodlog</h2>
        <p className="subtitle">당신의 감정을 이해하는 첫 번째 플레이리스트</p>
        <ul className="nav">
          <li onClick={() => navigate('/')} className={location.pathname === '/' ? 'active' : ''} style={{ cursor: 'pointer' }}>Home</li>
          <li onClick={() => navigate('/playlist')} className={location.pathname === '/playlist' ? 'active' : ''} style={{ cursor: 'pointer' }}>Playlist</li>
          <li onClick={() => navigate('/moments')} className={location.pathname === '/moments' ? 'active' : ''}>Moments</li>
          {/* <li onClick={() => navigate('/archive')} style={{ cursor: 'pointer' }}>Archive</li>
          <li onClick={() => navigate('/diary')} className={location.pathname === '/diary' ? 'active' : ''}>Diary</li> */}
          {isLoggedIn && (
            <>
              <li onClick={() => navigate('/archive')} className={location.pathname === '/archive' ? 'active' : ''} style={{ cursor: 'pointer' }}>Archive</li>
              <li onClick={() => navigate('/diary')} className={location.pathname === '/diary' ? 'active' : ''} style={{ cursor: 'pointer' }}>Diary</li>
            </>
          )}
        </ul>
      </div>

      {/* 중앙 영역 */}
      <div className="main">
        <h3>Moments</h3>
        <div className="moment-card">
          <img src="" alt="video1" />
          <div></div>
        </div>
        <div className="moment-card">
          <img src="" alt="video2" />
          <div></div>
        </div>
      </div>

      {/* 우측 패널 */}
      <div className="right-panel">
        <div className="top-bar">
          {/* ✅ 검색바 전체 래퍼 */}
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
            {/* ✅ 로그인 버튼 추가 */}
            {isLoggedIn ? (
              <>
                <button className="logout-btn" onClick={handleLogout}>로그아웃</button>
                <div className="profile">😊 사용자님 환영해요!</div>
              </>
            ) : (
              <>
                <button className="login-btn" onClick={() => {setShowModal(true)}}>로그인</button>
                <div className="profile">👤</div>
              </>
            )}
        </div>

        <h3>{isLoggedIn ? '나만의 Mood Picks' : 'Mood Picks'}</h3>
        <div className="empty-block" />
      </div>
    
    {showModal && <LoginModal onClose={() => setShowModal(false)} setIsLoggedIn={setIsLoggedIn} />}
    </div>
  );
}

export default MainPage;


