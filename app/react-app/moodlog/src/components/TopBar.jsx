import { useContext, useState, useRef, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import '../assets/css/TopBar.css';
import { useNavigate } from 'react-router-dom';

function TopBar({ onLoginClick }) {
  const { userInfo, logout } = useContext(UserContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleMenuClick = (path) => {
    navigate(path);
    setDropdownOpen(false);
  };

  return (
    <div className="top-bar">
      {userInfo ? (
        <div className="profile-area" ref={dropdownRef}>
          <div className="profile-circle" onClick={toggleDropdown}>
            {userInfo.nickname[0]}
          </div>
          {dropdownOpen && (
            <div className="dropdown-menu">
              <div onClick={() => handleMenuClick('/my-page')}>내 채널</div>
              <div onClick={() => handleMenuClick('/settings')}>설정</div>
              <div onClick={logout}>로그아웃</div>
            </div>
          )}
        </div>
      ) : (
        <button className="login-btn" onClick={onLoginClick}>로그인</button>
      )}
    </div>
  );
}

export default TopBar;
