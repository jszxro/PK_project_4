import '../App.css';
import { useNavigate, useLocation  } from 'react-router-dom';
import React, { useState } from 'react'; 
import { useNavigate, useLocation } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import React, { useEffect, useState, useContext } from 'react'; // ✔ 상태 관리를 위해 필요
import LoginModal from '../components/LoginModal'; // ✔ 모달 컴포넌트 가져오기
import { UserContext } from '../context/UserContext';




function MainPage({ isLoggedIn, setIsLoggedIn }) {
    const navigate = useNavigate();
    const location = useLocation(); 
    const [showModal, setShowModal] = useState(false);
    const handleLogout = () => {setIsLoggedIn(false);};
    const { userInfo, logout } = useContext(UserContext);

  return (
    <div className="layout">
      <div className="main">
        <div className="moment-mood-container">
          <div className="main-left">
            <h3>Moments</h3>
            <div className="moment-card">
              <img src="" alt="video1" />
              <div></div>
            </div>
            <div className="moment-card">
              <img src="" alt="video2" />
              <div></div>
            </div>
          </div>

          {/* ✅ 로그인 버튼 추가 */}
          {userInfo ? (
            <>
              <div className="profile">{userInfo.nickname}님</div>
              <button onClick={logout} className="login-btn">로그아웃</button>
            </>
          ) : (
            <button className="login-btn" onClick={() => setShowModal(true)}>로그인</button>
          )}
          <div className="profile">👤</div>
        </div>

        <h3>{isLoggedIn ? '나만의 Mood Picks' : 'Mood Picks'}</h3>
        <div className="empty-block" />
      </div>
    
    {showModal && <LoginModal onClose={() => setShowModal(false)} setIsLoggedIn={setIsLoggedIn} />}
    </div>
  );
}

export default MainPage;


