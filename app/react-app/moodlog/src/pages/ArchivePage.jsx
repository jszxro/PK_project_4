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

    // 해당 날짜에 이미 일기가 있는지 확인
    const existingDiary = diaryList.find(diary =>
      diary.createdAt && diary.createdAt.split('T')[0] === dateKey
    );

    if (existingDiary) {
      alert('해당 날짜에 이미 일기가 작성되어 있습니다.');
      setShowDiaryModal(false);
      return;
    }

    setShowDiaryModal(false);

    // 서버에서 최신 데이터 다시 로드
    const userKey = userInfo?.userKey || localStorage.getItem('userKey');
    if (userKey) {
      try {
        const response = await axios.get(`/api/diaries/user/${userKey}`);
        const diaries = response.data;

        setDiaryList(diaries);

        // 일기 데이터를 날짜별 이모지 형태로 변환 (데이터베이스의 실제 이모지 사용)
        const emojiData = {};
        diaries.forEach(diary => {
          if (diary.createdAt && diary.emoji) {
            const dateKey = diary.createdAt.split('T')[0];
            emojiData[dateKey] = diary.emoji;
          }
        });

        setDateEmojis(emojiData);
        console.log('업데이트된 일기 데이터:', diaries);
        console.log('업데이트된 이모지 데이터:', emojiData);
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
        <div className={styles.emotionContainer}>
          <div className={styles.emotionBoxWrapper}>
            {/* 감정 통계 제목 */}
            <div className={styles.emotionHeader}>
              <h4>지난 7일간의 감정 통계</h4>
              <span>기간: 7일</span>
            </div>
            <div className={styles.emotionBox}>
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
          </div>
          <div className={styles.emotionBoxWrapper}>
            {/* My Archive Summary 제목 */}
            <div className={styles.emotionHeader}>
              <h4>My Archive Summary</h4>
              <span></span>
            </div>
            <div className={styles.emotionBox}>
              <p>📌 Moments 작성: {emotionStats.totalDays}개</p>
              <p>💬 남긴 댓글: 0개</p>
              <p>📂 기록한 감정: {Object.keys(emotionStats.emotionCount).length}종류</p>
            </div>
          </div>
        </div>

        {/* 달력 + 감정 타임라인 */}
        <div className={styles.calendarRow}>
          <div className={styles.emotionBoxWrapper}>
            {/* 캘린더 제목 */}
            <div className={styles.emotionHeader}>
              <h4>Calendar</h4>
              <span></span>
            </div>
            <div className={styles.calendarBox}>
              <CalendarBox
                onDateClick={(date) => {
                  const dateKey = date.toISOString().split('T')[0];
                  const existingDiary = diaryList.find(diary =>
                    diary.createdAt && diary.createdAt.split('T')[0] === dateKey
                  );

                  if (existingDiary) {
                    alert('해당 날짜에 이미 일기가 작성되어 있습니다.');
                    return;
                  }

                  setSelectedDate(date);
                  setShowDiaryModal(true);
                }}
                dateEmojis={dateEmojis}
              />
            </div>
          </div>
          <div className={styles.emotionBoxWrapper}>
            {/* 다이어리 제목 */}
            <div className={styles.emotionHeader}>
              <h4>Diary</h4>
              <span></span>
            </div>
            <div className={styles.timelineBox}>
              <p></p>
            </div>
          </div>
        </div>

        {/* 감정 흐름 */}
        <div className={styles.emotionBoxWrapper}>
          <div className={styles.emotionHeader}>
            <h4>감정 흐름</h4>
            <span></span>
          </div>
          <div className={styles.timelineBox}>
            <p>(추후 그래프 예정)</p>
          </div>
        </div>


        {/* 작성된 일기 목록 */}
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
            <p>아직 작성된 일기가 없습니다. </p>
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
