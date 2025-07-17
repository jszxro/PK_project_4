import React, { useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import axios from 'axios';
import styles from '../assets/css/LoginModal.module.css';
import SignupModal from './SignupModal';
import ErrorPopup from './ErrorPopup'; // ✅ 상단 import
import FindIdModal from './FindIdModal';
import FindPwModal from './FindPwModal';


function LoginModal({ onClose, setIsLoggedIn }) {
  const [showSignup, setShowSignup] = useState(false);
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showFindId, setShowFindId] = useState(false);
  const [showFindPw, setShowFindPw] = useState(false);
  const { setUserInfo } = useContext(UserContext);

  
  const handleLogin = async () => {
    if (!id || !password) {
      setErrorMsg('아이디와 비밀번호를 입력하세요.');
      setShowErrorPopup(true);
      return;
    }

    try {
      // 1. 로그인 요청
      const response = await axios.post('/api/signin', {
        userId: id,
        userPw: password
      }, { withCredentials: true });

      console.log('로그인 성공:', response.data);

      // 2. 로그인 성공 후 사용자 정보 가져오기
      const userInfoResponse = await axios.get('/api/user-info', {
        withCredentials: true
      });

      // 3. Context에 유저 정보 저장
      setUserInfo(userInfoResponse.data);
      setIsLoggedIn(true);
      // 4. 모달 닫기
      onClose();


    } catch (error) {
      // 어떤 오류든 무조건 아래 메시지로
      setErrorMsg('아이디 또는 비밀번호가 틀렸습니다❗');
      setShowErrorPopup(true);
    }
  };

  return (
    <>
      {/* 로그인 모달 */}
      <div className={styles.modalOverlay} onClick={onClose}>
        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <h2 className={styles.modalTitle}>Moodlog</h2>
          <input
            type="text"
            placeholder="아이디"
            className={styles.modalInput}
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
          <input
            type="password"
            placeholder="비밀번호"
            className={styles.modalInput}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className={styles.modalOptions}>
            <span onClick={() => setShowSignup(true)}>회원가입</span>
            <div>
              <span onClick={() => setShowFindId(true)}>아이디 찾기</span>
              <span onClick={() => setShowFindPw(true)}>비밀번호 찾기</span>
            </div>
          </div>
          {showErrorPopup && (
            <ErrorPopup
              message={errorMsg}
              onClose={() => setShowErrorPopup(false)}
            />
          )}
          <button className={styles.modalLoginBtn} onClick={handleLogin}>
            LOGIN
          </button>
        </div>
      </div>

      {/* 회원가입 모달 */}
      {showSignup && <SignupModal onClose={() => setShowSignup(false)} onSwitchToLogin={() => setShowSignup(false)} />}
      {showFindId && <FindIdModal onClose={() => setShowFindId(false)} />}
      {showFindPw && <FindPwModal onClose={() => setShowFindPw(false)} />}
    </>
  );
}

export default LoginModal;