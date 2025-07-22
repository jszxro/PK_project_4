import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import styles from '../assets/css/DiaryModal.module.css';
import { UserContext } from '../context/UserContext';


function DiaryModal({ date, onClose, initialEmoji = '' }) {
  // const [emoji, setEmoji] = useState('');
  const [emoji, setEmoji] = useState(initialEmoji);
  const [text, setText] = useState('');
  const [emojiList, setEmojiList] = useState([]);
  const { userInfo } = useContext(UserContext);


  useEffect(() => {
    axios.get('/api/emojis') // 실제 서버 경로에 따라 '/emojis' 또는 '/api/emojis'
      .then(response => setEmojiList(response.data))
      .catch(error => console.error('이모지 불러오기 실패:', error));
  }, []);

  const handleSubmit = async () => {
    if (!emoji || !text) {
      alert('이모지와 내용을 모두 입력해주세요.');
      return;
    }

    try {
      await axios.post('/api/diaries', {
        userKey: userInfo.userKey, // 또는 다른 방식으로 가져오기
        content: text,
        emojiId: emoji,
        imgUrl: null // 필요하다면 이미지 추가
      });

      console.log("전송 데이터", {
        userKey: localStorage.getItem('userKey'),
        content: text,
        emojiId: emoji
      });

      alert('일기가 성공적으로 저장되었습니다!');
      onClose(); // 모달 닫기
    } catch (error) {
      console.error('일기 저장 실패:', error);
      alert('일기 저장에 실패했습니다.');
    }
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

        <label className={styles.diaryModalLabel}>제목:</label>
        <input
          type="text"
          placeholder="일기 제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={styles.diaryModalTitle}
        />

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

      {showErrorPopup && (
      <ErrorPopup
        message={errorMsg}
        onClose={() => setShowErrorPopup(false)}
      />
      )}
    </div>

  );
}

export default DiaryModal;