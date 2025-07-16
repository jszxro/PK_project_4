// src/pages/MomentsPage.jsx
import '../App.css';
import styles from '../assets/css/MomentsPage.module.css';
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import LoginModal from '../components/LoginModal';
import FeelingCommentModal from '../components/FeelingCommentModal';
import PostDetailModal from '../components/PostDetailModal';

const MomentsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tagList = ["Happy", "Sad", "Comfort", "Alone", "Focus"];
  const [showModal, setShowModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feelingText, setFeelingText] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const posts = [
    {
      id: 1,
      author: "매운 하리보",
      tag: "Happy",
      content_title: "행복한 순간을 공유하고 싶어요",
      content: "같이 노래 들어요 힘이 남",
      song_title: "Get You",
      singer: "Daniel Caesar",
      url: "https://www.youtube.com/watch?v=ffjjhRSd7Cw",
      thumbnail: "https://img.youtube.com/vi/ffjjhRSd7Cw/hqdefault.jpg",
      likes: 23,
      time: "30초 전"
    },
    {
      id: 2,
      author: "안매운 하리보",
      tag: "Sad",
      content_title: "엉엉생략테스트엉엉엉",
      content: "같이 노래 들어요 슬픔",
      song_title: "Move Through the fog",
      singer: "Lo-fi",
      url: "https://www.youtube.com/watch?v=C5V_3r5NI88",
      thumbnail: "https://img.youtube.com/vi/C5V_3r5NI88/hqdefault.jpg",
      likes: 46,
      time: "3초 전"
    },
    {
      id: 3,
      author: "짱매운 하리보",
      tag: "Happy",
      content_title: "내가 좋아하는 노래",
      content: "같이 노래 들어봅시다 행복임",
      song_title: "나 안아 벌금내",
      singer: "쿼카",
      url: "https://www.youtube.com/watch?v=FepuXV72_hQ",
      thumbnail: "https://img.youtube.com/vi/FepuXV72_hQ/hqdefault.jpg",
      likes: 96,
      time: "1초 전"
    },
  ];

  const filteredPosts = selectedTag ? posts.filter(post => post.tag === selectedTag) : posts;
  const sortedByLikes = [...posts].sort((a, b) => b.likes - a.likes).slice(0, 3);
  const tagCounts = posts.reduce((acc, post) => {
    if (tagList.includes(post.tag)) {
      acc[post.tag] = (acc[post.tag] || 0) + 1;
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
  };

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
          <li onClick={() => navigate('/archive')} className={location.pathname === '/archive' ? 'active' : ''}>Archive</li>
          <li onClick={() => navigate('/diary')} className={location.pathname === '/diary' ? 'active' : ''}>Diary</li>
        </ul>
      </div>

      {/* 우측 전체 영역 */}
      <div className="main-wrapper">
        {/* 우측 상단 바 */}
        <div className="top-bar">
          <div className="search-container">
            <input type="text" className="search-input" placeholder="제목을 입력하세요" />
            <button className="search-btn"><FaSearch /></button>
          </div>
          <button className="login-btn" onClick={() => setShowModal(true)}>로그인</button>
          <div className="profile">👤</div>
        </div>

        {/* 중앙: 태그 버튼 */}
        <div className={styles.tags}>
          {tagList.map(tag => (
            <button key={tag} className="tag-btn" onClick={() => setSelectedTag(tag)}># {tag}</button>
          ))}
        </div>

        {/* 중앙: 오늘의 기분 */}
        <div className={styles.commentFeeling} onClick={() => setIsModalOpen(true)} style={{ cursor: 'pointer' }}>
          <span>오늘의 기분을 한 줄로 남겨보세요</span>
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
                    <img className={styles.momentThumbnail} src={post.thumbnail} alt="유튜브 썸네일" />
                    <div className={styles.momentLink}>
                      🔗 <a href={post.url} target="_blank" rel="noopener noreferrer">{post.url.slice(0, 50)}...</a>
                    </div>
                    <div className={styles.momentContentNLikes}>
                      <span className={styles.momentContent}>{post.content}</span>
                      <span className={styles.momentLikes}>💛 {post.likes}</span>
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
                      <span>➡️ '{post.song_title} - {post.singer}'</span>
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

            <h3>오늘의 감정 한 줄</h3>
            <div className={styles.momentCard}>
              <p>{feelingText || '아직 기록된 감정이 없어요 😶'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 모달들 */}
      {showModal && <LoginModal onClose={() => setShowModal(false)} />}
      {isDetailModalOpen && selectedPost && (
        <PostDetailModal post={selectedPost} onClose={() => setIsDetailModalOpen(false)} />
      )}
    </div>
  );
};

export default MomentsPage;
