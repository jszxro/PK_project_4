import '../App.css'; // 혹시 공통 스타일이 있다면 유지
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import LoginModal from '../components/LoginModal';
import CalendarBox from '../components/CalendarBox';
import DiaryModal from '../components/DiaryModal';
import styles from '../assets/css/ArchivePage.module.css';
import diaryStyles from '../assets/css/DiaryPage.module.css';
import { UserContext } from '../context/UserContext';
import diaryex_01 from '../assets/img/diaryex_01.jpg';

function ArchivePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo } = useContext(UserContext);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDiaryModal, setShowDiaryModal] = useState(false);

  // 새로 추가되는 상태들
  const [dateEmojis, setDateEmojis] = useState({});
  const [diaryList, setDiaryList] = useState([]);
  const [emojiList, setEmojiList] = useState([]);
  const [selectedEmoji, setSelectedEmoji] = useState('');

  // 오늘 날짜 구하기
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const formattedDate = `${yyyy}-${mm}-${dd}`;

  // 일기 예시 데이터
  const diaries = [
    {
      id: 1,
      author: "매운 하리보",
      date: formattedDate,
      title: "슬프다",
      content: "오늘은 실수를 많이 해서 정말 슬펐어",
      image: diaryex_01,
      emoji: "😣"
    }
  ];

  // 페이지 로드 시 일기 데이터 가져오기
  useEffect(() => {
    const loadDiaryData = async () => {
      const userKey = userInfo?.userKey || localStorage.getItem('userKey');
      if (!userKey) return;

      try {
        const response = await axios.get(`/api/diaries/user/${userKey}`);
        const diaries = response.data;

        setDiaryList(diaries);

        // 일기 데이터를 날짜별 이모지 형태로 변환
        const emojiData = {};
        diaries.forEach(diary => {
          if (diary.createdAt && diary.emoji) {
            const dateKey = diary.createdAt.split('T')[0];
            emojiData[dateKey] = diary.emoji;
          }
        });

        setDateEmojis(emojiData);
        console.log('로드된 일기 데이터:', diaries);
        console.log('변환된 이모지 데이터:', emojiData);
      } catch (error) {
        console.error('일기 데이터 로드 실패:', error);
      }
    };

    loadDiaryData();
  }, [userInfo]);

  // 이모지 목록 로드
  useEffect(() => {
    axios.get('/api/emojis')
      .then(response => setEmojiList(response.data))
      .catch(error => console.error('이모지 목록 불러오기 실패:', error));
  }, []);

  // 다이어리 저장 시 이모지 업데이트
  const handleDiarySave = async (date, emoji, content) => {
    const dateKey = date.toISOString().split('T')[0];
    setDateEmojis(prev => ({
      ...prev,
      [dateKey]: emoji
    }));
    setShowDiaryModal(false);

    // 서버에서 최신 데이터 다시 로드
    const userKey = userInfo?.userKey || localStorage.getItem('userKey');
    if (userKey) {
      try {
        const response = await axios.get(`/api/diaries/user/${userKey}`);
        const diaries = response.data;

        setDiaryList(diaries);

        const emojiData = {};
        diaries.forEach(diary => {
          if (diary.createdAt && diary.emoji) {
            const dateKey = diary.createdAt.split('T')[0];
            emojiData[dateKey] = diary.emoji;
          }
        });

        setDateEmojis(emojiData);
      } catch (error) {
        console.error('최신 일기 데이터 로드 실패:', error);
      }
    }
  };

  // 이모지 클릭 핸들러
  const handleEmojiClick = (emojiId) => {
    setSelectedEmoji(emojiId);
    setSelectedDate(new Date());
    setShowDiaryModal(true);
  };

  // 감정 통계 계산
  const calculateEmotionStats = () => {
    const emotionCount = {};
    const totalDays = Object.keys(dateEmojis).length;

    Object.values(dateEmojis).forEach(emoji => {
      emotionCount[emoji] = (emotionCount[emoji] || 0) + 1;
    });

    const mostFrequentEmotion = Object.entries(emotionCount)
      .sort((a, b) => b[1] - a[1])[0];

    const currentMonthDays = 30;

    return {
      emotionCount,
      totalDays,
      mostFrequentEmotion: mostFrequentEmotion ? mostFrequentEmotion[0] : null,
      mostFrequentCount: mostFrequentEmotion ? mostFrequentEmotion[1] : 0,
      currentMonthDays
    };
  };

  const emotionStats = calculateEmotionStats();

  return (
    <div className="layout">
      {/* 좌측 사이드바 */}


      {/* 우측 메인 콘텐츠 */}
      <div className={styles.archivePanel}>
        {/* 프로필 요약 */}
        <div className={styles.profileSummary}>
          <div className={styles.profile}>
            <img src="/your-profile-image.jpg" alt="프로필" />
          </div>
          <div className={styles.profileText}>
            <h3>{userInfo?.nickname}님!</h3>
            <p>작성한 글: 1, 댓글: 12</p>
          </div>
        </div>

        {/* 감정 통계 요약 */}
        <div className={styles.emotionSummary}>
          <p>
            {Object.entries(emotionStats.emotionCount).map(([emoji, count], index) => (
              <span key={emoji}>
                {emoji}: {count}회
                {index < Object.entries(emotionStats.emotionCount).length - 1 ? '  ' : ''}
              </span>
            ))}
            {emotionStats.totalDays === 0 && '아직 기록된 감정이 없습니다.'}
          </p>
          <p>
            ✨ 최근 가장 자주 느낀 감정: {emotionStats.mostFrequentEmotion || '없음'}
            {emotionStats.mostFrequentCount > 0 && ` (${emotionStats.mostFrequentCount}회)`}
            <br />
            📅 총 기록한 날: {emotionStats.totalDays}일 / {emotionStats.currentMonthDays}일
          </p>
        </div>

        {/* Archive & Summary */}
        <div className={styles.archiveRow}>
          <div className={styles.archiveBox}>
            <h4>Archive</h4>
            {Object.keys(emotionStats.emotionCount).length > 0 ? (
              Object.entries(emotionStats.emotionCount).map(([emoji, count]) => (
                <p key={emoji}>
                  {emoji} 기록된 날들<br />
                  - 함께한 순간들이 여기에 기록됩니다
                </p>
              ))
            ) : (
              <p>아직 기록된 감정이 없습니다.</p>
            )}
          </div>
          <div className={styles.archiveBox}>
            <h4>My Archive Summary</h4>
            <p>📌 Moments 작성: {emotionStats.totalDays}개</p>
            <p>💬 남긴 댓글: 0개</p>
            <p>📂 기록한 감정: {Object.keys(emotionStats.emotionCount).length}종류</p>
          </div>
        </div>

        {/* 달력 + 감정 타임라인 */}
        <div className={styles.calendarRow}>
          <div className={styles.calendarBox}>
            <CalendarBox
              onDateClick={(date) => {
                setSelectedDate(date);
                setShowDiaryModal(true);
              }}
              dateEmojis={dateEmojis}
            />
          </div>
          <div className={styles.timelineBox}>
            <h4>감정 흐름 타임라인</h4>
            <p>(추후 그래프 예정)</p>
          </div>
        </div>

        {/* 다이어리 섹션 */}
        <div className={diaryStyles.diaryPageMain}>
          <h2>Diary</h2>
          <hr />
          {diaries.map((diary) => (
            <div key={diary.id}>
              <div className='diary-emoji'>
                <span>이모지 선택:</span>
                <div className={diaryStyles.emojiList}>
                  {emojiList.map((emoji) => (
                    <button
                      key={emoji.emojiId}
                      onClick={() => handleEmojiClick(emoji.emojiId)}
                      className={`${diaryStyles.emojiButton} ${selectedEmoji === emoji.emojiId ? diaryStyles.selected : ''}`}
                    >
                      {emoji.emoji}
                    </button>
                  ))}
                </div>
              </div>
              <div>날짜 : {diary.date} </div>
              <div className={diaryStyles.diaryCard}>
                <div className={diaryStyles.diaryTitle}>
                  {diary.emoji} {diary.title}
                </div>
                <hr className={diaryStyles.titleDivider} />
                {diary.image && (
                  <img
                    className={diaryStyles.diaryImage}
                    src={diary.image}
                    alt="사용자 첨부 이미지"
                  />
                )}
                <div className={diaryStyles.diaryContent}>{diary.content}</div>
              </div>
            </div>
          ))}

          <button
            onClick={() => {
              setSelectedDate(new Date());
              setShowDiaryModal(true);
            }}
            className={diaryStyles.openModalBtn}
          >
            오늘의 일기 쓰기
          </button>
        </div>

        {/* 실제 작성된 일기 목록 */}
        <div className={styles.diaryListSection}>
          <h4>내 일기 목록</h4>
          {diaryList.length > 0 ? (
            <div className={styles.diaryGrid}>
              {diaryList.map((diary) => (
                <div key={diary.diaryId} className={diaryStyles.diaryCard}>
                  <div className={diaryStyles.diaryTitle}>
                    {diary.emoji} {diary.createdAt?.split('T')[0]}
                  </div>
                  <hr className={diaryStyles.titleDivider} />
                  {diary.imgUrl && (
                    <img
                      className={diaryStyles.diaryImage}
                      src={diary.imgUrl}
                      alt="일기 이미지"
                    />
                  )}
                  <div className={diaryStyles.diaryContent}>
                    {diary.content}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>아직 작성된 일기가 없습니다. 달력에서 날짜를 클릭하거나 위의 이모지를 선택해서 일기를 작성해보세요!</p>
          )}
        </div>
      </div>



      {/* 모달 */}
      {showModal && <LoginModal onClose={() => setShowModal(false)} />}
      {showDiaryModal && selectedDate && (
        <DiaryModal
          date={selectedDate}
          onClose={() => {
            setShowDiaryModal(false);
            setSelectedEmoji(''); // 초기화
          }}
          onSave={handleDiarySave}
          initialEmoji={selectedEmoji}
        />
      )}
    </div>
  );
}

export default ArchivePage;
