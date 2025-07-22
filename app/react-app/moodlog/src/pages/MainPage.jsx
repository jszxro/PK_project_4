// MainPage.jsx
import '../App.css';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useContext } from 'react';
import LoginModal from '../components/LoginModal';
import { UserContext } from '../context/UserContext';
import axios from 'axios';

function MainPage({ isLoggedIn, setIsLoggedIn }) {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const { userInfo } = useContext(UserContext);

  // ✅ 추가됨: 전체 게시글 상태와 페이지네이션 상태
  const [allPosts, setAllPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;

  // ✅ 추가됨: 현재 페이지에 표시할 게시글 범위 계산
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = allPosts.slice(indexOfFirstPost, indexOfLastPost);

  const totalPages = Math.ceil(allPosts.length / postsPerPage); // ✅ 추가됨
  const paginate = (pageNumber) => setCurrentPage(pageNumber);   // ✅ 추가됨

  // ✅ 기존과 동일한 axios 요청, 단 상태만 latestPosts → allPosts 로 수정
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
        setAllPosts(mappedPosts); // ✅ 수정됨
      })
      .catch(err => console.error('최신 게시글 가져오기 실패:', err));
  }, []);

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
            {currentPosts.length > 0 ? ( // ✅ latestPosts → currentPosts 로 변경
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

            {/* ✅ 추가됨: 페이지네이션 UI */}
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
