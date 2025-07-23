// src/components/FindPwModal.jsx
import React, { useState } from 'react';
import axios from 'axios';
import styles from '../assets/css/LoginModal.module.css';

function FindPwModal({ onClose }) {
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');

  const handleFindPw = async () => {
    try {
      const res = await axios.post('/api/auth/find-password', {
        userId,
        email
      });

      if (res.status === 200) {
        alert(`임시 비밀번호: ${res.data.tempPassword}`);
      }
    } catch (err) {
      if (err.response && err.response.data) {
        alert(err.response.data);
      } else {
        alert("비밀번호 찾기 실패");
      }
      console.error("에러:", err);
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
      </div>
    </div>
  );
}

export default FindPwModal;
