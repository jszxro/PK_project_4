// MomentsPage 에서 임포트함 
import React from 'react';
import styles from '../assets/css/PostDetailModal.module.css';
import { useEffect, useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import axios from 'axios';


const PostDetailModal = ({ post, onClose, onReactionChange }) => {
  const [userReaction, setUserReaction] = useState(null); // 현재 사용자의 좋아요 여부
  const [likeCount, setLikeCount] = useState(post.likes); // 전체 좋아요 수
  const { userInfo } = useContext(UserContext);

  // 하트 수 가져오기
  useEffect(() => {
    // 좋아요 상태와 함께 좋아요 수도 서버에서 불러오기
    axios.get(`/api/reactions/check?postId=${post.id}&userKey=${userInfo.userKey}`)
      .then(res => {
        setUserReaction(res.data.reactionType); // 1 또는 0
      })
      .catch(err => {
        console.error("좋아요 상태 조회 실패:", err);
      });

    // 좋아요 총 개수도 따로 조회
    axios.get(`/api/reactions/count?postId=${post.id}`)
      .then(res => {
        setLikeCount(res.data.count); // 서버가 리턴하는 count 값
      })
      .catch(err => {
        console.error("좋아요 수 조회 실패:", err);
      });

  }, [post.id]);

  // 하트클릭
  const toggleReaction = () => {
    axios.post(`/api/reactions/toggle`, {
      postId: post.id,
      userKey: userInfo.userKey
    })
      .then(res => {
        const newReactionType = res.data.reactionType;
        setUserReaction(newReactionType);

        // 좋아요 수 증감 처리
        if (newReactionType === 1) {
          setLikeCount(prev => prev + 1);
        } else {
          setLikeCount(prev => prev - 1);
        }

        // 💡 부모에게 알림
        if (onReactionChange) {
          onReactionChange(newReactionType);
        }
      })
      .catch(err => {
        console.error("좋아요 토글 실패:", err);
      });
  };
  if (!post) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>✖</button>

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
            {post.url}
          </a>
        </div>

        <p className={styles.momentContent}>{post.content}</p>
        <div className={styles.momentLikes} onClick={toggleReaction} style={{ cursor: 'pointer' }}>
          {userReaction === 1 ? "💛" : "🤍"} {likeCount}
        </div>
      </div>
    </div>
  );
};

export default PostDetailModal;
