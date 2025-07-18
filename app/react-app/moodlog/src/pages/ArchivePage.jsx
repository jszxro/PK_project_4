import '../App.css'; // 혹시 공통 스타일이 있다면 유지
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import LoginModal from '../components/LoginModal';
import CalendarBox from '../components/CalendarBox';
import DiaryModal from '../components/DiaryModal';
import styles from '../assets/css/ArchivePage.module.css'; // ✅ 모듈 CSS import

function ArchivePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDiaryModal, setShowDiaryModal] = useState(false);

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
            <h3>하리보</h3>
            <p>작성한 글: 1, 댓글: 12</p>
          </div>
        </div>

        {/* 감정 통계 요약 */}
        <div className={styles.emotionSummary}>
          <p>😊 기쁨: 4회  😢 슬픔: 2회  😤 짜증: 1회</p>
          <p>✨ 최근 가장 자주 느낀 감정: 기쁨<br />📅 총 기록한 날: 12일 / 30일</p>
        </div>

        {/* Archive & Summary */}
        <div className={styles.archiveRow}>
          <div className={styles.archiveBox}>
            <h4>Archive</h4>
            <p>😊 기쁨에 어울렸던 곡들<br />
              - Firefly - N.Flying<br />
              - 시간과 혼잣 - 하현상</p>
            <p>😢 우울했던 날 함께했던 곡들<br />
              - 어떤 이의 편지 - 하현상<br />
              - Afraid - DAY6</p>
          </div>
          <div className={styles.archiveBox}>
            <h4>My Archive Summary</h4>
            <p>📌 Moments 작성: 7개</p>
            <p>💬 남긴 댓글: 12개</p>
            <p>📂 기록한 감정: 5종류</p>
          </div>
        </div>

        {/* 달력 + 감정 타임라인 */}
        <div className={styles.calendarRow}>
          <div className={styles.calendarBox}>
            <CalendarBox onDateClick={(date) => {
              setSelectedDate(date);
              setShowDiaryModal(true);
            }} />
          </div>
          <div className={styles.timelineBox}>
            <h4>감정 흐름 타임라인</h4>
            <p>(추후 그래프 예정)</p>
          </div>
        </div>
      </div>

      {/* 모달 */}
      {showModal && <LoginModal onClose={() => setShowModal(false)} />}
      {showDiaryModal && selectedDate && (
        <DiaryModal
          date={selectedDate}
          onClose={() => setShowDiaryModal(false)}
        />
      )}
    </div>
  );
}

export default ArchivePage;
