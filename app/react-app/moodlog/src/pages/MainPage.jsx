import '../App.css';
import { useNavigate, useLocation } from 'react-router-dom';
import React, { useState, useContext, } from 'react';
import LoginModal from '../components/LoginModal';
import { UserContext } from '../context/UserContext';
import axios from 'axios';
function MainPage({ isLoggedIn, setIsLoggedIn }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const { userInfo, logout } = useContext(UserContext);

  return (
    <div className="layout">
      <div className="main">
        <div className="moment-mood-container">
          {/* 왼쪽: Moments */}
          <div className="main-left">
            <h3>Moments</h3>
            <div className="moment-card">
              <img src="" alt="video1" />
              <div>내용</div>
            </div>
            <div className="moment-card">
              <img src="" alt="video2" />
              <div>내용</div>
            </div>
          </div>

          {/* 오른쪽: Mood Picks */}
          <div className="main-right">
            <h3>{isLoggedIn ? '나만의 Mood Picks' : 'Mood Picks'}</h3>
            <div className="empty-block" />
          </div>
        </div>
      </div>

      {showModal && (
        <LoginModal
          onClose={() => setShowModal(false)}
          setIsLoggedIn={setIsLoggedIn}
        />
      )}
    </div>
  );
}
//테스트
export default MainPage;
