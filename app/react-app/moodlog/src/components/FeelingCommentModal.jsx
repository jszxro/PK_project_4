// MomentsPage 에서 임포트함 
import React from 'react';
import styles from '../assets/css/FeelingCommentModal.module.css';
import { useEffect, useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import axios from "axios"


const FeelingCommentModal = ({ isOpen, onClose, onSubmit }) => {
  const [content, setContent] = useState('');
  const [url, setUrl] = useState('');
  const [emojiList, setEmojiList] = useState([]);
  const [emoji, setEmoji] = useState([]);
  const [title, setTitle] = useState("");
  const { userInfo } = useContext(UserContext);

  useEffect(() => {
    axios.get('/api/emojis') // 실제 서버 경로에 따라 '/emojis' 또는 '/api/emojis'
      .then(response => setEmojiList(response.data))
      .catch(error => console.error('이모지 불러오기 실패:', error));

  }, []);

  const extractVideoId = (url) => {
    const regExp = /(?:youtube\.com.*(?:v=|\/embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };
  const handleSubmit = () => {
    if (!emoji || !title || !content || !url) {
      alert("모든 항목을 입력해주세요.");
      return;
    }
    const videoId = extractVideoId(url);
    if (!videoId) {
      alert("올바른 YouTube URL을 입력하세요.");
      return;
    }

    const imgUrl = `https://img.youtube.com/vi/${videoId}/0.jpg`;

    axios.post('/api/posts', {
      userKey: userInfo.userKey,
      title,
      content,
      emojiId: emoji,
      url,
      imgUrl
    }, { withCredentials: true })
      .then(() => {
        alert("등록 완료!");
        onSubmit();
        onClose();  // 모달 닫기
      })
      .catch(err => {
        console.error("등록 실패", err);
        alert("등록에 실패했습니다.");
      });
  };



  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalBox}>
        <h2 className={styles.modalTitle}>오늘의 기분</h2>

        <div className={styles.emojiRow}>
          <label className={styles.emojiLabel}>이모지 선택 : </label>
          <select
            value={emoji}
            onChange={(e) => setEmoji(e.target.value)}
            className={styles.diaryModalSelect}
          >
            <option value="">선택</option>
            {emojiList.map(e => (
              <option key={e.emojiId} value={e.emojiId}>
                #{e.emojiId}
              </option>
            ))}
          </select>
        </div>

        <input
          type="text"
          className={styles.modalInput}
          placeholder="유튜브 URL 넣어주세요"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <input
          type="text"
          className={styles.modalInput}
          placeholder="제목 넣어주세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className={styles.modalInput}
          placeholder="내용 넣어주세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className={styles.modalButtons}>
          <button
            className={styles.submitBtn}
            onClick={() => handleSubmit()}
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
