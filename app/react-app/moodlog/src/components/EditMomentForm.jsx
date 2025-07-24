import React, { useState } from 'react';
import axios from 'axios';

const EditMomentForm = ({ post, onSave, onCancel }) => {
    const [title, setTitle] = useState(post.title || '');
    const [content, setContent] = useState(post.content || '');
    const [url, setUrl] = useState(post.url || '');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const updatedPost = {
                title,
                content,
                url,
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
        <div style={{ marginTop: '2rem' }}>
            <h3>✏️ 게시글 수정</h3>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>제목:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>내용:</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={5}
                        required
                    />
                </div>
                <div>
                    <label>유튜브 링크:</label>
                    <input
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                    />
                </div>
                <button type="submit">저장</button>
                <button type="button" onClick={onCancel} style={{ marginLeft: '1rem' }}>
                    취소
                </button>
            </form>
        </div>
    );
};

export default EditMomentForm;