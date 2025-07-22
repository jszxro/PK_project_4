// src/pages/MomentsPage.jsx
import '../App.css';
import styles from '../assets/css/MomentsPage.module.css';
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import LoginModal from '../components/LoginModal';
import FeelingCommentModal from '../components/FeelingCommentModal';
import PostDetailModal from '../components/PostDetailModal';
import axios from 'axios';

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

    // 게시글 조회하기
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

  const filteredPosts = selectedTag
    ? posts.filter(post => {
      const emoji = emojiList.find(e => e.emojiId === selectedTag);
      return emoji && post.tag.toLowerCase() === emoji.emojiId.toLowerCase();
    })
    : posts;
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
      {/* 우측 전체 영역 */}
      <div className={styles.main}>
        {/* 중앙: 태그 버튼 */}
        <div className={styles.tags}>
          {emojiList.map(({ emojiId, tag }) => (
            <button
              key={emojiId}
              className={`tag-btn ${selectedTag === tag ? 'active' : ''}`}
              onClick={() => setSelectedTag(emojiId)}
            >
              # {emojiId}
            </button>
          ))}
        </div>

        {/* 중앙: 오늘의 기분 */}
        <div className={styles.commentFeeling} onClick={() => setIsModalOpen(true)} style={{ cursor: 'pointer' }}>
          <span>Moments 작성하기</span>
          <span>✏️</span>
        </div>
        <FeelingCommentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleFeelingSubmit}
        />

        {/* 중앙 하단: 좌우 분할 */}
        <div className={styles.splitWrapper}>
          {/* 왼쪽 영역: 게시글 카드 */}
          <div className={styles.leftSection}>
            {filteredPosts.length > 0 ? (
              <>
                <div className={styles.momentHeader}>
                  <p className={styles.momentCount}>
                    {selectedTag ? `#${selectedTag} Moments (${filteredPosts.length})` : `전체 Moments (${filteredPosts.length})`}
                  </p>
                  <p className={styles.sortLabel}>최신순</p>
                </div>
                <div className={styles.momentGrid}>
                  {filteredPosts.map(post => (
                    <div key={post.id} className={styles.postCard}>
                      <div className={styles.momentMeta}>
                        <span className={styles.momentAuthor}>작성자: {post.author}</span>
                        <span className={styles.momentTag}>#{post.tag}</span>
                        <span className={styles.momentTime}>{post.time}</span>
                      </div>
                      <img className={styles.momentThumbnail} src={post.thumbnail} onClick={() => {
                        setSelectedPost(post);
                        setIsDetailModalOpen(true);
                      }} alt="유튜브 썸네일" />
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
              </>
            ) : (<p className={styles.noPosts}>게시글이 없습니다.</p>)}

          </div>

          {/* 오른쪽 영역: 인기 Moments, 태그 순위, 오늘의 기분 */}
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
                        setSelectedPost(post);
                        setIsDetailModalOpen(true);
                      }}
                    >[전체보기]</span>
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

      {/* 모달들 */}
      {showModal && <LoginModal onClose={() => setShowModal(false)} />}
      {isDetailModalOpen && selectedPost && (
        <PostDetailModal
          post={selectedPost}
          onClose={() => setIsDetailModalOpen(false)}
          onReactionChange={(updatedReactionType) => {
            // posts 상태 변경
            setPosts(prevPosts => prevPosts.map(p => {
              if (p.id === selectedPost.id) {
                const newLikes = updatedReactionType === 1 ? p.likes + 1 : p.likes - 1;
                return { ...p, likes: newLikes };
              }
              return p;
            }));

            // 선택된 post도 업데이트 (모달 재렌더링용)
            setSelectedPost(prev => ({
              ...prev,
              likes: updatedReactionType === 1 ? prev.likes + 1 : prev.likes - 1
            }));
          }}
        />
      )}

    </div>
  );
};

export default MomentsPage;
