import React, { useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import axios from 'axios';
import styles from '../assets/css/LoginModal.module.css';
import SignupModal from './SignupModal';
import ErrorPopup from './ErrorPopup'; // ✅ 상단 import


function LoginModal({ onClose }) {
  const [showSignup, setShowSignup] = useState(false);
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
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

      // 4. 모달 닫기
      onClose();

    } catch (error) {
      const msg =
        error.response?.status === 401
          ? '아이디 또는 비밀번호가 틀렸습니다.'
          : '로그인 중 오류가 발생했습니다.';
      setErrorMsg(msg);
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
              <span>아이디 찾기</span>
              <span>비밀번호 찾기</span>
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
      {showSignup && <SignupModal onClose={() => setShowSignup(false)} />}
    </>
  );
}

export default LoginModal;