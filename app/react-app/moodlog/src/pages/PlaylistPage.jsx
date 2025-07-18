import '../App.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import LoginModal from '../components/LoginModal';
import styles from '../assets/css/PlaylistPage.module.css'; // ✅ CSS 모듈 import

function PlaylistPage({ isLoggedIn, setIsLoggedIn }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const [selectedTag, setSelectedTag] = useState('Happy');

  const playlistData = {
    "Happy": ['[Happy 추천곡 1]', '[Happy 추천곡 2]', '[Happy 추천곡 3]'],
    "Sad": ['[Sad 추천곡 1]', '[Sad 추천곡 2]', '[Sad 추천곡 3]'],
    "Excited": ['[Excited 추천곡 1]', '[Excited 추천곡 2]', '[Excited 추천곡 3]'],
    "Angry": ['[Angry 추천곡 1]', '[Angry 추천곡 2]', '[Angry 추천곡 3]'],
    "Anxious": ['[Anxious 추천곡 1]', '[Anxious 추천곡 2]', '[Anxious 추천곡 3]'],
    "Lonely": ['[Lonely 추천곡 1]', '[Lonely 추천곡 2]', '[Lonely 추천곡 3]'],
    "Bored": ['[Bored 추천곡 1]', '[Bored 추천곡 2]', '[Bored 추천곡 3]'],
    "Need Comfort": ['[Comfort 추천곡 1]', '[Comfort 추천곡 2]', '[Comfort 추천곡 3]'],
    "Calm": ['[Calm 추천곡 1]', '[Calm 추천곡 2]', '[Calm 추천곡 3]'],
    "Focused": ['[Focused 추천곡 1]', '[Focused 추천곡 2]', '[Focused 추천곡 3]'],
  };

  return (
    <div className={styles.playlistLayout}>
      <div className={styles.mainContent}>
        <h4 className={styles.sectionTitle}>
          <span style={{ color: '#A8C3A8' }}>순간에 어울리는 노래</span> playlist
        </h4>

        <div className={styles.moodRow}>
          <div className={styles.moodCard}>
            <p className={styles.moodSubtitle}>혼자 조용히 있고 싶을 때</p>
            <p>→ '어떤 이의 편지' - 하현상<br />→ 'Afraid' - DAY6</p>
          </div>
          <div className={styles.moodCard}>
            <p className={styles.moodSubtitle}>햇살 좋은 날 산책하며</p>
            <p>→ 'Firefly' - N.Flying<br />→ '오늘' - 오왠</p>
          </div>
          <div className={styles.moodCard}>
            <p className={styles.moodSubtitle}>위로가 필요한 밤</p>
            <p>→ '동화' - 하현상<br />→ 'Lost' - 하현상</p>
          </div>
        </div>

        <div className={styles.tagContainer}>
          <h4 className={styles.sectionTitle}>오늘 기분에 어울리는 곡을 찾아드릴게요</h4>
          <div className={styles.tags}>
            {[
              'Happy', 'Sad', 'Excited', 'Angry', 'Anxious',
              'Lonely', 'Bored', 'Need Comfort', 'Calm', 'Focused'
            ].map(tag => (
              <button
                key={tag}
                className={`${styles.tagBtn} ${selectedTag === tag ? styles.active : ''}`}
                onClick={() => setSelectedTag(tag)}
              >
                # {tag}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.playlistArea}>
          {playlistData[selectedTag].map((text, idx) => (
            <div className={styles.playlistCard} key={idx}>
              {text}
            </div>
          ))}
        </div>

        <h4 className={`${styles.sectionTitle} ${styles.userRecommendTitle}`}>
          “다른 사용자들이 이런 순간에 추천한 곡”
        </h4>
        <div className={styles.userRecommend}>
          <p>
            "지치고 힘들었던 날, 이 노래가 위로가 되었어요."<br />
            – 사용자: 라떼<br />→ 'Afraid' - DAY6
          </p>
          <p>
            "햇살 찬란한 오후, 이 노래 들으며 웃었어요."<br />
            – 사용자: 응크<br />→ 'Firefly' - N.Flying
          </p>
        </div>
      </div>

      {showModal && <LoginModal onClose={() => setShowModal(false)} />}
    </div>
  );
}

export default PlaylistPage;
