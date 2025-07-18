import '../App.css';
import { useNavigate, useLocation  } from 'react-router-dom';
// import { FaSearch } from 'react-icons/fa';
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
        </div>

        <h3>{isLoggedIn ? '나만의 Mood Picks' : 'Mood Picks'}</h3>
        <div className="empty-block" />
      </div>
    
    {showModal && <LoginModal onClose={() => setShowModal(false)} setIsLoggedIn={setIsLoggedIn} />}
    </div>
  );
}
//0718
export default MainPage;


