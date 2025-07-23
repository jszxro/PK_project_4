import { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import '../assets/css/Layout.css';
import '../assets/css/TopBar.css';
import LoginModal from './LoginModal';
import { UserContext } from '../context/UserContext';

function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { userInfo, logout } = useContext(UserContext) || {};

  const hideTopBarRoutes = [];
  const hideTopBar = hideTopBarRoutes.includes(location.pathname);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  const toggleDropdown = () => {
    setDropdownOpen(prev => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <div className="app-layout">
      <div className="sidebar">
        <h2 className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Moodlog</h2>
        <p className="subtitle">당신의 감정을 이해하는 첫 번째 플레이리스트</p>

        <ul className="nav">
          <li onClick={() => navigate('/')} className={location.pathname === '/' ? 'active' : ''}>Home</li>
          <li onClick={() => navigate('/playlist')} className={location.pathname === '/playlist' ? 'active' : ''}>Playlist</li>
          <li onClick={() => navigate('/moments')} className={location.pathname === '/moments' ? 'active' : ''}>Moments</li>
          {userInfo ? (
            <>
              <li onClick={() => navigate('/archive')} className={location.pathname === '/archive' ? 'active' : ''}>Archive</li>
              {/* <li onClick={() => navigate('/diary')} className={location.pathname === '/diary' ? 'active' : ''}>Diary</li> */}
            </>
          ) : null}
        </ul>
      </div>

      <div className="page-content">
        <Outlet />
      </div>

      <div className="right-sidebar">
        {!hideTopBar && (
          <div className="top-bar">
            {userInfo ? (
              <div className="profile-area" ref={dropdownRef}>
                <div className="profile-circle" onClick={toggleDropdown}>
                  {userInfo.nickname?.[0] || 'U'}
                </div>

                {dropdownOpen && (
                  <div className="dropdown-menu">
                    <div className="dropdown-item" onClick={() => {
                      navigate('/archive');
                      setDropdownOpen(false);
                    }}>
                      마이페이지
                    </div>
                    <div className="dropdown-item" onClick={() => {
                      navigate('/');
                      setDropdownOpen(false);
                    }}>
                      홈
                    </div>
                    <div className="dropdown-item" onClick={() => {
                      navigate('/moments');
                      setDropdownOpen(false);
                    }}>
                      모멘트
                    </div>
                    <div className="dropdown-item" onClick={handleLogout}>
                      로그아웃
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button className="login-btn" onClick={() => setShowModal(true)}>로그인</button>
            )}
          </div>
        )}
        {showModal && <LoginModal onClose={() => setShowModal(false)} />}
      </div>
    </div>
  );
}

export default Layout;
