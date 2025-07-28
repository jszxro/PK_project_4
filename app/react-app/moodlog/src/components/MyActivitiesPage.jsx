import '../App.css';
import { useNavigate } from 'react-router-dom';
import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import styles from '../assets/css/MyActivitiesPage.module.css';
import { UserContext } from '../context/UserContext';

function MyActivitiesPage() {
  const navigate = useNavigate();
  const { userInfo } = useContext(UserContext);
  const [postList, setPostList] = useState([]);
  const [commentList, setCommentList] = useState([]);
  const [activeTab, setActiveTab] = useState('posts'); // 'posts' 또는 'comments'

  // 페이지 로드 시 데이터 가져오기
  useEffect(() => {
    const loadData = async () => {
      const userKey = userInfo?.userKey || localStorage.getItem('userKey');
      if (!userKey) {
        navigate('/'); // 로그인하지 않은 경우 홈으로 이동
        return;
      }

      try {
        // 포스트 데이터 로드
        const postsResponse = await axios.get('/api/posts');
        const userPosts = postsResponse.data.filter(post => post.userKey === userKey);
        setPostList(userPosts);

        // 댓글 데이터 로드
        const commentsResponse = await axios.get(`/api/comments/user/${userKey}`);
        setCommentList(commentsResponse.data);
      } catch (error) {
        console.error('데이터 로드 실패:', error);
      }
    };

    loadData();
  }, [userInfo, navigate]);

  const handlePostClick = (postId) => {
    navigate('/moments', { state: { highlightPostId: postId } });
  };

  const handleCommentClick = (postId) => {
    navigate('/moments', { state: { highlightPostId: postId } });
  };

  return (
    <div className="layout">
      <div className={styles.activitiesPanel}>
        {/* 헤더 */}
        <div className={styles.header}>
          <button
            className={styles.backButton}
            onClick={() => navigate('/archive')}
          >
            ← 아카이브로 돌아가기
          </button>
          <h2>내 활동 내역</h2>
          <div className={styles.userInfo}>
            <span>{userInfo?.nickname || '사용자'}님의 활동</span>
          </div>
        </div>

        {/* 탭 메뉴 */}
        <div className={styles.tabMenu}>
          <button
            className={`${styles.tabButton} ${activeTab === 'posts' ? styles.active : ''}`}
            onClick={() => setActiveTab('posts')}
          >
            📌 내가 쓴 포스트 ({postList.length})
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === 'comments' ? styles.active : ''}`}
            onClick={() => setActiveTab('comments')}
          >
            💬 내가 쓴 댓글 ({commentList.length})
          </button>
        </div>

        {/* 컨텐츠 */}
        <div className={styles.content}>
          {activeTab === 'posts' ? (
            <div className={styles.postsSection}>
              <h3>📌 내가 작성한 포스트</h3>
              {postList.length > 0 ? (
                <div className={styles.itemsList}>
                  {postList.map((post, index) => (
                    <div
                      key={index}
                      className={styles.postItem}
                      onClick={() => handlePostClick(post.postId)}
                    >
                      <div className={styles.itemHeader}>
                        <span className={styles.emoji}>#{post.emojiId}</span>
                        <h4 className={styles.title}>{post.title}</h4>
                        <span className={styles.date}>
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className={styles.content}>
                        {post.content}
                      </div>
                      <div className={styles.itemFooter}>
                        <span className={styles.likes}>💛 {post.likes}</span>
                        <span className={styles.clickHint}>클릭하여 Moments에서 보기 →</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <p>아직 작성한 포스트가 없습니다.</p>
                  <button
                    className={styles.createButton}
                    onClick={() => navigate('/moments')}
                  >
                    첫 포스트 작성하기
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className={styles.commentsSection}>
              <h3>💬 내가 작성한 댓글</h3>
              {commentList.length > 0 ? (
                <div className={styles.itemsList}>
                  {commentList.map((comment, index) => (
                    <div
                      key={index}
                      className={styles.commentItem}
                      onClick={() => handleCommentClick(comment.postId)}
                    >
                      <div className={styles.itemHeader}>
                        <span className={styles.commentIcon}>💬</span>
                        <span className={styles.postId}>Post #{comment.postId}에 작성한 댓글</span>
                        <span className={styles.date}>
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className={styles.content}>
                        {comment.content}
                      </div>
                      <div className={styles.itemFooter}>
                        <span className={styles.clickHint}>클릭하여 해당 포스트 보기 →</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <p>아직 작성한 댓글이 없습니다.</p>
                  <button
                    className={styles.createButton}
                    onClick={() => navigate('/moments')}
                  >
                    Moments에서 댓글 남기기
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyActivitiesPage;
