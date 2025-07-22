import '../App.css';
import { useNavigate, useLocation } from 'react-router-dom';
import React, { useState, useEffect, useContext } from 'react';
import LoginModal from '../components/LoginModal';
import { UserContext } from '../context/UserContext';
import axios from 'axios';

function MainPage({ isLoggedIn, setIsLoggedIn }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const [selectedTag, setSelectedTag] = useState('행복');
  const { userInfo, logout } = useContext(UserContext);

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
    <div className="layout">
      <div className="main">
        <div className="moment-mood-container">
          {/* 왼쪽: Moments */}
          <div className="main-left">
            <h3>Moments</h3>
            <div className="moment-card">
              <img src="" alt="video1" />
              <div>내용</div>
            </div>
            <div className="moment-card">
              <img src="" alt="video2" />
              <div>내용</div>
            </div>
          </div>

          {/* 오른쪽: Mood Picks */}
          <div className="main-right">
            <h3>{isLoggedIn ? '나만의 Mood Picks' : 'Mood Picks'}</h3>
             <div className="tagContainer">
                <h4 className="sectionTitle">오늘 기분에 어울리는 곡을 찾아드릴게요</h4>
                <div className="tags">
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
      
              <div className="playlistArea">
                {songs.map((song, idx) => (
                  <div className="playlistCard" key={idx}>
                    {song.title} - {song.artist}
                  </div>
                ))}
              </div>
          </div>
        </div>
      </div>

      {showModal && (
        <LoginModal
          onClose={() => setShowModal(false)}
          setIsLoggedIn={setIsLoggedIn}
        />
      )}
    </div>
  );
}
//테스트
export default MainPage;
