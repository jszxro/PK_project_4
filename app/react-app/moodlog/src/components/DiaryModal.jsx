import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../assets/css/DiaryModal.module.css';


function DiaryModal({ date, onClose, initialEmoji = '' }) {
  // const [emoji, setEmoji] = useState('');
  const [emoji, setEmoji] = useState(initialEmoji);
  const [text, setText] = useState('');
  const [emojiList, setEmojiList] = useState([]);


  useEffect(() => {
    axios.get('/api/emojis') // 실제 서버 경로에 따라 '/emojis' 또는 '/api/emojis'
      .then(response => setEmojiList(response.data))
      .catch(error => console.error('이모지 불러오기 실패:', error));
  }, []);

  const handleSubmit = () => {
    console.log('등록된 일기:', {
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
          {emojiList.map(e => (
            <option key={e.emojiId} value={e.emojiId}>
              {e.emoji}
            </option>
          ))}
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