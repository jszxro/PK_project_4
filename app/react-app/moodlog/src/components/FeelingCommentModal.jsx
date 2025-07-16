
// MomentsPage 에서 임포트함 
import React from 'react';
import styles from '../assets/css/FeelingCommentModal.module.css';

const FeelingCommentModal = ({ isOpen, onClose, onSubmit }) => {
  const [feeling, setFeeling] = React.useState('');

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalBox}>
        <h2 className={styles.modalTitle}>오늘의 기분</h2>
        <input
          type="text"
          className={styles.modalInput}
          placeholder="한 줄로 남겨보세요"
          value={feeling}
          onChange={(e) => setFeeling(e.target.value)}
        />
        <div className={styles.modalButtons}>
          <button
            className={styles.submitBtn}
            onClick={() => onSubmit(feeling)}
          >
            등록
          </button>
          <button className={styles.cancelBtn} onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeelingCommentModal;
