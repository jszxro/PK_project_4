import { useContext, useState } from 'react';
import '../assets/css/TopBar.css';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

function TopBar({ onLoginClick }) {
  const { userInfo, logout } = useContext(UserContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();             // 사용자 정보 초기화
    setDropdownOpen(false);
    navigate('/');        // 홈으로 이동
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="top-bar">
      {userInfo ? (
        <div className="profile-area">
          <div className="profile-circle" onClick={toggleDropdown}>
            {userInfo.nickname[0] || 'U'}
          </div>

          {dropdownOpen && (
            <div className="dropdown-menu">
              <div className="dropdown-item" onClick={() => {
                navigate('/mypage');
                setDropdownOpen(false);
              }}>
                내 채널
              </div>
              <div className="dropdown-item" onClick={handleLogout}>
                로그아웃
              </div>
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
