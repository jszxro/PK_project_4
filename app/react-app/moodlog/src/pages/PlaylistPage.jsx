import '../App.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { useState } from 'react';
import LoginModal from '../components/LoginModal';

function PlaylistPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const [selectedTag, setSelectedTag] = useState('Happy');

  const playlistData = {
    Happy: ['[Happy 추천곡 1]', '[Happy 추천곡 2]', '[Happy 추천곡 3]'],
    Sad: ['[Sad 추천곡 1]', '[Sad 추천곡 2]', '[Sad 추천곡 3]'],
    Comfort: ['[Comfort 추천곡 1]', '[Comfort 추천곡 2]', '[Comfort 추천곡 3]'],
    Alone: ['[Alone 추천곡 1]', '[Alone 추천곡 2]', '[Alone 추천곡 3]'],
    Focus: ['[Focus 추천곡 1]', '[Focus 추천곡 2]', '[Focus 추천곡 3]']
  };

  return (
    <div className="layout playlist-layout">
      <div className="sidebar">
        <h2 className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Moodlog</h2>
        <p className="subtitle">당신의 감정을 이해하는 첫 번째 플레이리스트</p>
        <ul className="nav">
          <li onClick={() => navigate('/')} className={location.pathname === '/' ? 'active' : ''}>Home</li>
          <li className="active">Playlist</li>
          <li onClick={() => navigate('/moments')} className={location.pathname === '/moments' ? 'active' : ''}>Moments</li>
          <li onClick={() => navigate('/archive')} className={location.pathname === '/archive' ? 'active' : ''}>Archive</li>
          <li onClick={() => navigate('/diary')} className={location.pathname === '/diary' ? 'active' : ''}>Diary</li>
        </ul>
      </div>

      <div className="main-content">
        <div className="top-bar">
          <div className="search-container">
            <input type="text" className="search-input" placeholder="제목을 입력하세요" />
            <button className="search-btn"><FaSearch /></button>
          </div>
          <button className="login-btn" onClick={() => setShowModal(true)}>로그인</button>
          <div className="profile">👤</div>
        </div>

        <h4 className="section-title"><span style={{ color: '#A8C3A8' }}>순간에 어울리는 노래</span> playlist</h4>
        <div className="mood-row">
          <div className="mood-card">
            <p className="mood-subtitle">혼자 조용히 있고 싶을 때</p>
            <p>→ '어떤 이의 편지' - 하현상<br />→ 'Afraid' - DAY6</p>
          </div>
          <div className="mood-card">
            <p className="mood-subtitle">햇살 좋은 날 산책하며</p>
            <p>→ 'Firefly' - N.Flying<br />→ '오늘' - 오왠</p>
          </div>
          <div className="mood-card">
            <p className="mood-subtitle">위로가 필요한 밤</p>
            <p>→ '동화' - 하현상<br />→ 'Lost' - 하현상</p>
          </div>
        </div>

        <div className="tag-container">
          <h4 className="section-title">오늘 기분에 어울리는 곡을 찾아드릴게요</h4>
          <div className="tags">
            {['Happy', 'Sad', 'Comfort', 'Alone', 'Focus'].map(tag => (
              <button
                key={tag}
                className={`tag-btn ${selectedTag === tag ? 'active' : ''}`}
                onClick={() => setSelectedTag(tag)}
              >
                # {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="playlist-area">
          {playlistData[selectedTag].map((text, idx) => (
            <div className="playlist-card" key={idx}>{text}</div>
          ))}
        </div>

        <h4 className="section-title user-recommend-title">“다른 사용자들이 이런 순간에 추천한 곡”</h4>
        <div className="user-recommend">
          <p>"지치고 힘들었던 날, 이 노래가 위로가 되었어요."<br />– 사용자: 라떼<br />→ 'Afraid' - DAY6</p>
          <p>"햇살 찬란한 오후, 이 노래 들으며 웃었어요."<br />– 사용자: 응크<br />→ 'Firefly' - N.Flying</p>
        </div>
      </div>

      {showModal && <LoginModal onClose={() => setShowModal(false)} />}
    </div>
  );
}

export default PlaylistPage;