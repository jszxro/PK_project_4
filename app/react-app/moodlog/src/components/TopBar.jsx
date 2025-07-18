// src/components/TopBar.jsx
import { useState, useContext } from 'react';
import { FaSearch } from 'react-icons/fa';
import '../assets/css/TopBar.css';
import { UserContext } from '../context/UserContext';

function TopBar({ onLoginClick }) {
  const [showModal, setShowModal] = useState(false);
  const { userInfo, logout } = useContext(UserContext);


  return (
    <div className="top-bar">
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="제목을 입력하세요"
        />
        <button className="search-btn"><FaSearch /></button>
      </div>
      {userInfo ? (
        <>
          <div className="profile">{userInfo.nickname}님</div>
          <button onClick={logout} className="login-btn">로그아웃</button>
        </>
      ) : (
        <button className="login-btn" onClick={onLoginClick}>로그인</button>
      )}
    </div>

  );
}

export default TopBar;
