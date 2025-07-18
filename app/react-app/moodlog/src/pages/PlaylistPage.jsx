import '../App.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LoginModal from '../components/LoginModal';
import styles from '../assets/css/PlaylistPage.module.css'; // ✅ CSS 모듈 import
import axios from 'axios';

function PlaylistPage({ isLoggedIn, setIsLoggedIn }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const [selectedTag, setSelectedTag] = useState('행복');
  const [emojiList, setEmojiList] = useState([]);
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    axios.get('/api/emojis')
      .then(response => setEmojiList(response.data))
      .catch(error => console.error('이모지 목록 불러오기 실패:', error));
  }, []);

  useEffect(() => {
    axios.get(`/api/songs/${encodeURIComponent(selectedTag)}`)
      .then(res => setSongs(res.data))
      .catch(err => console.error('노래 목록 불러오기 실패:', err));
  }, [selectedTag]);

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
            {emojiList.map(({ emojiId, tag }) => (
              <button
                key={emojiId}
                className="tag-btn"
                onClick={() => { setSelectedTag(tag), console.log(tag) }}
              >
                # {emojiId}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.playlistArea}>
          {songs.map((song, idx) => (
            <div className={styles.playlistCard} key={idx}>
              {song.title} - {song.artist}
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
