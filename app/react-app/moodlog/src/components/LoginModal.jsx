import React, { useState } from 'react';
import styles from '../assets/css/LoginModal.module.css';
import SignupModal from './SignupModal';
import ErrorPopup from './ErrorPopup'; // ✅ 상단 import


function LoginModal({ onClose }) {
  const [showSignup, setShowSignup] = useState(false);
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = () => {
    if (!id || !password) {
      setErrorMsg('아이디와 비밀번호를 입력하세요.');
      setShowErrorPopup(true);
      return;
    }
    console.log('로그인 시도:', id, password);
    onClose(); // 로그인 성공 시 닫기
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

