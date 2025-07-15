import React from 'react';
import styles from '../assets/css/LoginModal.module.css';

function SignupModal({ onClose }) {
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.modalTitle}>회원가입</h2>

        <input type="text" placeholder="아이디" className={styles.modalInput} />
        <input type="password" placeholder="비밀번호" className={styles.modalInput} />
        <input type="password" placeholder="비밀번호 확인" className={styles.modalInput} />

        <button className={styles.modalLoginBtn} onClick={onClose}>
          가입하기
        </button>
      </div>
    </div>
  );
}

export default SignupModal;


