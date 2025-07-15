// src/pages/MomentsPage.jsx 
import '../App.css'; 
import styles from '../assets/css/MomentsPage.module.css';
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import LoginModal from '../components/LoginModal'; // 로그인 모달 
import FeelingCommentModal from '../components/FeelingCommentModal'; // 한 줄 기분 모달 
import PostDetailModal from '../components/PostDetailModal'; // 게시글 상세 페이지 모달 

const MomentsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // 감정 태그 리스트 
  const tagList = ["Happy", "Sad", "Comfort", "Alone", "Focus"];

  // 유튜브 URL , 썸네일만 해당 
  const url = "https://www.youtube.com/watch?v=ffjjhRSd7Cw"

  const [showModal, setShowModal] = useState(false); // 로그인 모달 
  const [isModalOpen, setIsModalOpen] = useState(false);  // 감정 한 줄 모달 
  const [feelingText, setFeelingText] = useState(''); // 감정 한 줄 내용 
  const [selectedTag, setSelectedTag] = useState(''); // 선택된 감정 태그 
  const [selectedPost, setSelectedPost] = useState(null); // 어떤 게시글 눌렀는지 
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false); // 상세 게시글 모달 열림 여부 

  // 게시글 (예시)
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
    }
  ];

  // 선택된 태그만 필터링 
  const filteredPosts = selectedTag ? posts.filter(post => post.tag === selectedTag) : [];

  // 오늘의 인기 Moments 하이라이트 (인기순(likes) 포스트 출력)
  const sortedByLikes = [...posts].sort((a, b) => b.likes - a.likes).slice(0, 3);

   // 오늘 많이 공유된 감정 (해쉬태그 인기순위)
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

   // 오늘의 기분 한 줄 함수 
  const handleFeelingSubmit = (text) => {
    setFeelingText(text);
    setIsModalOpen(false);
  }

  return (
    <div className="layout">
      <div className="sidebar">
        <h2 className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Moodlog</h2>
        <ul className="nav">
          <li onClick={() => navigate('/')} className={location.pathname === '/' ? 'active' : ''}>Home</li>
          <li onClick={() => navigate('/playlist')} className={location.pathname === '/playlist' ? 'active' : ''}>Playlist</li>
          <li onClick={() => navigate('/moments')} className={location.pathname === '/moments' ? 'active' : ''}>Moments</li>
          <li onClick={() => navigate('/archive')} className={location.pathname === '/archive' ? 'active' : ''}>Archive</li>
          <li onClick={() => navigate('/diary')} className={location.pathname === '/diary' ? 'active' : ''}>Diary</li>
        </ul>
      </div>

      <div className="main-wrapper" style={{ display: 'flex', flex: 1 }}>
        {/* 왼쪽 영역 */}
        <div className="moments-left" style={{ flex: 2, padding: '40px' }}>
          <div className="tags">
            {tagList.map(tag => (
              <button key={tag} className="tag-btn" onClick={() => setSelectedTag(tag)}># {tag}</button>
            ))}
          </div>

          <div>
            <div className={styles.commentFeeling} onClick={() => setIsModalOpen(true)} style={{ cursor: 'pointer' }}>
              <span>오늘의 기분을 한 줄로 남겨보세요</span>
              <span>✏️</span>
            </div>
            <FeelingCommentModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onSubmit={handleFeelingSubmit}
            />
          </div>

          {selectedTag && (
            <>
              <div className={styles.momentHeader}>
                <p className={styles.momentCount}>#{selectedTag} Moments({filteredPosts.length})</p>
                <p className={styles.sortLabel}>최신순</p>
              </div>
              <div className="moment-card">
                {filteredPosts.map(post => (
                  <div key={post.id} className={styles.momentCard}>
                    <div className={styles.momentMeta}>
                      <span className={styles.momentAuthor}>작성자: {post.author}</span>
                      <span className={styles.momentTag}>#{post.tag}</span>
                      <span className={styles.momentTime}>{post.time}</span>
                    </div>
                    <img className={styles.momentThumbnail} src={post.thumbnail} alt="유튜브 썸네일" />
                    <div className={styles.momentLink}>
                      🔗 <a href={post.url} target="_blank" rel="noopener noreferrer">{post.url.slice(0, 50)}...</a>
                    </div>
                    <p className={styles.momentContent}>{post.content}</p>
                    <div className={styles.momentLikes}>💛 {post.likes}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* 오른쪽 영역 */}
        <div className="moments-right" style={{ flex: 1, padding: '40px 20px' }}>
          <div className="top-bar">
            <div className="search-container">
              <input type="text" className="search-input" placeholder="제목을 입력하세요" />
              <button className="search-btn"><FaSearch /></button>
            </div>
            <button className="login-btn" onClick={() => setShowModal(true)}>로그인</button>
            <div className="profile">👤</div>
          </div>

          <h3>오늘의 인기 Moments 하이라이트</h3>
          <div className="moment-card">
            {sortedByLikes.map(post => (
              <div key={post.id} className={styles.momentMeta}>
                <span className={styles.momentContentTitle}>{post.content_title}</span>
                <span>➡️ '{post.song_title} - {post.singer}'</span>
                <span className={styles.momentLikes}>공감 💛 {post.likes}</span>
                <span className={styles.momentTime}>{post.time}</span>
                <span
                  className={styles.momentShowAll}
                  onClick={() => {
                    setSelectedPost(post);
                    setIsDetailModalOpen(true);
                  }}
                  style={{ cursor: 'pointer', color: '#A8C3A8', fontWeight: 'bold' }}
                >[전체보기]</span>
              </div>
            ))}

          </div>

          <h3>오늘 많이 공유된 감정</h3>
          <div className={styles.momentCard}>
            <div className={styles.tagRanking}>
              {sortedTags.map(({ tag, count }) => (
                <div key={tag}>#{tag} ({count})건</div>
              ))}
            </div>

             {/* 가장 많이 나온 태그 Moments 보기 버튼 */}
             {topTag && (
              <button
                className={styles.textButton}
                onClick={() => setSelectedTag(topTag)}
              >
               ➡️ #{topTag} Moments [전체 보기]
              </button>
            )}

          </div>

          <h3>오늘의 감정 한 줄</h3>
          <div className={styles.momentCard}>
            <p>{feelingText || '아직 기록된 감정이 없어요 😶'}</p>
            {/* {feelingText && <p>{feelingText}</p>} */}
          </div>
        </div>
      </div>
      
      {/* 로그인 모달 */}
      {showModal && <LoginModal onClose={() => setShowModal(false)} />}
       {/* 상세페이지 모달 */}
      {isDetailModalOpen && selectedPost && (
        <PostDetailModal post={selectedPost} onClose={() => setIsDetailModalOpen(false)} />
      )}
    </div>
  );
};

export default MomentsPage;
