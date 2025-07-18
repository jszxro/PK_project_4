// src/pages/DiaryPage.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LoginModal from '../components/LoginModal';
import DiaryModal from '../components/DiaryModal';
import styles from '../assets/css/DiaryPage.module.css';
import diaryex_01 from '../assets/img/diaryex_01.jpg';

const DiaryPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showModal, setShowModal] = useState(false); // 로그인 모달 
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(null);
  const [content, setContent] = useState('');
  const [showDiaryModal, setShowDiaryModal] = useState(false);

  // 오늘 날짜 구해서 문자열로 넣기 
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0'); // 월 (0~11이니 +1)
  const dd = String(today.getDate()).padStart(2, '0');

  const formattedDate = `${yyyy}-${mm}-${dd}`;

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
          <span>😊😒🤣😁😎🙄😣😮😴</span>
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
            onClose={() => setShowDiaryModal(false)}
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
