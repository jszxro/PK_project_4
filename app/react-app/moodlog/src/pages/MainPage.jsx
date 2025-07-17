import '../App.css';
import { useNavigate, useLocation  } from 'react-router-dom';
import React, { useState } from 'react'; 

function MainPage() {
    const navigate = useNavigate();
    const location = useLocation(); 
    const [showModal, setShowModal] = useState(false);
  return (
    <div className="layout">
      {/* 중앙 영역 */}
      <div className="main">
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

      {/* 우측 패널 */}
      <div className="right-panel">
        <h3>Mood Picks</h3>
        <div className="empty-block" />
      </div>
    </div>
  );
}

export default MainPage;


