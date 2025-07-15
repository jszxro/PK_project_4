// src/pages/MomentsPage.jsx
import '../App.css'; 
import styles from '../assets/css/MomentsPage.module.css';
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import LoginModal from '../components/LoginModal'; // 로그인 모달
import FeelingCommentModal from '../components/FeelingCommentModal'; // 한줄 기분 모달 
import PostDetailModal from '../components/PostDetailModal'; // 게시글 상세 페이지 모달

const MomentsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // 유튜브 URL, 썸네일만 해당 
  const url = "https://www.youtube.com/watch?v=ffjjhRSd7Cw"

  const [showModal, setShowModal] = useState(false);  
  const[isModalOpen,setIsModalOpen] = useState(false);
  const[feelingText,setFeelingText] = useState('');
  const[selectedTag,setSelectedTag] = useState(''); // 선택된 감정 태그 
  const [selectedPost, setSelectedPost] = useState(null);  // 어떤 게시글 눌렀는지
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);  // 상세 게시글 모달 열림 여부


  // 게시글 (예시)
  const posts = [
    {
      id: 1,
      author: "매운 하리보",
      tag: "Happy",
      content_title:"행복한 순간을 공유하고 싶어요",
      content: "같이 노래 들어요 힘이 남",
      song_title:"Get You",
      singer:"Daniel Caesar",
      url: "https://www.youtube.com/watch?v=ffjjhRSd7Cw",
      thumbnail: "https://img.youtube.com/vi/ffjjhRSd7Cw/hqdefault.jpg",
      likes: 23,
      time: "30초 전"
    },
    {
      id: 2,
      author: "안매운 하리보",
      tag: "Sad",
      content_title:"엉엉생략테스트엉엉엉",
      content: "같이 노래 들어요 슬픔",
      song_title:"Move Through the fog",
      singer:"Lo-fi",
      url: "https://www.youtube.com/watch?v=C5V_3r5NI88",
      thumbnail: "https://img.youtube.com/vi/C5V_3r5NI88/hqdefault.jpg",
      likes: 46,
      time: "3초 전"
    }
    // 추가 게시글 
  ];

   // 선택된 태그만 필터링
  const filteredPosts = selectedTag ? posts.filter((post) => post.tag === selectedTag) : []; 

  // 오늘의 인기 Moments 하이라이트 (인기순(likes) 포스트 출력)
  const sortedByLikes = [...posts]
    .sort((a,b) => b.likes - a.likes)
    .slice(0,3); // 상위 3개만 보여줌 

  // 유튜브 영상 ID 추출 함수
  const getYouTubeVideoId = (url) => {
    const urlObj = new URL(url);
    return urlObj.searchParams.get("v");
  };

  const videoId = getYouTubeVideoId(url);
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;


  // 오늘의 기분 한 줄 함수 
  const handleFeelingSubmit =(text)=>{
    setFeelingText(text);
    setIsModalOpen(false);
    // 서버 전송 코드 여기에 추가 가능 
  }

  return (
    <div className="layout">
      {/* 좌측 사이드바 */}
      <div className="sidebar">
        <h2 className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          Moodlog
        </h2>
        <ul className="nav">
          <li onClick={() => navigate('/')} className={location.pathname === '/' ? 'active' : ''}>Home</li>
          <li onClick={() => navigate('/playlist')} className={location.pathname === '/playlist' ? 'active' : ''}>Playlist</li>
          <li onClick={() => navigate('/moments')} className={location.pathname === '/moments' ? 'active' : ''}>Moments</li>
          <li onClick={() => navigate('/archive')} className={location.pathname === '/archive' ? 'active' : ''}>Archive</li>
          <li onClick={() => navigate('/diary')} className={location.pathname === '/diary' ? 'active' : ''}>Diary</li>
        </ul>
      </div>

      {/* 중앙 + 우측 wrapper */}
      <div className="main-wrapper">
        {/* 중앙 본문 */}
        <div className="page-container" style={{border:'1px solid white'}}>
         <div className="tags">
              <button className="tag-btn" onClick={() => setSelectedTag("Happy")}># Happy</button>
              <button className="tag-btn" onClick={() => setSelectedTag("Sad")}># Sad</button>
              <button className="tag-btn" onClick={() => setSelectedTag("Comfort")}># Comfort</button>
              <button className="tag-btn" onClick={() => setSelectedTag("Alone")}># Alone</button>
              <button className="tag-btn" onClick={() => setSelectedTag("Focus")}># Focus</button>
          </div>
          <div className="moment-card">
          <div 
          className={styles.commenttFeeling}
          onClick={()=>setIsModalOpen(true)} style={{cursor:'pointer'}}
          >
            오늘의 기분을 한 줄로 남겨보세요✏️
          </div>
          <FeelingCommentModal
            isOpen={isModalOpen}
            onClose={()=>setIsModalOpen(false)}
            onSubmit={handleFeelingSubmit}
          />
          </div>
    
          <div className="moments-section">
            <div className="moment-card">

            {/* 해당 태그 포스트 */}
            {selectedTag &&
            <div className={styles.momentHeader}>
              <p className={styles.momentCount}>#{selectedTag} Moments({filteredPosts.length})</p>
              <p className={styles.sortLabel}>최신순</p> 
            </div>}

              {filteredPosts.map((post) => (
                <div key={post.id} className={styles.momentCard} >
                  <div className={styles.momentMeta}>
                    <span className={styles.momentAuthor}>작성자: {post.author}</span>
                    <span className={styles.momentTag}>#{post.tag}</span>
                    <span className={styles.momentTime}>{post.time}</span>
                  </div>

                  <img
                    className={styles.momentThumbnail}
                    src={post.thumbnail}
                    alt="유튜브 썸네일"
                  />
                  <div className={styles.momentLink}>
                    🔗 <a href={post.url} target="_blank" rel="noopener noreferrer">
                      {post.url.slice(0, 50)}...
                    </a>
                  </div>
                  <p className={styles.momentContent}>{post.content}</p>
                  <div className={styles.momentLikes}>💛 {post.likes}</div>
                </div>
              ))}

            </div>

            <p>오늘의 인기 Moments 하이라이트</p>
            <div className="moment-card">
                {sortedByLikes.map((post) => (
                <div key={post.id}>
                  <div className={styles.momentMeta}>
                    <span className={styles.momentContentTitle}>{post.content_title} </span>
                    <span>➡️ '{post.song_title}-{post.singer}'</span>
                    <span className={styles.momentLikes}>공감 💛 {post.likes} </span>
                    <span className={styles.momentTime}>{post.time}</span>
                    <span
                      className={styles.momentShowAll}
                      onClick={() => {
                        setSelectedPost(post);
                        setIsDetailModalOpen(true);
                      }}
                      style={{ cursor: 'pointer', color: '#A8C3A8', fontWeight: 'bold' }}
                    >
                      [전체보기]
                    </span>
                  </div>
                </div>
                ))}
            </div>

            <p>오늘 많이 공유된 감정</p>
            <div className="moment-card">
                
            </div>

            <p>오늘의 감정 한 줄 </p>
            <div className="moment-card">
               {feelingText && <p>{feelingText}</p>}
            </div>

          </div>

        </div>

        {/* 우측 상단 영역 */}
        <div className="right-panel">
          <div className="top-bar">
            <div className="search-container">
              <input
                type="text"
                className="search-input"
                placeholder="제목을 입력하세요"
              />
              <button className="search-btn">
                <FaSearch />
              </button>
            </div>
            <button className="login-btn" onClick={() => setShowModal(true)}>로그인</button>
            <div className="profile">👤</div>
          </div>
        </div>
      </div>

      {/* 로그인 모달 */}
      {showModal && <LoginModal onClose={() => setShowModal(false)} />}
      
      {/* 상세페이지 모달 */}
      {isDetailModalOpen && selectedPost && (
      <PostDetailModal post={selectedPost} onClose={() => setIsDetailModalOpen(false)} />)}
    </div>
  );
};

export default MomentsPage;
