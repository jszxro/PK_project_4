// src/pages/MomentsPage.jsx
import '../App.css';
import styles from '../assets/css/MomentsPage.module.css';
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import LoginModal from '../components/LoginModal';
import FeelingCommentModal from '../components/FeelingCommentModal';
import axios from 'axios';
import { UserContext } from '../context/UserContext';

const MomentsPage = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feelingText, setFeelingText] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [emojiList, setEmojiList] = useState([]);
  const [selectedEmoji, setSelectedEmoji] = useState('');
  const [posts, setPosts] = useState([]);
  const [quote, setQuote] = useState('');
  const { userInfo } = useContext(UserContext);

  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;

  const [hoveredEmojiDesc, setHoveredEmojiDesc] = useState('');
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    axios.get('/api/quotes')
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setQuote(res.data[0].content);
        }
      })
      .catch((err) => {
        console.error('오늘의 한줄 가져오기 실패:', err);
      });

    axios.get('/api/posts')
      .then(res => {
        const mappedPosts = res.data.map(post => ({
          id: post.postId,
          author: post.author,
          userKey: post.userKey,
          tag: post.emojiId,
          content_title: post.title,
          content: post.content,
          url: post.url,
          thumbnail: post.imgUrl,
          likes: post.likes,
          time: post.createdAt
        }));
        setPosts(mappedPosts);
      })
      .catch(err => {
        console.error('게시글 불러오기 실패:', err);
      });
  }, []);

  useEffect(() => {
    axios.get('/api/emojis')
      .then(response => setEmojiList(response.data))
      .catch(error => console.error('이모지 목록 불러오기 실패:', error));
  }, []);

  useEffect(() => {
    setCurrentPage(1); // 💡 태그 바뀔 때 1페이지로 리셋
  }, [selectedTag]);

  const filteredPosts = selectedTag
    ? posts.filter(post => {
      const emoji = emojiList.find(e => e.emojiId === selectedTag);
      return emoji && post.tag.toLowerCase() === emoji.emojiId.toLowerCase();
    })
    : posts;

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const sortedByLikes = [...posts].sort((a, b) => b.likes - a.likes).slice(0, 3);

  const tagCounts = posts.reduce((acc, post) => {
    const emoji = emojiList.find(e => e.emojiId.toLowerCase() === post.tag.toLowerCase());
    if (emoji) {
      acc[emoji.emojiId] = (acc[emoji.emojiId] || 0) + 1;
    }
    return acc;
  }, {});

  const sortedTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([tag, count]) => ({ tag, count }));

  const topTag = sortedTags.length > 0 ? sortedTags[0].tag : null;

  const handleFeelingSubmit = (text) => {
    setFeelingText(text);
    setIsModalOpen(false);

    axios.get('/api/posts')
      .then(res => {
        const mappedPosts = res.data.map(post => ({
          id: post.postId,
          author: post.author,
          userKey: post.userKey,
          tag: post.emojiId,
          content_title: post.title,
          content: post.content,
          url: post.url,
          thumbnail: post.imgUrl,
          likes: post.likes,
          time: post.createdAt
        }));
        setPosts(mappedPosts);
      })
      .catch(err => {
        console.error('게시글 불러오기 실패:', err);
      });
  };

  return (
    <div className={styles.layout}>
      <div className={styles.main}>
        <div className={styles.tags}>
          <button
            className={`tag-btn ${selectedTag === '' ? 'active' : ''}`}
            onClick={() => setSelectedTag('')}
          >
            # all
          </button>

          {emojiList.map(({ emojiId, tag, description }) => (
            <button
              key={emojiId}
              className={`tag-btn ${selectedTag === emojiId ? 'active' : ''}`}
              onClick={() => setSelectedTag(emojiId)}
              onMouseEnter={(e) => {
                setHoveredEmojiDesc(description || tag || '감정');
                setTooltipPos({ x: e.clientX, y: e.clientY });
              }}
              onMouseMove={(e) => {
                setTooltipPos({ x: e.clientX, y: e.clientY });
              }}
              onMouseLeave={() => setHoveredEmojiDesc('')}
            >
              # {emojiId}
            </button>
          ))}
        </div>

        <FeelingCommentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleFeelingSubmit}
        />

        <div className={styles.splitWrapper}>
          <div className={styles.leftSection}>
            <div className={styles.momentHeader}>
              <p className={styles.momentCount}>
                {selectedTag ? `#${selectedTag} Moments (${filteredPosts.length})` : `all Moments (${filteredPosts.length})`}
              </p>
              <button
                className={styles.writeBtn}
                onClick={() => {
                  if (!userInfo) {
                    setShowModal(true);
                    return;
                  }
                  setIsModalOpen(true);
                }}
              >
                글쓰기 ✏️
              </button>
            </div>

            {currentPosts.length > 0 ? (
              <div className={styles.momentGrid}>
                {currentPosts.map(post => (
                  <div key={post.id} className={styles.postCard}>
                    <div className={styles.momentMeta}>
                      <span className={styles.momentAuthor}>작성자: {post.author}</span>
                      <span
                        className={styles.momentTag}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTag(post.tag);
                        }}
                        style={{ cursor: 'pointer', color: '#b5d3b0' }}
                      >
                        #{post.tag}
                      </span>
                      <span className={styles.momentTime}>{post.time}</span>
                    </div>
                    <img
                      className={styles.momentThumbnail}
                      src={post.thumbnail}
                      onClick={() => {
                        if (!userInfo) {
                          setShowModal(true);
                          return;
                        }
                        navigate(`/moments/${post.id}`, { state: { post } });
                      }}
                      alt="썸네일"
                    />
                    <div className={styles.momentLink}>
                      🔗 <a href={post.url} target="_blank" rel="noopener noreferrer">{post.url.slice(0, 50)}...</a>
                    </div>
                    <div className={styles.momentContentNLikes}>
                      <span className={styles.momentContent}>{post.content}</span>
                      <span className={styles.momentLikes}> 💛 {post.likes}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.noPosts}>게시글이 없습니다.</p>
            )}

            {totalPages > 1 && (
              <div className={styles.pagination}>
                {/* ◀ 이전 */}
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`${styles.pageButton} ${styles.arrowButton}`}
                >
                  ◀
                </button>
                {Array.from({ length: totalPages }, (_, idx) => (
                  <button
                    key={idx + 1}
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`${styles.pageButton} ${currentPage === idx + 1 ? styles.activePage : ''}`}
                  >
                    {idx + 1}
                  </button>
                ))}

                {/* ▶ 다음 */}
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`${styles.pageButton} ${styles.arrowButton}`}
                >
                  ▶
                </button>
              </div>
            )}
          </div>

          <div className={styles.rightSection}>
            <h3>오늘의 인기 Moments 하이라이트</h3>
            <div className={styles.highlightContainer}>
              {sortedByLikes.map(post => (
                <div key={post.id} className={styles.momentHighlight}>
                  <div className={styles.titleLine}>
                    <span className={styles.momentContentTitle}>{post.content_title}</span>
                  </div>
                  <div className={styles.songLine}>
                    <span>➡️ '{post.content}'</span>
                  </div>
                  <div className={styles.infoLine}>
                    <span className={styles.momentLikes}>공감 💛 {post.likes}</span>
                    <span className={styles.momentTime}>{post.time}</span>
                    <span
                      className={styles.momentShowAll}
                      onClick={() => {
                        if (!userInfo) {
                          setShowModal(true);
                          return;
                        }
                        navigate(`/moments/${post.id}`, { state: { post } });
                      }}
                    >
                      [전체보기]
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <h3>오늘 많이 공유된 감정</h3>
            <div className={styles.tagRanking}>
              {sortedTags.map(({ tag, count }) => (
                <div key={tag}>#{tag} ({count})건</div>
              ))}
              {topTag && (
                <button className={styles.textButton} onClick={() => setSelectedTag(topTag)}>
                  ➡️ #{topTag} Moments [전체 보기]
                </button>
              )}
            </div>

            <h3>오늘의 한 줄</h3>
            <div className={styles.momentCard}>
              <p>{quote ? quote : '오늘의 한 줄 준비 중...'}</p>
            </div>
          </div>
        </div>
      </div>

      {showModal && <LoginModal onClose={() => setShowModal(false)} />}
      {hoveredEmojiDesc && (
        <div
          style={{
            position: 'fixed',
            top: tooltipPos.y + 15,
            left: tooltipPos.x + 15,
            background: '#1E1E1E', // 추출된 어두운 배경색
            color: '#fff',
            padding: '6px 10px',
            borderRadius: '8px',
            fontSize: '0.85rem',
            pointerEvents: 'none',
            zIndex: 999,
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)'
          }}
        >
          {hoveredEmojiDesc}
        </div>
      )}
    </div>
  );
};

export default MomentsPage;