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
  const { userInfo } = useContext(UserContext) || {};

  const hideTopBarRoutes = [];
  const hideTopBar = hideTopBarRoutes.includes(location.pathname);

  return (
    <div className="app-container">
      <div className="sidebar">  {/*좌측*/}
        <h2 className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Moodlog</h2>
        <p className="subtitle">당신의 감정을 이해하는 첫 번째 플레이리스트</p>

        <ul className="nav">
          <li onClick={() => navigate('/')} className={location.pathname === '/' ? 'active' : ''}>Home</li>
          <li onClick={() => navigate('/moments')} className={location.pathname === '/moments' ? 'active' : ''}>Moments</li>

          {/* 조건부 렌더링 - 안전하게 */}
          {userInfo ? (
            <>
              <li onClick={() => navigate('/archive')} className={location.pathname === '/archive' ? 'active' : ''}>Archive</li>
            </>
          ) : null}
        </ul>
      </div>

      <div className="main-container">
        {/* 상단 고정 TopBar */}
        {!hideTopBar && <TopBar onLoginClick={() => setShowModal(true)} />}
        {showModal && <LoginModal onClose={() => setShowModal(false)} />}

        {/* 실제 콘텐츠 영역 (여백 포함) */}
        <div className="content-area">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Layout;
