import '../App.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import LoginModal from '../components/LoginModal';
import CalendarBox from '../components/CalendarBox';
import DiaryModal from '../components/DiaryModal';

function ArchivePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDiaryModal, setShowDiaryModal] = useState(false);
  const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const currentMonth = new Date().getMonth();

  return (
    <div className="layout">
      {/* 좌측 사이드바 */}
      <div className="sidebar">
        <h2 className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Moodlog</h2>
        <p className="subtitle">당신의 감정을 이해하는 첫 번째 플레이리스트</p>
        <ul className="nav">
          <li onClick={() => navigate('/')} className={location.pathname === '/' ? 'active' : ''}>Home</li>
          <li onClick={() => navigate('/playlist')} className={location.pathname === '/playlist' ? 'active' : ''}>Playlist</li>
          <li onClick={() => navigate('/moments')} className={location.pathname === '/moments' ? 'active' : ''}>Moments</li>
          <li className="active">Archive</li>
          <li onClick={() => navigate('/diary')} className={location.pathname === '/diary' ? 'active' : ''}>Diary</li>
        </ul>
      </div>

      {/* 우측 메인 콘텐츠 */}
      <div className="right-panel archive-panel">
        {/* 프로필 요약 */}
        <div className="profile-summary">  
          <div className="profile">👤</div>
          <div className="profile-text">
            <h3>하리보</h3>
            <p>작성한 글: 1, 댓글: 12</p>
          </div>
        </div>

        {/* 감정 통계 요약 */}
        <div className="emotion-summary">
          <h4>지난 7일간의 감정 통계</h4>
          <p>😊 기쁨: 4회  😢 슬픔: 2회  😤 짜증: 1회</p>
          <p>✨ 최근 가장 자주 느낀 감정: 기쁨</p>
          <p>📅 총 기록한 날: 12일 / 30일</p>
        </div>

        {/* Archive + Summary */}
        <div className="archive-row">
          <div className="archive-box archive-a">
            <h4>Archive</h4>
            <p>😊 기쁨에 어울렸던 곡들<br />
              - Firefly - N.Flying<br />
              - 시간과 혼잣 - 하현상</p>
            <p>😢 우울했던 날 함께했던 곡들<br />
              - 어떤 이의 편지 - 하현상<br />
              - Afraid - DAY6</p>
          </div>
          <div className="archive-box archive-b">
            <h4>My Archive Summary</h4>
            <p>📌 Moments 작성: 7개</p>
            <p>💬 남긴 댓글: 12개</p>
            <p>📂 기록한 감정: 5종류</p>
          </div>
        </div>

        {/* 달력 + 감정 흐름 */}
        <div className="archive-row">
          <div className="calendar-box calendar-fixed">
            {/* <h4>{monthNames[currentMonth]}</h4> */}
            <CalendarBox onDateClick={(date) => {
              setSelectedDate(date);
              setShowDiaryModal(true);
            }} />
          </div>
          <div className="archive-box timeline-fixed">
            <h4>감정 흐름 타임라인</h4>
            <p style={{ color: '#666', marginTop: '20px' }}>(추후 그래프 예정)</p>
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