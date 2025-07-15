import React from 'react';
import styles from '../assets/css/LoginModal.module.css';

function ErrorPopup({ message, onClose }) {
  return (
    <div className={styles.popupOverlay} onClick={onClose}>
      <div className={styles.popupBox} onClick={(e) => e.stopPropagation()}>
        <p>{message}</p>
        <button onClick={onClose} className={styles.popupBtn}>확인</button>
      </div>
    </div>
  );
}

export default ErrorPopup;
