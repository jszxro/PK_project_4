import React, { useState } from 'react';
import styles from '../assets/css/DiaryModal.module.css';


function DiaryModal({ date, onClose }) {
  const [emoji, setEmoji] = useState('');
  const [text, setText] = useState('');

  const handleSubmit = () => {
    console.log('📌 등록된 일기:', {
      date: date.toISOString().split('T')[0],
      emoji,
      text,
    });
    onClose(); // 모달 닫기
  };

  return (
    <div className={styles.diaryModalOverlay}>
    <div className={styles.diaryModalContainer}>
    <h2>Diary</h2>
    <p><strong>날짜:</strong> {date.toISOString().split('T')[0]}</p>

    <label className={styles.diaryModalLabel}>이모지 선택:</label>
    <select
      value={emoji}
      onChange={(e) => setEmoji(e.target.value)}
      className={styles.diaryModalSelect}
    >
      <option value="">선택</option>
      <option value="😊">😊 행복</option>
      <option value="😢">😢 슬픔</option>
      <option value="😐">😐 무표정</option>
    </select>

    <label className={styles.diaryModalLabel}>내용 작성:</label>
    <textarea
      placeholder="오늘 있었던 일을 작성하세요"
      value={text}
      onChange={(e) => setText(e.target.value)}
      className={styles.diaryModalTextarea}
    />

    <div className={styles.diaryModalFooter}>
      <button className={`${styles.diaryModalBtn} ${styles.cancel}`} onClick={onClose}>취소</button>
      <button className={`${styles.diaryModalBtn} ${styles.submit}`} onClick={handleSubmit}>등록</button>
    </div>
  </div>
</div>

  );
}

export default DiaryModal;