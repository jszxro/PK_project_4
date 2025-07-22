import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import axios from 'axios';

const MomentDetail = () => {
    const { userInfo } = useContext(UserContext);
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!userInfo) {
            alert('로그인이 필요합니다.');
            // navigate('/login');
            return;
        }

        axios.get(`/api/posts/${postId}`)
            .then(res => setPost(res.data))
            .catch(err => {
                console.error('상세 게시글 로딩 실패:', err);
                alert('게시글을 불러오지 못했습니다.');
                navigate('/moments');
            });
    }, [postId, userInfo]);

    if (!post) return <div>불러오는 중...</div>;

    return (
        <div style={{ padding: '2rem' }}>
            <h2>{post.title}</h2>
            <img src={post.imgUrl} alt="썸네일" style={{ maxWidth: '400px' }} />
            <p>{post.content}</p>
            <p>작성자: {post.author}</p>
            <p>감정: #{post.emojiId}</p>
            <a href={post.url} target="_blank" rel="noopener noreferrer">🔗 유튜브 링크</a>
        </div>
    );
};

export default MomentDetail;
