// src/pages/DiaryPage.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import LoginModal from '../components/LoginModal';

const DiaryPage = () => {
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
          <li onClick={() => navigate('/playlist')} className={location.pathname === '/playlist' ? 'active' : ''}>Playlist</li>
          <li onClick={() => navigate('/moments')} className={location.pathname === '/moments' ? 'active' : ''}>Moments</li>
          <li onClick={() => navigate('/archive')} className={location.pathname === '/archive' ? 'active' : ''}>Archive</li>
          <li onClick={() => navigate('/diary')} className={location.pathname === '/diary' ? 'active' : ''}>Diary</li>
        </ul>
      </div>

      {/* 중앙 + 우측 전체 wrapper */}
      <div className="main-wrapper" style={{ display: 'flex', flex: 1 }}>
      {/* 중앙 콘텐츠 영역 (ArchivePage의 playlist-main에 해당) */}
      <div className="playlist-main">
        <h2>Diary</h2>
        <div>날짜 : 2025-07-15 </div>
        <hr />
        <div className='diary-emoji'>
          <span>이모지 선택:</span>
          <span>😊😒🤣😁😎🙄😣😮😴</span>
        </div>
        <div className='diary-contents'>
          <div className='diary-title'>일기 제목</div>
          <div className='diary-img'>일기 이미지</div>
          <div className='diary-content'>일기 내용</div>
        </div>
      </div>

      {/* 우측 패널 (ArchivePage와 동일) */}
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
      </div>
    </div>


      {/* 로그인 모달 */}
      {showModal && <LoginModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default DiaryPage;
