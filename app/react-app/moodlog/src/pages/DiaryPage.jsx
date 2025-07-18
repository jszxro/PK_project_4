// src/pages/DiaryPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import LoginModal from '../components/LoginModal';
import styles from '../assets/css/DiaryPage.module.css';
import DiaryModal from '../components/DiaryModal';
import diaryex_01 from '../assets/img/diaryex_01.jpg';

const DiaryPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showModal, setShowModal] = useState(false); // 로그인 모달 
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(null);
  const [content, setContent] = useState('');
  const [showDiaryModal, setShowDiaryModal] = useState(false);
  const [emojiList, setEmojiList] = useState([]);
  const [selectedEmoji, setSelectedEmoji] = useState('');

  // 오늘 날짜 구해서 문자열로 넣기 
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0'); // 월 (0~11이니 +1)
  const dd = String(today.getDate()).padStart(2, '0');

  const formattedDate = `${yyyy}-${mm}-${dd}`;

  useEffect(() => {
    axios.get('/api/emojis')
      .then(response => setEmojiList(response.data))
      .catch(error => console.error('이모지 목록 불러오기 실패:', error));
  }, []);


  //일기 예시
  const diaries = [
    {
      id: 1,
      author: "매운 하리보",
      date: formattedDate,
      title: "슬프다",
      content: "오늘은 실수를 만히 해서 정말 슬펏어 ",
      image: diaryex_01,
      emoji: "😣"
    }
  ]

  const handleEmojiClick = (emojiId) => {
    setSelectedEmoji(emojiId);
    setShowDiaryModal(true);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // base64 string 저장 
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!title || !content) {
      alert('제목과 내용을 입력해주세요');
      return;
    }
    const diaryData = {
      title,
      image,
      content,
      createdAt: new Date().toISOString(),
    };
    console.log('💾 저장된 일기:', diaryData);
    alert('일기가 저장되었습니다!');
    // 여기에 API 호출 또는 로컬스토리지 저장 가능
  }

  return (
    <div className={styles.layout}>
      <div className={styles.main}>
        <div className={styles.diaryPageMain}>
          <h2>Diary</h2>
          <hr />
          {diaries.map((diary) => (
            <div key={diary.id}>
              <div className='diary-emoji'>
                <span>이모지 선택:</span>
                <div className={styles.emojiList}>
                  {emojiList.map((emoji) => (
                    <button
                      key={emoji.emojiId}
                      onClick={() => handleEmojiClick(emoji.emojiId)}
                      className={styles.emojiButton}
                    >
                      {emoji.emoji}
                    </button>
                  ))}
                </div>
              </div>
              <div>날짜 : {diary.date} </div>
              <div className={styles.diaryCard}>
                <div className={styles.diaryTitle}>
                  {diary.emoji} {diary.title}
                </div>
                <hr className={styles.titleDivider} />
                {diary.image && (
                  <img
                    className={styles.diaryImage}
                    src={diary.image}
                    alt="사용자 첨부 이미지"
                  />
                )}
                <div className={styles.diaryContent}>{diary.content}</div>
              </div>
            </div>
          ))}

          <button onClick={() => setShowDiaryModal(true)} className={styles.openModalBtn}>
            오늘의 일기 쓰기
          </button>
          {/* DiaryModal 조건부 렌더링 */}
          {showDiaryModal && (
            <DiaryModal
              date={new Date()}
              onClose={() => {
                setShowDiaryModal(false);
                setSelectedEmoji(''); // 초기화
              }}
              initialEmoji={selectedEmoji}
            />
          )}
        </div>
      </div>
      {/* 로그인 모달 */}
      {showModal && <LoginModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default DiaryPage;
