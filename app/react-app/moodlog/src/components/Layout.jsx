import { useState, useContext } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import '../assets/css/Layout.css';
import TopBar from './TopBar';
import LoginModal from './LoginModal';
import { UserContext } from '../context/UserContext';

function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);

  const { userInfo } = useContext(UserContext) || {};  // ✅ 여기를 안전하게

  const hideTopBarRoutes = [];
  const hideTopBar = hideTopBarRoutes.includes(location.pathname);

  return (
    <div className="app-layout">
      <div className="sidebar">
        <h2 className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Moodlog</h2>
        <p className="subtitle">당신의 감정을 이해하는 첫 번째 플레이리스트</p>

        <ul className="nav">
          <li onClick={() => navigate('/')} className={location.pathname === '/' ? 'active' : ''}>Home</li>
          <li onClick={() => navigate('/playlist')} className={location.pathname === '/playlist' ? 'active' : ''}>Playlist</li>
          <li onClick={() => navigate('/moments')} className={location.pathname === '/moments' ? 'active' : ''}>Moments</li>

          {/* 조건부 렌더링 - 안전하게 */}
          {userInfo ? (
            <>
              <li onClick={() => navigate('/archive')} className={location.pathname === '/archive' ? 'active' : ''}>Archive</li>
              <li onClick={() => navigate('/diary')} className={location.pathname === '/diary' ? 'active' : ''}>Diary</li>
            </>
          ) : null}
        </ul>
      </div>

      <div className="page-content">
        {!hideTopBar && <TopBar onLoginClick={() => setShowModal(true)} />}
        {showModal && <LoginModal onClose={() => setShowModal(false)} />}
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
