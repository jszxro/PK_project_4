// src/components/FindIdModal.jsx
import React, { useState } from 'react';
import styles from '../assets/css/LoginModal.module.css';

function FindIdModal({ onClose }) {
  const [email, setEmail] = useState('');
  const [foundId, setFoundId] = useState('');

  const handleFindId = async () => {
    // 예시 API 요청
    // 실제로는 백엔드에서 이메일로 아이디를 조회
    if (email === 'test@example.com') {
      setFoundId('haribo123'); // 예시 아이디
    } else {
      setFoundId('해당 이메일로 가입된 아이디가 없습니다.');
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.modalTitle}>아이디 찾기</h2>
        <input
          type="email"
          placeholder="가입 시 이메일 입력"
          className={styles.modalInput}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className={styles.modalLoginBtn} onClick={handleFindId}>
          아이디 찾기
        </button>
        {foundId && <p style={{ marginTop: '10px' }}>{foundId}</p>}
      </div>
    </div>
  );
}

export default FindIdModal;
