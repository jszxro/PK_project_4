import React, { useState } from 'react';
import axios from 'axios';
import styles from '../assets/css/EditMomentForm.module.css';

const EditMomentForm = ({ post, onSave, onCancel }) => {
    const [title, setTitle] = useState(post.title || post.content_title || '');
    const [content, setContent] = useState(post.content || '');
    const [url, setUrl] = useState(post.url || '');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const updatedPost = {
                title,
                content,
                url,
                userKey: post.userKey,
            };

            await axios.put(`/api/posts/${post.postId || post.id}`, updatedPost);

            // 수정된 post 정보를 상위에 전달
            if (onSave) onSave({ ...post, ...updatedPost });
        } catch (error) {
            console.error('게시글 수정 실패:', error);
            alert('수정에 실패했습니다.');
        }
    };

    return (
      <div className={styles.overlay}>
        <div className={styles.modalBox}>
          <h3>✏️ 게시글 수정</h3>
          <form onSubmit={handleSubmit}>
            <div>
              <label>유튜브 링크</label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
            <div>
              <label>제목</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <label>내용</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
                required
              />
            </div>
            <div className={styles.buttonRow}>
              <button type="submit" className={styles.saveButton}>수정</button>
              <button type="button" onClick={onCancel} className={styles.cancelButton}>닫기</button>
            </div>
          </form>
        </div>
      </div>
    );

};

export default EditMomentForm;