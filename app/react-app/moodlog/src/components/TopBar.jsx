import { useContext, useEffect, useRef, useState } from 'react';
import '../assets/css/TopBar.css';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

function TopBar({ onLoginClick }) {
  const { userInfo, logout } = useContext(UserContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

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
    <div className="top-bar">
      {userInfo ? (
        <div className="profile-area" ref={dropdownRef}>
          <div className="profile-circle" onClick={toggleDropdown}>
            {userInfo.profile ?
              <img src={userInfo.profile} alt="프로필" /> : userInfo.nickname[0] || 'U'
            }
          </div>

          {dropdownOpen && (
            <div className="dropdown-menu">
              <div className="dropdown-item" onClick={() => {
                navigate('/archive');         // ✅ 마이페이지
                setDropdownOpen(false);
              }}>
                마이페이지
              </div>
              <div className="dropdown-item" onClick={() => {
                navigate('/modifyprofile');         // ✅ 마이페이지
                setDropdownOpen(false);
              }}>
                프로필수정
              </div>
              <div className="dropdown-item" onClick={handleLogout}>
                로그아웃
              </div>
            </div>
          )}
        </div>
      ) : (
        <button className="login-btn" onClick={onLoginClick}>
          로그인
        </button>
      )}
    </div>
  );
}

export default TopBar;
