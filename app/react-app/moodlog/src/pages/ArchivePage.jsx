import '../App.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { useState } from 'react';
import LoginModal from '../components/LoginModal';
import CalendarBox from '../components/CalendarBox';
import DiaryModal from '../components/DiaryModal';



function ArchivePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null); // ✅ 추가
  const [showDiaryModal, setShowDiaryModal] = useState(false);

  return (
    <div className="layout">
      {/* 좌측 사이드바 */}
      <div className="sidebar">
        <h2 className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Moodlog</h2>
        <ul className="nav">
          <li onClick={() => navigate('/')} className={location.pathname === '/' ? 'active' : ''}>Home</li>
          <li onClick={() => navigate('/playlist')} className={location.pathname === '/playlist' ? 'active' : ''}>Playlist</li>
          <li className="active">Archive</li>
          <li onClick={() => navigate('/post')} className={location.pathname === '/post' ? 'active' : ''}>Post</li>
        </ul>
      </div>

      {/* 중앙 + 우측 전체 wrapper */}
      <div className="main-wrapper" style={{ display: 'flex', flex: 1 }}>
        {/* 중앙 콘텐츠 영역 */}
        <div className="playlist-main">
          <h3>Archive 페이지입니다.</h3>
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

          {/* Diary 칸 */}
          <div className="diary-section">
            <h3>Diary</h3>
            <div className="calendar-box">
              {/* <p>📅 July</p> */}
              {/* <div className="calendar-placeholder">여기에 달력 또는 이모지 들어감</div> */}
              <CalendarBox onDateClick={(date) => {
                setSelectedDate(date);
                setShowDiaryModal(true);
              }} />
            </div>
          </div>

          {/* My Posts 칸 */}
          <div className="myposts-section">
            <h3>My Posts</h3>
            <div className="post-card">
              <img
                src="https://via.placeholder.com/100x70?text=thumbnail"
                alt="썸네일"
                className="post-thumbnail"
              />
              <div className="post-info">
                <p className="post-title">같이 노래 들어요.</p>
                <p className="post-desc">밤이 늦...</p>
              </div>
            </div>
          </div>
        </div> {/* ← 이 줄이 빠져 있었음! */}
      </div>

      {/* 로그인 모달 */}
      {showModal && <LoginModal onClose={() => setShowModal(false)} />}

      {showDiaryModal && selectedDate && (
        <DiaryModal
          date={selectedDate}
          onClose={() => setShowDiaryModal(false)}
        />
      )}
    </div>
  );
}

export default ArchivePage;
