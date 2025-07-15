// MomentsPage 에서 임포트함 
import React from 'react';
import styles from '../assets/css/PostDetailModal.module.css';

const PostDetailModal = ({ post, onClose }) => {
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
        <div className={styles.momentLikes}>💛 {post.likes}</div>
      </div>
    </div>
  );
};

export default PostDetailModal;
