import '../App.css';
import { useNavigate, useLocation  } from 'react-router-dom';
import React, { useState } from 'react'; 

function MainPage() {
    const navigate = useNavigate();
    const location = useLocation(); 
    const [showModal, setShowModal] = useState(false);
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

          <div className="main-right">
            <h3>Mood Picks</h3>
            <div className="empty-block">Mood Picks 내용</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainPage;


