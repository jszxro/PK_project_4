// src/components/Layout.jsx
import { useState } from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import '../assets/css/Layout.css'; // 공통 스타일 분리 추천
import TopBar from './TopBar';
import LoginModal from '../components/LoginModal';


function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
    // ✅ 여기에서 조건 정의
  const hideTopBarRoutes = ['/diary','/archive']; //탑바숨기고 싶은 경로
  const hideTopBar = hideTopBarRoutes.includes(location.pathname); 


  return (
    <div className="app-layout">
      {/* 좌측 사이드바 */}
      <div className="sidebar">
        <h2 className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Moodlog</h2>
        <p className="subtitle">당신의 감정을 이해하는 첫 번째 플레이리스트</p>
        <ul className="nav">
          <li onClick={() => navigate('/')} className={location.pathname === '/' ? 'active' : ''}>Home</li>
          <li className={location.pathname === '/playlist' ? 'active' : ''} onClick={() => navigate('/playlist')}>Playlist</li>
          <li onClick={() => navigate('/moments')} className={location.pathname === '/moments' ? 'active' : ''}>Moments</li>
          <li onClick={() => navigate('/archive')} className={location.pathname === '/archive' ? 'active' : ''}>Archive</li>
          <li onClick={() => navigate('/diary')} className={location.pathname === '/diary' ? 'active' : ''}>Diary</li>
        </ul>
      </div>

      {/* 각 페이지 내용 */}
       <div className="page-content">
        {!hideTopBar && <TopBar onLoginClick={() => setShowModal(true)} />}
        {showModal && <LoginModal onClose={() => setShowModal(false)} />}
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
