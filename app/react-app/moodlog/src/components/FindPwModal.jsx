// src/components/FindPwModal.jsx
import React, { useState } from 'react';
import styles from '../assets/css/LoginModal.module.css';

function FindPwModal({ onClose }) {
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [result, setResult] = useState('');

  const handleFindPw = async () => {
    // 예시 검증 로직
    if (userId === 'haribo123' && email === 'test@example.com') {
      setResult('등록된 이메일로 임시 비밀번호를 발송했습니다.');
    } else {
      setResult('입력한 정보가 일치하지 않습니다.');
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.modalTitle}>비밀번호 찾기</h2>
        <input
          type="text"
          placeholder="아이디"
          className={styles.modalInput}
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <input
          type="email"
          placeholder="가입 시 이메일"
          className={styles.modalInput}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className={styles.modalLoginBtn} onClick={handleFindPw}>
          비밀번호 찾기
        </button>
        {result && <p style={{ marginTop: '10px' }}>{result}</p>}
      </div>
    </div>
  );
}

export default FindPwModal;
