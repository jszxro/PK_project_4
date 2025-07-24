// src/components/FindIdModal.jsx
import React, { useState } from 'react';
import styles from '../assets/css/LoginModal.module.css';
import axios from 'axios';

function FindIdModal({ onClose }) {
  const [email, setEmail] = useState('');
  const [foundId, setFoundId] = useState('');

  const handleFindId = async () => {
    try {
      const res = await axios.post('/api/auth/find-id', { email });  // 백엔드 API 호출
      setFoundId(`당신의 아이디는: ${res.data.userId}`);  // 응답 받은 아이디
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setFoundId('해당 이메일로 가입된 아이디가 없습니다.');
      } else {
        setFoundId('서버 오류가 발생했습니다.');
      }
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
