import '../App.css';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useContext } from 'react';
import LoginModal from '../components/LoginModal';
import { UserContext } from '../context/UserContext';
import axios from 'axios';
import styles from '../assets/css/Home.module.css'; // ✅ CSS 모듈 import

function MainPage({ isLoggedIn, setIsLoggedIn }) {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const { userInfo } = useContext(UserContext);

  // 게시글 관련 상태
  const [allPosts, setAllPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = allPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(allPosts.length / postsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
  console.log('[🔍 MainPage] isLoggedIn:', isLoggedIn);
  console.log('[🔍 MainPage] userInfo:', userInfo);
  }, [isLoggedIn, userInfo]);

  // ✅ 태그 및 노래 상태
  const [selectedTag, setSelectedTag] = useState('행복');
  const [emojiList, setEmojiList] = useState([]);
  const [songs, setSongs] = useState([]);

  // ✅ 이모지 목록 불러오기
  useEffect(() => {
    axios.get('/api/emojis')
      .then(response => setEmojiList(response.data))
      .catch(error => console.error('이모지 목록 불러오기 실패:', error));
  }, []);

  // ✅ 선택한 태그에 따라 노래 목록 불러오기
  useEffect(() => {
    axios.get(`/api/songs/${encodeURIComponent(selectedTag)}`)
      .then(res => setSongs(res.data))
      .catch(err => console.error('노래 목록 불러오기 실패:', err));
  }, [selectedTag]);

  // 게시글 불러오기
  useEffect(() => {
    axios.get('/api/posts')
      .then(res => {
        const mappedPosts = res.data.map(post => ({
          id: post.postId,
          author: post.author,
          tag: post.emojiId,
          content_title: post.title,
          content: post.content,
          url: post.url,
          thumbnail: post.imgUrl,
          likes: post.likes,
          time: post.createdAt
        }));
        setAllPosts(mappedPosts);
      })
      .catch(err => console.error('최신 게시글 가져오기 실패:', err));
  }, []);

  return (
    <div className="layout">
      <div className="main">
        {userInfo && (
          <div className={styles.moodContainer}>
            {/* 1. 인삿말 */}
            <p className={styles.moodTitle}>
              오늘 기분이 어떠신가요, <span className={styles.nickname}>{userInfo?.nickname || '사용자'}</span>님
            </p>

            {/* 2. 이모지 버튼 리스트 */}
            <div className={styles.moodBar}>
              {emojiList.map((e) => (
                <button
                  key={e.emojiId}
                  className={`${styles.moodBtn} ${selectedTag === e.tag ? styles.activeMood : ''}`}
                  onClick={() => setSelectedTag(e.tag)}
                >
                  {e.emojiId}
                </button>
              ))}
            </div>

            <p className={styles.moodSub}>이 기분을 기록할까요?</p>
          </div>
        )}
        <div className="moment-mood-container">
          {/* 왼쪽: Moments */}
          <div className="main-left">
            <h3>Moments</h3>
            {currentPosts.length > 0 ? (
              currentPosts.map(post => (
                <div key={post.id} className="moment-card" onClick={() => navigate('/moments')}>
                  <img src={post.thumbnail} alt="썸네일" className="moment-thumbnail" />
                  <div className="moment-meta">
                    <span className="moment-author">작성자: {post.author}</span>
                    <span className="moment-tag">#{post.tag}</span>
                    <span className="moment-time">{new Date(post.time).toLocaleDateString()}</span>
                  </div>
                  <div className="moment-content">{post.content}</div>
                </div>
              ))
            ) : (
              <p>게시글이 없습니다.</p>
            )}

            {/* 페이지네이션 */}
            {totalPages > 1 && (
              <div className="pagination">
                {Array.from({ length: totalPages }, (_, idx) => (
                  <button
                    key={idx + 1}
                    className={`page-btn ${currentPage === idx + 1 ? 'active' : ''}`}
                    onClick={() => paginate(idx + 1)}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 오른쪽: Mood Picks */}
          <div className="main-right">
            <h3>{userInfo ? '나만의 Playlist' : 'Playlist'}</h3>
            <div className="empty-block" />

            {/* ✅ 태그 버튼 + 노래 박스 */}
            <div>
              <div>
                {emojiList.map(({ emojiId, tag }) => (
                  <button
                    key={emojiId}
                    className={
                      selectedTag === tag
                        ? `${styles.tagButton} ${styles.tagButtonActive}`
                        : styles.tagButton
                    }
                    onClick={() => setSelectedTag(tag)}
                  >
                    #{emojiId}
                  </button>
                ))}
              </div>

              <div className={styles.songBox}>
                {songs.length > 0 ? (
                  songs.map((song, idx) => {
                    const textToCopy = `${song.title} - ${song.artist}`;
                    return (
                      <div key={idx} className={styles.songItem} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>🎵 {textToCopy}</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(textToCopy);
                            alert('복사되었습니다!');
                          }}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#ccc',
                            cursor: 'pointer',
                            marginLeft: '10px',
                            fontSize: '14px',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          ⧉ 복사
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <div style={{ color: '#aaa' }}>노래가 없습니다.</div>
                )}
              </div>
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

export default MainPage;
