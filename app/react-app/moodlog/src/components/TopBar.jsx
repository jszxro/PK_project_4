// src/components/TopBar.jsx
import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import '../assets/css/TopBar.css';

function TopBar({ onLoginClick }) {
  const [showModal, setShowModal] = useState(false);
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
      <button className="login-btn" onClick={onLoginClick}>로그인</button>
      <div className="profile">👤</div>
    </div>

  );
}

export default TopBar;
