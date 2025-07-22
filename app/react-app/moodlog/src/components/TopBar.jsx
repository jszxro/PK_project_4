import { useState, useContext } from 'react';
import { FaSearch } from 'react-icons/fa';
import '../assets/css/TopBar.css';
import { UserContext } from '../context/UserContext';

function TopBar({ onLoginClick }) {
  const [keyword, setKeyword] = useState('');
  const { userInfo, logout } = useContext(UserContext);

  const handleSearch = () => {
    if (!keyword.trim()) return;
    console.log('🔍 검색어:', keyword);
    // 여기에 검색 로직 추가 (예: navigate(`/search?query=${keyword}`) 등)
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="top-bar">
      {userInfo ? (
        <>
          <div className="profile">{userInfo.nickname}님</div>
          
        </>
      ) : (
        <button className="login-btn" onClick={onLoginClick}>로그인</button>
      )}
    </div>
  );
}

export default TopBar;
